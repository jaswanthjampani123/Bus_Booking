import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

const UserBookings = ({ token, userId }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterType, setFilterType] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) return;

    fetch(`http://localhost:8000/api/user/${userId}/bookings/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch bookings');
        }
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setFilteredBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [token, userId]);

  useEffect(() => {
    let filtered = bookings;
    const today = new Date();

    if (filterType === 'today') {
      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.booking_time);
        return bookingDate.toDateString() === today.toDateString();
      });
    } else if (filterType === 'week') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.booking_time);
        return bookingDate >= startOfWeek && bookingDate <= endOfWeek;
      });
    } else if (filterType === 'month') {
      const month = today.getMonth();
      const year = today.getFullYear();

      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.booking_time);
        return bookingDate.getMonth() === month && bookingDate.getFullYear() === year;
      });
    } else if (filterType === 'custom' && startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = bookings.filter((booking) => {
        const bookingDate = new Date(booking.booking_time);
        return bookingDate >= start && bookingDate <= end;
      });
    }

    setFilteredBookings(filtered);
  }, [filterType, bookings, startDate, endDate]);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="mt-6 px-4">
      <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'today', 'week', 'month', 'custom'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`text-sm px-3 py-2 rounded ${
              filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {type === 'all' && 'All'}
            {type === 'today' && 'Today'}
            {type === 'week' && 'This Week'}
            {type === 'month' && 'This Month'}
            {type === 'custom' && 'Custom Range'}
          </button>
        ))}
      </div>

      {filterType === 'custom' && (
        <div className="flex items-center gap-4 mb-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            placeholderText="End Date"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                // Do NOT reset filterType here, keep 'custom'
              }}
              className="text-sm px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <p>No bookings found for the selected filter.</p>
      ) : (
        <ul className="space-y-4">
          {filteredBookings.map((booking) => (
            <li key={booking.id} className="border p-4 rounded shadow">
              <p>
                <strong>Bus:</strong>{' '}
                {booking.bus
                  ? `${booking.bus.bus_name} (${booking.bus.number})`
                  : 'N/A'}
              </p>
              <p><strong>Origin:</strong> {booking.origin || 'N/A'}</p>
              <p><strong>Destination:</strong> {booking.destination || 'N/A'}</p>
              <p><strong>Price:</strong> ₹{booking.price || 'N/A'}</p>
              <p><strong>Seat Number:</strong> {booking.seat?.seat_number || 'N/A'}</p>
              <p>
                <strong>Booked At:</strong>{' '}
                {new Date(booking.booking_time).toLocaleDateString('en-IN', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>

              <button
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate('/payment', { state: { booking } })}

              >
                Proceed to Payment
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserBookings;

