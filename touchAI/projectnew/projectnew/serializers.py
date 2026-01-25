# serializers.py
from rest_framework import serializers
from .models import IPO

class IPOSerializer(serializers.ModelSerializer):
    '''name '''
    class Meta:
        ''' meta'''
        model = IPO
        fields = "__all__"
