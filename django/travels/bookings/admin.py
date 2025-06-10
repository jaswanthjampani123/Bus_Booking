from django.contrib import admin
from .models import Bus, MockPayment, Seat, Booking

# Register your models here.

class BusAdmin(admin.ModelAdmin):
    list_display = ('bus_name', 'number', 'origin', 'destination')

class SeatAdmin(admin.ModelAdmin):
    list_display = ('seat_number', 'bus', 'is_booked')

class Bookingadmin(admin.ModelAdmin):
    list_display = ('user', 'bus', 'seat','booking_time')

class MockPaymentAdmin(admin.ModelAdmin):
    list_display = ('name_on_card', 'amount', 'status', 'created_at')

admin.site.register(Bus, BusAdmin)
admin.site.register(Seat, SeatAdmin)
admin.site.register(Booking, Bookingadmin)
admin.site.register(MockPayment, MockPaymentAdmin)