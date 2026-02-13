

# ipo_tracker/ingestion/fetchers.py

def fetch_external_data():
    """Fetch IPO data from external sources"""

    # Stage 1 mock
    return [
        {
            "ticker": "TCSIPO",
            "company_name": "TCS Limited",
            "price_band_low": 700,
            "price_band_high": 750,
            "lot_size": 20,
            "open_date": "2026-02-10",
            "close_date": "2026-02-14",
            "exchange": "NSE"
        }
    ]
