from django.shortcuts import render

# Create your views here.
# alerts/views.py
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Alert
from rest_framework import serializers

class AlertSerializer(serializers.ModelSerializer):
    '''docs'''
    class Meta:
        model = Alert
        fields = "__all__"

class AlertListView(ListAPIView):
    '''docs'''
    permission_classes = [IsAuthenticated]
    serializer_class = AlertSerializer

    def get_queryset(self):
        return Alert.objects.filter(
            user=self.request.user
        ).order_by("-created_at")# type: ignore[attr-defined]
