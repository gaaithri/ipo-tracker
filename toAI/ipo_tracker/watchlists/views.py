'''docs'''
# Create your views here.
# watchlists/views.py
from django.db import models
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Watchlist

class WatchlistView(APIView):
    ''' docs'''
    permission_classes = [IsAuthenticated]

    def post(self, request, ipo_id):
        ''' docs '''
        Watchlist.objects.get_or_create(
            user=request.user, ipo_id=ipo_id
        )
        return Response({"status": "added"})

    def delete(self, request, ipo_id):
        ''' docs '''
        Watchlist.objects.filter(
            user=request.user, ipo_id=ipo_id
        ).delete()
        return Response({"status": "removed"})

    def get(self, request):
        return Response([
            wl.ipo.company_name
            for wl in Watchlist.objects.filter(user=request.user)
        ])
