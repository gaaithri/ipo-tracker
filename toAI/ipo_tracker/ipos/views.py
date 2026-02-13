# ipos/views.py
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.utils.timezone import now
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator

from .models import IPO
from .serializer import IPOSerializer

class IPOListView(ListAPIView):
    '''docs'''
    serializer_class = IPOSerializer

    def get_queryset(self):
        '''docs'''
        qs = IPO.objects.all()
        status = self.request.query_params.get("status")
        today = now().date()

        if status == "upcoming":
            qs = qs.filter(issue_open_date__gt=today)
        elif status == "current":
            qs = qs.filter(issue_open_date__lte=today, issue_close_date__gte=today)
        elif status == "listed":
            qs = qs.filter(issue_close_date__lt=today)

        return qs.order_by("issue_open_date")


@method_decorator(cache_page(60 * 60 * 6), name="dispatch")
class IPODetailView(RetrieveAPIView):
    '''docs'''
    queryset = IPO.objects.all()
    serializer_class = IPOSerializer

# Create your views here.
