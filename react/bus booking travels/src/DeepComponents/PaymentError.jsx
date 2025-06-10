import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentError = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-red-100 border border-red-400 text-red-700 rounded text-center">
      <h2 className="text-2xl font-bold mb-4">Payment Failed</h2>
      <p className="mb-4">{state?.reason || 'An error occurred during payment.'}</p>
      <button
        onClick={() => navigate('/')}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default PaymentError;
