
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import status, generics
from rest_framework.views import APIView
from .serializers import MockPaymentSerializer, UserRegisterSerializer , BusSerializer, BookingSerializer
from rest_framework.response import Response
from .models import Bus, MockPayment, Seat, Booking

class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegisterSerializer(data= request.data)
        if serializer.is_valid():
            user = serializer.save()
            token , creeated = Token.objects.get_or_create(user=user)
            return Response({'token':token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username= username, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token':token.key,
                'user_id': user.id
            }, status=status.HTTP_200_OK
            )
        else:
            return Response({'error':'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class BusListCreateView(generics.ListCreateAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class BusDetailview(generics.RetrieveDestroyAPIView):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class BookingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seat_id = request.data.get('seat')
        try:
            seat = Seat.objects.get(id = seat_id)
            if seat.is_booked:
                return Response({'error': 'seat already booked'}, status=status.HTTP_400_BAD_REQUEST)
            
            seat.is_booked = True
            seat.save()
            
            bookings = Booking.objects.create(
                user = request.user,
                bus = seat.bus,
                seat = seat
            )
            serializer = BookingSerializer(bookings)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except seat.DoesNotExist:
            return Response({'error': 'Invalid Seat ID'}, status=status.HTTP_400_BAD_REQUEST)
        
class UserBookingView(APIView):
     permission_classes = [IsAuthenticated]

     def get(self, request, user_id):
         if request.user.id != user_id:
             return Response({'error':'unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
         
         bookings = Booking.objects.filter(user_id= user_id)
         serializer = BookingSerializer(bookings, many=True)
         return Response(serializer.data)



class MockPaymentView(APIView):
    def get(self, request):
        payments = MockPayment.objects.all().order_by('-created_at')
        serializer = MockPaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MockPaymentSerializer(data=request.data)
        if serializer.is_valid():
            booking = serializer.validated_data['booking']
            if MockPayment.objects.filter(booking=booking).exists():
                return Response(
                    {"error": "Payment already completed for this booking."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            expected_amount = booking.bus.price
            if serializer.validated_data['amount'] != expected_amount:
                return Response(
                    {"error": f"Amount must be ₹{expected_amount}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

