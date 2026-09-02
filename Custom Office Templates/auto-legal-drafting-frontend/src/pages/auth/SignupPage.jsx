import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../../components/auth/SignupForm';

function SignupPage() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse animation-delay-2000"></div>

      {/* Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-4xl shadow-2xl transform hover:scale-110 transition-transform">
              ⚖️
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AutoLegal
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-semibold mb-2">Professional Legal Document Platform</p>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Create, manage, and get expert reviews on legal documents with AI-powered precision</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <SignupForm />
          </div>

          {/* Right Column - Features */}
          <div className="lg:col-span-1">
            <div className="space-y-4 h-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why AutoLegal?</h3>
              
              <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform border border-white/40 hover:border-primary-300">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl group-hover:scale-125 transition-transform">
                      ⚡
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Quick & Easy Setup</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">Create your account in just 2 minutes with a simple verification process</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform border border-white/40 hover:border-primary-300">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl group-hover:scale-125 transition-transform">
                      🔐
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Bank-Level Security</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">End-to-end encryption and compliance with international security standards</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform border border-white/40 hover:border-primary-300">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl group-hover:scale-125 transition-transform">
                      📱
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Work Anywhere</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">Access your documents on desktop, tablet, or mobile device anytime</p>
                  </div>
                </div>
              </div>

              <div className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 transform border border-white/40 hover:border-primary-300">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-accent-100 text-2xl group-hover:scale-125 transition-transform">
                      ✓
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 mb-1 text-sm">Verified Community</h4>
                    <p className="text-gray-600 text-xs leading-relaxed">Connect with verified legal professionals and trusted users only</p>
                  </div>
                </div>
              </div>

              {/* Benefits Badge */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mt-6">
                <h4 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  Exclusive Perks
                </h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    30-day free trial
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    50% off lawyer reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                    Priority support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/40 shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Join Thousands of Legal Professionals</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            From individual users to law firms, AutoLegal is trusted for secure, efficient, and AI-powered legal document management.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">👥</span>
              <span className="font-semibold">50,000+ Active Users</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">⭐</span>
              <span className="font-semibold">4.9/5 Rating</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-gradient-to-b from-transparent via-gray-400 to-transparent"></div>
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-2xl">🏆</span>
              <span className="font-semibold">Industry Leading</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-12 text-sm text-gray-600">
          <p>By signing up, you agree to our <a href="#" className="font-semibold text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-primary-600 hover:underline">Privacy Policy</a></p>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
