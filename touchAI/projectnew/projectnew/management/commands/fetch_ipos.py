from django.core.management.base import BaseCommand
from projectnew.datafetcher import fetch_upcoming_ipos
from projectnew.models import IPO, SyncLog
from datetime import datetime, date
from decimal import Decimal, InvalidOperation


def _parse_date(value):
    if not value:
        return None
    if isinstance(value, (datetime, date)):
        return value if isinstance(value, date) else value.date()
    try:
        return datetime.fromisoformat(value).date()
    except Exception:
        for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%Y"):
            try:
                return datetime.strptime(value, fmt).date()
            except Exception:
                continue
    return None


def _get_any(obj, *keys):
    for k in keys:
        v = obj.get(k)
        if v is not None and v != "":
            return v
    return None


def _parse_decimal(value):
    if value is None or value == "":
        return None
    try:
        s = str(value).replace(",", "").replace("%", "")
        return Decimal(s)
    except (InvalidOperation, TypeError, ValueError):
        return None


def _parse_price_range(value):
    """Parse price range like '100-120' or 'Rs. 100 - 120' into (low, high) Decimals"""
    if not value:
        return None, None
    try:
        s = str(value)
        # replace common separators
        s = s.replace("Rs.", "").replace("INR", "").replace(" `", "").strip()
        # split on dash or to
        if "-" in s:
            parts = s.split("-")
        elif "to" in s:
            parts = s.split("to")
        else:
            parts = [s]
        low = _parse_decimal(parts[0]) if parts else None
        high = _parse_decimal(parts[1]) if len(parts) > 1 else low
        return low, high
    except Exception:
        return None, None


def _parse_issue_size(value):
    """Extract numeric crore amount from strings like '192 crores' or numeric values."""
    if value is None:
        return None
    if isinstance(value, (int, float, Decimal)):
        return Decimal(value)
    s = str(value).lower().replace(",", "")
    try:
        # Extract all numeric chars (including decimal points)
        num_str = "".join(ch for ch in s if (ch.isdigit() or ch == "."))
        return Decimal(num_str) if num_str else None
    except Exception:
        return None


