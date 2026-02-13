# ipos/urls.py
from django.urls import path
from .views import IPOListView, IPODetailView

urlpatterns = [
    path("ipos/", IPOListView.as_view()),
    path("ipos/<int:pk>/", IPODetailView.as_view()),
]
