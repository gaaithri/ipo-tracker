'''data fetcge '''

from datetime import date, timedelta

import requests

API_KEY = "YOUR_KEY"
BASE_URL = "https://eodhd.com/api/calendar/ipos"

def fetch_upcoming_ipos(days_ahead=30):
    ''' fetch IPOS '''
    today = date.today()
    to_date = today + timedelta(days=days_ahead)
    params = {
        "api_token": API_KEY,
        "from": today.isoformat(),
        "to": to_date.isoformat(),
        "fmt": "json",
    }
    resp = requests.get(BASE_URL, params=params, timeout=10)
    resp.raise_for_status()
    return resp.json()
