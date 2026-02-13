# Create your models here.
# alerts/models.py
from django.db import models
from django.contrib.auth.models import User
from ipos.models import IPO

class Alert(models.Model):
    '''docs'''
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ipo = models.ForeignKey(IPO, on_delete=models.CASCADE)
    alert_type = models.CharField(max_length=50)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    objects: models.Manager['Alert'] = models.Manager()