class Command(BaseCommand):
    help = "Fetch upcoming IPOs from remote API and store/update local DB"

    def add_arguments(self, parser):
        parser.add_argument("--days", type=int, default=30, help="How many days ahead to fetch")
        parser.add_argument("--page", type=int, default=1, help="Page number (default 1)")

    def handle(self, *args, **options):
        days = options.get("days", 30)
        page = options.get("page", 1)
        
        try:
            response = fetch_upcoming_ipos(days, page)
            items = response.get("ipos", [])
            meta = response.get("meta", {})

            if not items:
                self.stdout.write(self.style.WARNING("No items fetched."))
                # log empty but successful fetch
                SyncLog.objects.create(status='success', synced_count=0, days_ahead=days, page=page)
                return

            processed = 0
            for it in items:
            name = _get_any(it, "name", "company", "company_name", "title")
            ticker = _get_any(it, "ticker", "symbol", "code") or ""

            if not name:
                continue

            # Dates
            open_date = _parse_date(_get_any(it, "open_date", "from", "from_date", "date")) or date.today()
            close_date = _parse_date(_get_any(it, "close_date", "to", "to_date")) or open_date
            listing_date = _parse_date(_get_any(it, "listing_date", "listing_on", "listed_date"))

            # Numeric fields (may be strings)
            price_low = _parse_decimal(_get_any(it, "price_band_low", "price_low", "low_price", "low"))
            price_high = _parse_decimal(_get_any(it, "price_band_high", "price_high", "high_price", "high"))

            # handle sample fields: priceRange
            pr = _get_any(it, "priceRange", "price_range")
            if pr and (not price_low and not price_high):
                pl, ph = _parse_price_range(pr)
                if pl:
                    price_low = pl
                if ph:
                    price_high = ph
            issue_size = _parse_decimal(_get_any(it, "issue_size_crores", "issue_size", "size", "issue_size_in_crores"))
            # sample field 'issueSize' may be string like '192 crores' or numeric
            if not issue_size:
                issue_size = _parse_issue_size(_get_any(it, "issueSize", "issue_size"))

            # Parse minQty and minAmount from sample response
            min_qty = _parse_decimal(_get_any(it, "minQty", "min_qty"))
            min_amount = _parse_decimal(_get_any(it, "minAmount", "min_amount"))

            revenue = _parse_decimal(_get_any(it, "revenue_crores", "revenue", "sales"))
            ebitda = _parse_decimal(_get_any(it, "ebitda_crores", "ebitda"))
            pat = _parse_decimal(_get_any(it, "pat_crores", "pat", "profit_after_tax"))

            ebitda_margin = _parse_decimal(_get_any(it, "ebitda_margin_pct", "ebitda_margin", "ebitda_margin_percentage"))
            pat_margin = _parse_decimal(_get_any(it, "pat_margin_pct", "pat_margin", "pat_margin_percentage"))
            roce = _parse_decimal(_get_any(it, "roce_pct", "roce"))

            debt_to_equity = _parse_decimal(_get_any(it, "debt_to_equity", "dte", "debt_equity"))
            current_ratio = _parse_decimal(_get_any(it, "current_ratio", "cr", "currentRatio"))

            eps = _parse_decimal(_get_any(it, "eps", "earnings_per_share"))
            pe = _parse_decimal(_get_any(it, "pe", "pe_ratio"))
            book_value = _parse_decimal(_get_any(it, "book_value", "bookValue"))
            pb = _parse_decimal(_get_any(it, "pb", "pb_ratio"))

            # Text fields
            exchange = _get_any(it, "exchange", "market") or "BOTH"
            underwriters = _get_any(it, "underwriters", "lead_managers") or ""
            valuation_comment = _get_any(it, "valuation_comment", "valuation") or ""
            business_description = _get_any(it, "business_description", "description", "business", "about") or ""
            geography_focus = _get_any(it, "geography_focus", "region") or ""
            management_summary = _get_any(it, "management_summary", "management") or ""
            competitor_analysis = _get_any(it, "competitor_analysis", "competitors") or ""
            usp = _get_any(it, "usp", "key_strengths") or (", ".join(_get_any(it, "strengths") or []) if _get_any(it, "strengths") else "")

            # add risks and listingGain into valuation_comment for reference
            extra_notes = []
            risks = _get_any(it, "risks")
            if risks:
                if isinstance(risks, (list, tuple)):
                    extra_notes.append("Risks: " + ", ".join(map(str, risks)))
                else:
                    extra_notes.append("Risks: " + str(risks))

            listing_gain = _get_any(it, "listingGain", "listing_gain")
            if listing_gain:
                extra_notes.append("ListingGain: " + str(listing_gain))

            if extra_notes:
                if valuation_comment:
                    valuation_comment = valuation_comment + "\n" + "; ".join(extra_notes)
                else:
                    valuation_comment = "; ".join(extra_notes)

            defaults = {
                "ticker": ticker or name[:10],
                "exchange": exchange,
                "price_band_low": price_low or Decimal("0.00"),
                "price_band_high": price_high or Decimal("0.00"),
                "issue_size_crores": issue_size or Decimal("0.00"),
                "min_qty": min_qty,
                "min_amount": min_amount,
                "open_date": open_date,
                "close_date": close_date,
                "listing_date": listing_date,
                "underwriters": underwriters,
                "revenue_crores": revenue,
                "ebitda_crores": ebitda,
                "pat_crores": pat,
                "ebitda_margin_pct": ebitda_margin,
                "pat_margin_pct": pat_margin,
                "roce_pct": roce,
                "debt_to_equity": debt_to_equity,
                "current_ratio": current_ratio,
                "eps": eps,
                "pe": pe,
                "book_value": book_value,
                "pb": pb,
                "valuation_comment": valuation_comment,
                "business_description": business_description,
                "geography_focus": geography_focus,
                "management_summary": management_summary,
                "competitor_analysis": competitor_analysis,
                "usp": usp,
            }

            ipo, created = IPO.objects.get_or_create(name=name, ticker=ticker or name[:10], defaults=defaults)

            # Update non-defaultable fields if present
            changed = False

            def _set_if(atr, new_val):
                nonlocal changed
                if new_val is None:
                    return
                current = getattr(ipo, atr, None)
                # Compare Decimals carefully
                if isinstance(new_val, Decimal):
                    if current is None or Decimal(current) != new_val:
                        setattr(ipo, atr, new_val)
                        changed = True
                else:
                    if current != new_val:
                        setattr(ipo, atr, new_val)
                        changed = True

            _set_if("open_date", open_date)
            _set_if("close_date", close_date)
            if listing_date:
                _set_if("listing_date", listing_date)

            _set_if("price_band_low", price_low or Decimal("0.00"))
            _set_if("price_band_high", price_high or Decimal("0.00"))
            _set_if("issue_size_crores", issue_size or Decimal("0.00"))

            _set_if("min_qty", min_qty)
            _set_if("min_amount", min_amount)

            _set_if("revenue_crores", revenue)
            _set_if("ebitda_crores", ebitda)
            _set_if("pat_crores", pat)

            _set_if("ebitda_margin_pct", ebitda_margin)
            _set_if("pat_margin_pct", pat_margin)
            _set_if("roce_pct", roce)

            _set_if("debt_to_equity", debt_to_equity)
            _set_if("current_ratio", current_ratio)

            _set_if("eps", eps)
            _set_if("pe", pe)
            _set_if("book_value", book_value)
            _set_if("pb", pb)

            _set_if("underwriters", underwriters)
            _set_if("valuation_comment", valuation_comment)
            _set_if("business_description", business_description)
            _set_if("geography_focus", geography_focus)
            _set_if("management_summary", management_summary)
            _set_if("competitor_analysis", competitor_analysis)
            _set_if("usp", usp)

            if changed:
                ipo.save()

            processed += 1

            msg = f"Processed {processed} IPO items."
            if meta:
                msg += f" | Page {meta.get('page', 1)}/{meta.get('totalPages', 1)} | Total: {meta.get('count', 0)} IPOs"
            # record successful sync
            SyncLog.objects.create(status='success', synced_count=processed, days_ahead=days, page=page)
            self.stdout.write(self.style.SUCCESS(msg))
        except Exception as e:
            # record failed sync
            try:
                SyncLog.objects.create(status='failed', synced_count=0, days_ahead=days, page=page, error_message=str(e))
            except Exception:
                pass
            raise
