import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { booking } = location.state || {};
  const [step, setStep] = useState('form'); 
  const [status, setStatus] = useState('');
  const [form, setForm] = useState({
    booking: booking?.id,
    amount: booking?.bus?.price || '',
    name_on_card: '',
    card_number: '',
    expiry_date: '',
    cvv: '',
  });


  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!booking) navigate('/');
  }, [booking, navigate]);

  const validate = () => {
    const errs = {};

    if (!form.name_on_card.trim()) errs.name_on_card = 'Name on card is required.';
    if (!form.card_number.trim()) {
      errs.card_number = 'Card number is required.';
    } else if (!/^\d{13,19}$/.test(form.card_number.replace(/\s+/g, ''))) {
      errs.card_number = 'Card number must be 13 to 19 digits.';
    }

    if (!form.expiry_date.trim()) {
      errs.expiry_date = 'Expiry date is required.';
    } else if (!/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(form.expiry_date)) {
      errs.expiry_date = 'Expiry date must be in MM/YY format.';
    }

    if (!form.cvv.trim()) {
      errs.cvv = 'CVV is required.';
    } else if (!/^\d{3,4}$/.test(form.cvv)) {
      errs.cvv = 'CVV must be 3 or 4 digits.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); 
  };

  const handleConfirm = async () => {
    if (!validate()) return;

    setStep('loading');
    try {
      const response = await fetch('http://localhost:8000/api/mock-payments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('amount');
      } else if (
        data.detail === 'Seat already booked.' ||
        (data.booking && data.booking[0]?.includes('already exists'))
      ) {
        navigate('/payment-error', {
          state: { reason: 'Payment for this seat already exists. Please choose another seat.' },
        });
      } else {
        setStatus('Payment failed: ' + JSON.stringify(data));
        setStep('form');
      }
    } catch (err) {
      setStatus('Payment failed: ' + err.message);
      setStep('form');
    }
  };

  const handleDone = () => {
    setStep('success');
    setTimeout(() => navigate('/'), 5000);
  };

  if (!booking) return null;

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-md p-6 rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      {step === 'form' && (
        <>
          <p className="mb-2">Bus: {booking.bus.bus_name}</p>
          <p className="mb-2">Seat: {booking.seat.seat_number}</p>
          <p className="mb-4 font-semibold">Amount: ₹{form.amount}</p>

          <input
            type="text"
            name="name_on_card"
            placeholder="Name on Card"
            value={form.name_on_card}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 ${errors.name_on_card ? 'border-red-500' : ''}`}
          />
          {errors.name_on_card && (
            <p className="text-red-500 text-sm mb-2">{errors.name_on_card}</p>
          )}

          <input
            type="text"
            name="card_number"
            placeholder="Card Number"
            value={form.card_number}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 ${errors.card_number ? 'border-red-500' : ''}`}
          />
          {errors.card_number && (
            <p className="text-red-500 text-sm mb-2">{errors.card_number}</p>
          )}

          <input
            type="text"
            name="expiry_date"
            placeholder="Expiry Date (MM/YY)"
            value={form.expiry_date}
            onChange={handleChange}
            className={`w-full border p-2 mb-1 ${errors.expiry_date ? 'border-red-500' : ''}`}
          />
          {errors.expiry_date && (
            <p className="text-red-500 text-sm mb-2">{errors.expiry_date}</p>
          )}

          <input
            type="text"
            name="cvv"
            placeholder="CVV"
            value={form.cvv}
            onChange={handleChange}
            className={`w-full border p-2 mb-4 ${errors.cvv ? 'border-red-500' : ''}`}
          />
          {errors.cvv && (
            <p className="text-red-500 text-sm mb-2">{errors.cvv}</p>
          )}

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleConfirm}
            disabled={step === 'loading'}
          >
            Pay Now
          </button>
          {status && <p className="text-red-500 mt-3">{status}</p>}
        </>
      )}

      {step === 'loading' && (
        <p className="text-gray-700 font-medium">Processing payment...</p>
      )}

      {step === 'amount' && (
        <>
          <p className="text-lg mb-4">Amount Paid: ₹{form.amount}</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleDone}
          >
            Done
          </button>
        </>
      )}

      {step === 'success' && (
        <p className="text-green-600 text-xl font-bold">
          Booking successful! Redirecting to home...
        </p>
      )}
    </div>
  );
};

export default PaymentPage;
