import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">Welcome to CryptoTraderPro</h1>
      <p className="text-xl mb-8">Your all-in-one platform for crypto trading and analysis.</p>
      <div>
        <Link to="/login" className="px-6 py-3 mx-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Login
        </Link>
        <Link to="/signup" className="px-6 py-3 mx-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700">
          Sign Up
        </Link>
      </div>
    </div>
  );
}