import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function NotFoundPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Path Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-md mx-auto">
          <p className="text-sm text-gray-600 mb-2">Requested path:</p>
          <p className="text-xs bg-gray-100 p-2 rounded font-mono text-gray-900 break-all">
            {location.pathname}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
          >
            Go Back
          </button>

          <button
            onClick={() =>
              isAuthenticated
                ? navigate(`/${role}/dashboard`)
                : navigate('/')
            }
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go Home'}
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl">
          <a
            href="/"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🏠</div>
            <h3 className="font-semibold text-gray-900 mb-1">Home</h3>
            <p className="text-sm text-gray-600">Return to homepage</p>
          </a>

          <a
            href="mailto:support@autolegal.com"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📧</div>
            <h3 className="font-semibold text-gray-900 mb-1">Contact Support</h3>
            <p className="text-sm text-gray-600">Get help from our team</p>
          </a>

          <a
            href="/login"
            className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🔐</div>
            <h3 className="font-semibold text-gray-900 mb-1">Login</h3>
            <p className="text-sm text-gray-600">Sign in to your account</p>
          </a>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
