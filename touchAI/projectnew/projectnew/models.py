''' module '''
from django.db import models
class IPO(models.Model):
    ''' class IPO '''
    # Basics
    objects = models.Manager()
    ''' name added '''
    name = models.CharField(max_length=200)
    ticker = models.CharField(max_length=20)
    EXCHANGE_CHOICES = [
        ("NSE", "NSE"),
        ("BSE", "BSE"),
        ("BOTH", "Both"),
    ]
    exchange = models.CharField(max_length=10, choices=EXCHANGE_CHOICES)
    price_band_low = models.DecimalField(max_digits=10, decimal_places=2)
    price_band_high = models.DecimalField(max_digits=10, decimal_places=2)
    issue_size_crores = models.DecimalField(max_digits=12, decimal_places=2)
    open_date = models.DateField()
    close_date = models.DateField()
    listing_date = models.DateField(null=True, blank=True)
    underwriters = models.TextField(blank=True)

    # Profitability
    revenue_crores = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    ebitda_crores = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    pat_crores = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    ebitda_margin_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    pat_margin_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    roce_pct = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Balance sheet
    debt_to_equity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    current_ratio = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)

    # Valuation
    eps = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    pe = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    book_value = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pb = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    valuation_comment = models.TextField(blank=True)

    # Qualitative
    business_description = models.TextField(blank=True)
    geography_focus = models.CharField(max_length=200, blank=True)
    management_summary = models.TextField(blank=True)
    competitor_analysis = models.TextField(blank=True)
    usp = models.TextField(blank=True)

    # Meta
    created_at = models.DateTimeField(auto_now_add=True)

    is_favourite = models.BooleanField(default=False)


    def __str__(self):
        return f"{self.name} ({self.ticker})"
