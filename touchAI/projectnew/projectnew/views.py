# views.py
from rest_framework import viewsets
from .models import IPO
from .serializers import IPOSerializer

class IPOViewSet(viewsets.ModelViewSet):
    ''' IPO dataset '''
    queryset = IPO.objects.all().order_by("open_date")
    serializer_class = IPOSerializer
