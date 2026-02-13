# ipos/management/commands/ingest_ipos.py
from django.core.management.base import BaseCommand
from django.db import transaction
from ipos.models import IPO
from ipos.utils import get_ipo_status
from alerts.models import Alert
from watchlists.models import Watchlist
from ipo_tracker.ingestion.fetchers import fetch_external_data




class Command(BaseCommand):
    ''' command class'''
    help = "Ingest IPO data"
    def handle(self, *args, **_kwargs):
        external_data = fetch_external_data()

        with transaction.atomic():
            for data in external_data:
                ipo, _created = IPO.objects.update_or_create(
                    ticker_symbol=data["ticker"],
                    defaults=data
                )
                if _created:
                    self.stdout.write(f"New IPO created: {ipo.ticker_symbol}")

                self.generate_alerts(ipo)

    def generate_alerts(self, ipo):
        '''docs'''
        status = get_ipo_status(ipo)
        users = Watchlist.objects.filter(
            ipo=ipo
        ).values_list("user_id", flat=True)

        for user_id in users:
            Alert.objects.get_or_create(
                user_id=user_id,
                ipo=ipo,
                alert_type=f"IPO_{status.upper()}",
            )
