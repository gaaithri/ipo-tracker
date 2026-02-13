from django.db import models

''' doc '''
class IPO(models.Model):
    ''' IPO class obj'''
    company_name = models.CharField(max_length=255)
    exchange = models.CharField(max_length=10)  # NSE / BSE
    ticker_symbol = models.CharField(max_length=20, unique=True)

    issue_open_date = models.DateField()
    issue_close_date = models.DateField()
    listing_date = models.DateField(null=True, blank=True)

    price_band_min = models.DecimalField(max_digits=10, decimal_places=2)
    price_band_max = models.DecimalField(max_digits=10, decimal_places=2)
    lot_size = models.IntegerField()

    last_updated_at = models.DateTimeField(auto_now=True)
    objects = models.Manager()

    class Meta:
        ''' meta'''
        indexes = [
            models.Index(fields=["issue_open_date"]),
            models.Index(fields=["issue_close_date"]),
        ]

    def __str__(self):
        '''methods'''
        return str(self.company_name)
