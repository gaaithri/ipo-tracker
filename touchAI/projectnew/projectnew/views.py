# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import IPO, SyncLog
from .serializers import IPOSerializer
from .datafetcher import fetch_upcoming_ipos
from datetime import date
from decimal import Decimal
from django.utils import timezone


class IPOViewSet(viewsets.ModelViewSet):
    ''' IPO dataset '''
    queryset = IPO.objects.all().order_by("open_date")
    serializer_class = IPOSerializer

    @action(detail=False, methods=['post'], url_path='sync-from-api', url_name='sync-from-api')
    def sync_from_api(self, request):
        """
        Fetch upcoming IPOs from external API and sync to database.
        Query param: days (default 30), page (default 1)
        """
        try:
            days = int(request.query_params.get('days', 30))
        except ValueError:
            days = 30

        try:
            page = int(request.query_params.get('page', 1))
        except ValueError:
            page = 1

        try:
            # Fetch from external API (returns dict with 'ipos' and 'meta' keys)
            response = fetch_upcoming_ipos(days, page)
            items = response.get('ipos', [])
            
            if not items:
                return Response(
                    {'detail': 'No items fetched from API', 'synced': 0},
                    status=status.HTTP_200_OK
                )

            synced_count = 0
            for item in items:
                # Extract core fields (same logic as management command)
                name = item.get('name') or item.get('company') or item.get('company_name') or item.get('title')
                symbol = item.get('symbol') or item.get('ticker') or item.get('code') or ''

                if not name:
                    continue

                # Try to parse dates
                from datetime import datetime
                def parse_date(val):
                    if not val:
                        return None
                    if isinstance(val, date):
                        return val
                    try:
                        return datetime.fromisoformat(val).date()
                    except Exception:
                        try:
                            return datetime.strptime(val, "%Y-%m-%d").date()
                        except Exception:
                            return None

                open_date = parse_date(item.get('startDate') or item.get('open_date')) or date.today()
                close_date = parse_date(item.get('endDate') or item.get('close_date')) or open_date
                listing_date = parse_date(item.get('listingDate') or item.get('listing_date'))

                # Basic decimal parsing
                def parse_decimal(val):
                    if not val:
                        return None
                    try:
                        return Decimal(str(val).replace(',', '').replace('%', ''))
                    except Exception:
                        return None

                defaults = {
                    'ticker': symbol or name[:10],
                    'exchange': item.get('exchange', 'BOTH'),
                    'price_band_low': parse_decimal(item.get('price_band_low')) or Decimal('0.00'),
                    'price_band_high': parse_decimal(item.get('price_band_high')) or Decimal('0.00'),
                    'issue_size_crores': parse_decimal(item.get('issueSize') or item.get('issue_size_crores')) or Decimal('0.00'),
                    'min_qty': parse_decimal(item.get('minQty')),
                    'min_amount': parse_decimal(item.get('minAmount')),
                    'open_date': open_date,
                    'close_date': close_date,
                    'listing_date': listing_date,
                }

                ipo, created = IPO.objects.get_or_create(
                    name=name,
                    ticker=symbol or name[:10],
                    defaults=defaults
                )
                synced_count += 1

            # record successful sync
            try:
                SyncLog.objects.create(status='success', synced_count=synced_count, days_ahead=days, page=int(request.query_params.get('page', 1)))
            except Exception:
                pass

            return Response(
                {'detail': f'Synced {synced_count} IPOs from API', 'synced': synced_count},
                status=status.HTTP_200_OK
            )

        except Exception as e:
            try:
                SyncLog.objects.create(status='failed', synced_count=0, days_ahead=days, page=int(request.query_params.get('page', 1)), error_message=str(e))
            except Exception:
                pass
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['get'], url_path='sync-stats', url_name='sync-stats')
    def sync_stats(self, request):
        """Return successful sync counts for today and current month."""
        now = timezone.now()
        today = now.date()
        month = now.month
        year = now.year

        success_today = SyncLog.objects.filter(status='success', created_at__date=today).count()
        success_month = SyncLog.objects.filter(status='success', created_at__year=year, created_at__month=month).count()

        return Response({
            'success_today': success_today,
            'success_month': success_month,
        }, status=status.HTTP_200_OK)
