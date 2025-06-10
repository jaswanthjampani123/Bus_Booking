
from django.urls import path
from .views import BusDetailview, MockPaymentView, RegisterView, LoginView, BusListCreateView, UserBookingView, BookingView

urlpatterns = [
    path('buses/', BusListCreateView.as_view(), name='buslist'),
    path('buses/<int:pk>/', BusDetailview.as_view(), name='bus-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('user/<int:user_id>/bookings/', UserBookingView.as_view(), name='userbookings'),
    path('booking/', BookingView.as_view(), name='booking'),
    path('mock-payments/', MockPaymentView.as_view(), name='mock-payments'),
]
