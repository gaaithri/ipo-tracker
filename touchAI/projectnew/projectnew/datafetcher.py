'''data fetcge '''

from datetime import date, timedelta
import os
import requests
import time

# Read API key from environment to avoid hardcoding secrets
API_KEY = os.getenv("IPO_API_KEY", "YOUR_KEY")
BASE_URL = "https://api.ipoalerts.in/ipos"

def fetch_upcoming_ipos(days_ahead=30, page=1):
    ''' fetch IPOS from API (single page due to rate limiting) '''
    today = date.today()
    to_date = today + timedelta(days=days_ahead)
    
    # Use x-api-key header
    headers = {
        "x-api-key": API_KEY
    }
    params = {
        "status": "open",
        "limit": 1,  # API constraint: limit must be <= 1
        "page": page
    }
    
    # Retry logic with exponential backoff for rate limiting
    max_retries = 3
    for attempt in range(max_retries):
        try:
            resp = requests.get(BASE_URL, params=params, headers=headers, timeout=10)
            resp.raise_for_status()
            break
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 429:  # Too Many Requests
                wait_time = 2 ** (attempt + 1)  # exponential: 2, 4, 8 seconds
                if attempt < max_retries - 1:
                    print(f"Rate limited (429). Waiting {wait_time}s before retry...")
                    time.sleep(wait_time)
                else:
                    raise
            else:
                raise
    
    data = resp.json()
    
    # API wraps IPOs in 'ipos' key
    ipos = data.get("ipos", [])
    meta = data.get("meta", {})
    
    return {
        "ipos": ipos,
        "meta": meta
    }
