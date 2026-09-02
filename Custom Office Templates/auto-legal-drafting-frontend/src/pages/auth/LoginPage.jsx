import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

function LoginPage() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${role}/dashboard`);
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100"></div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #8b5cf6 1px, transparent 1px), linear-gradient(to bottom, #8b5cf6 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-6000"></div>

      {/* Content */}
      <div className="relative z-10 w-full animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            {/* Animated Logo */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                ⚖️
              </div>
            </div>
            <div>
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AutoLegal
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full mt-2"></div>
            </div>
          </div>
          <p className="text-2xl text-gray-800 font-bold mb-2">
            Intelligent Legal Document Automation
          </p>
          <p className="text-base text-gray-600 flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Powered by AI
            </span>
            <span className="text-gray-400">•</span>
            <span>Verified by Experts</span>
          </p>
        </div>

        {/* Login Form */}
        <div className="animate-fade-in-up delay-200">
          <LoginForm />
        </div>

        {/* Feature Cards */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group card-glass hover-lift animate-fade-in-up delay-300 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="text-center relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">⚡</div>
                <h3 className="font-bold text-gray-900 mb-3 text-xl">Fast & Secure</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Enterprise-grade security with instant document generation
                </p>
              </div>
            </div>

            <div className="group card-glass hover-lift animate-fade-in-up delay-500 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="text-center relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">🤖</div>
                <h3 className="font-bold text-gray-900 mb-3 text-xl">AI Powered</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Intelligent suggestions powered by advanced AI models
                </p>
              </div>
            </div>

            <div className="group card-glass hover-lift animate-fade-in-up delay-700 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="text-center relative z-10">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">👨‍⚖️</div>
                <h3 className="font-bold text-gray-900 mb-3 text-xl">Expert Review</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Connect with experienced lawyers for professional guidance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 max-w-4xl mx-auto animate-fade-in-up delay-900">
          <div className="card-glass p-8">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">1000+</div>
                <div className="text-sm text-gray-600">Documents Generated</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-sm text-gray-600">Happy Clients</div>
              </div>
              <div>
                <div className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">50+</div>
                <div className="text-sm text-gray-600">Expert Lawyers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center animate-fade-in-up delay-1000">
          <div className="card-glass max-w-3xl mx-auto p-8">
            <p className="text-gray-700 mb-6 font-semibold text-lg">
              Choose your role to get started
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all transform hover:scale-105 cursor-pointer border-2 border-blue-200 hover:border-blue-400">
                <div className="text-4xl mb-3">👤</div>
                <div className="font-bold text-blue-700 mb-2 text-lg">User</div>
                <div className="text-gray-600 text-sm">Create and manage legal documents</div>
              </div>
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all transform hover:scale-105 cursor-pointer border-2 border-purple-200 hover:border-purple-400">
                <div className="text-4xl mb-3">⚖️</div>
                <div className="font-bold text-purple-700 mb-2 text-lg">Lawyer</div>
                <div className="text-gray-600 text-sm">Review and approve documents</div>
              </div>
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-pink-100 hover:from-pink-100 hover:to-pink-200 transition-all transform hover:scale-105 cursor-pointer border-2 border-pink-200 hover:border-pink-400">
                <div className="text-4xl mb-3">🛡️</div>
                <div className="font-bold text-pink-700 mb-2 text-lg">Admin</div>
                <div className="text-gray-600 text-sm">Manage users and system</div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2024 AutoLegal. All rights reserved. | Built with ❤️ for legal professionals
        </div>
      </div>

      {/* Enhanced Animations */}
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
          animation-fill-mode: both;
        }
        .delay-300 {
          animation-delay: 0.3s;
          animation-fill-mode: both;
        }
        .delay-500 {
          animation-delay: 0.5s;
          animation-fill-mode: both;
        }
        .delay-700 {
          animation-delay: 0.7s;
          animation-fill-mode: both;
        }
        .delay-900 {
          animation-delay: 0.9s;
          animation-fill-mode: both;
        }
        .delay-1000 {
          animation-delay: 1s;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}

export default LoginPage;
