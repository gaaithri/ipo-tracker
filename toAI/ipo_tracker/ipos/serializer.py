# ipos/serializers.py
''' What is serialiser - data is serialised >'''
from rest_framework import serializers
from .models import IPO
from .utils import get_ipo_status

class IPOSerializer(serializers.ModelSerializer):
    ''' IPO'''
    status = serializers.SerializerMethodField()

    class Meta:
        ''' Method class'''
        model = IPO
        fields = "__all__"

    def get_status(self, obj):
        ''' get statius'''
        return get_ipo_status(obj)
