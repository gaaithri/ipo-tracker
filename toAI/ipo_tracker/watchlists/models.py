''' docs'''
# Create your models here.
# watchlists/models.py
from django.contrib.auth.models import User
from django.db import models
from ipos.models import IPO

class Watchlist(models.Model):
    """
    Model representing a user's watchlist entry for an IPO.

    This model tracks which IPOs a user is monitoring. Each watchlist entry
    creates a unique association between a user and an IPO, ensuring that
    a user can only add the same IPO to their watchlist once.

    Attributes:
        user: ForeignKey to User model, identifies the user who created the watchlist entry.
        ipo: ForeignKey to IPO model, identifies the IPO being watched.
        created_at: DateTime field that automatically records when the watchlist entry was created.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ipo = models.ForeignKey(IPO, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    objects: models.Manager['Watchlist'] = models.Manager()

    class Meta:
        ''' docs'''
        unique_together = ("user", "ipo")
