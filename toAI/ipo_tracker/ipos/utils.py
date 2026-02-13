# ipos/utils.py
from django.utils.timezone import now

def get_ipo_status(ipo):
    ''' get Stataus of IPO displayed'''
    today = now().date()

    if today < ipo.issue_open_date:
        return "upcoming"
    elif ipo.issue_open_date <= today <= ipo.issue_close_date:
        return "current"
    return "listed"
