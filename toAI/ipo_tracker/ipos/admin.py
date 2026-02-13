from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import IPO

# Register your models here.
@admin.register(IPO)
class IPOAdmin(admin.ModelAdmin):
    ''' docs'''
    list_display = ('company_name', 'exchange', 'ticker_symbol', 'issue_open_date', 'listing_date')
    list_filter = ('exchange', 'issue_open_date', 'listing_date')
    search_fields = ('company_name', 'ticker_symbol')
    readonly_fields = ('last_updated_at',)