# watchlists/urls.py
from django.urls import path
from .views import WatchlistView

urlpatterns = [
    path("watchlist/<int:ipo_id>/", WatchlistView.as_view()),
    path("watchlist/", WatchlistView.as_view()),
]
