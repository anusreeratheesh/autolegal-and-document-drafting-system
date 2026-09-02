import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signupStart, signupSuccess, signupFailure } from '../../store/slices/authSlice';
import { authAPI } from '../../utils/api';
import { validateEmail, validatePassword } from '../../utils/validators';
import toast from 'react-hot-toast';

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // 'user' or 'lawyer'
    phone: '',
    licenseNumber: '',
    specialization: '',
    agreeTerms: false,
  });
  const [certificateFile, setCertificateFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [formStep, setFormStep] = useState(1); // For multi-step form

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    const pwd = formData.password;
    if (!pwd) return { level: 0, text: '', color: '' };
    
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (pwd.length >= 12) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*]/.test(pwd)) strength++;
    
    const levels = [
      { level: 0, text: '', color: 'bg-gray-300' },
      { level: 1, text: 'Weak', color: 'bg-red-500' },
      { level: 2, text: 'Fair', color: 'bg-orange-500' },
      { level: 3, text: 'Good', color: 'bg-yellow-500' },
      { level: 4, text: 'Strong', color: 'bg-blue-500' },
      { level: 5, text: 'Very Strong', color: 'bg-green-500' },
    ];
    return levels[strength] || levels[0];
  }, [formData.password]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, certificate: 'Only PDF, JPG, or PNG files are allowed' });
        setCertificateFile(null);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, certificate: 'File size must be under 5MB' });
        setCertificateFile(null);
        return;
      }
      setCertificateFile(file);
      setErrors({ ...errors, certificate: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    if (formData.role === 'lawyer') {
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
      if (!formData.specialization.trim()) newErrors.specialization = 'Please provide at least one specialization';
      if (!certificateFile) {
        newErrors.certificate = 'Bar Council Certificate is required for lawyer registration';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    setOtpSending(true);
    try {
      console.log('📧 Sending OTP for email:', formData.email);
      const response = await authAPI.sendOtp(formData.email);
      console.log('✅ OTP sent successfully:', response);
      toast.success('Verification code sent to your email!');
      setShowOtpScreen(true);
    } catch (error) {
      console.error('❌ OTP error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send OTP';
      toast.error(errorMessage);
    } finally {
      setOtpSending(false);
    }
  };

  const handleVerifyOtpAndSignup = async (e) => {
    if (e) e.preventDefault();
    if (!otp || otp.length < 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    dispatch(signupStart());

    try {
      let response;

      if (formData.role === 'lawyer') {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', formData.role);
        data.append('phone', formData.phone);
        data.append('licenseNumber', formData.licenseNumber);
        data.append('specialization', formData.specialization);
        data.append('otp', otp);
        if (certificateFile) {
            data.append('barCouncilCertificate', certificateFile);
        }
        response = await authAPI.signup(data);
      } else {
        response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          otp,
        });
      }

      const { token, refreshToken, user } = response.data;

      // Store tokens in sessionStorage only (cleared when browser closes)
      // NEVER store in localStorage for security
      sessionStorage.setItem('authToken', token);
      if (refreshToken) {
        sessionStorage.setItem('refreshToken', refreshToken);
      }

      dispatch(signupSuccess({ user, token }));

      toast.success('Account created successfully!');

      // Use a small delay to ensure Redux state is updated before navigation
      setTimeout(() => {
        navigate(`/${user.role}/dashboard`);
      }, 100);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
      dispatch(signupFailure(errorMessage));
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto fade-in">
      <div className="card-glass p-8 md:p-10 relative overflow-hidden backdrop-blur-xl bg-white/80">
        {/* Decorative Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent-400 via-primary-500 to-blue-500"></div>

        {/* Header with Logo Accent */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 text-white text-2xl mb-4 shadow-lg">
            ⚖️
          </div>
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 via-accent-600 to-blue-600 bg-clip-text text-transparent mb-3">Create Account</h2>
          <p className="text-gray-600 text-lg font-medium">Join thousands of legal professionals</p>
        </div>

        {!showOtpScreen ? (
          <>
            {/* Progress Indicator for Lawyer Registration */}
            {formData.role === 'lawyer' && (
              <div className="mb-8 flex items-center justify-between">
                <div className={`flex-1 h-1.5 rounded-full mr-3 transition-all ${formStep >= 1 ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gray-200'}`}></div>
                <div className={`flex-1 h-1.5 rounded-full mr-3 transition-all ${formStep >= 2 ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gray-200'}`}></div>
                <div className={`flex-1 h-1.5 rounded-full transition-all ${formStep >= 3 ? 'bg-gradient-to-r from-primary-500 to-accent-500' : 'bg-gray-200'}`}></div>
              </div>
            )}

            {/* Enhanced Role Selector */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white flex items-center justify-center text-xs font-bold">1</span>
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'user', label: 'Individual User', icon: '👤', desc: 'For personal legal needs' },
                  { value: 'lawyer', label: 'Legal Professional', icon: '⚖️', desc: 'For licensed lawyers' }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, role: r.value });
                      setFormStep(1);
                    }}
                    className={`p-4 rounded-2xl font-semibold transition-all duration-300 flex flex-col items-center justify-center gap-2 border-2 transform hover:scale-105 group ${
                      formData.role === r.value
                        ? 'bg-gradient-to-br from-primary-50 to-accent-50 border-primary-600 text-primary-900 shadow-lg shadow-primary-500/20'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300'
                    }`}
                  >
                    <span className={`text-3xl transition-transform group-hover:scale-125 ${formData.role === r.value ? 'scale-125' : ''}`}>{r.icon}</span>
                    <span className="text-sm font-bold">{r.label}</span>
                    <span className="text-xs text-gray-600 font-normal">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendOtp} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">👤</span>
                  Full Name
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  />
                  {formData.name && !errors.name && (
                    <span className="absolute right-4 top-3.5 text-green-500 text-lg">✓</span>
                  )}
                </div>
                {errors.name && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">📧</span>
                  Email Address
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  />
                  {formData.email && !errors.email && (
                    <span className="absolute right-4 top-3.5 text-green-500 text-lg">✓</span>
                  )}
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.email}</p>}
              </div>

              {/* Password Field with Strength Indicator */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🔐</span>
                    Password
                    <span className="text-red-600">*</span>
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                      errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-3.5 text-gray-600 hover:text-primary-600 font-medium text-sm transition-colors"
                  >
                    {showPassword ? '👁️' : '🔒'}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={`flex-1 h-1.5 rounded-full transition-all ${
                            i <= passwordStrength.level ? passwordStrength.color : 'bg-gray-200'
                          }`}
                        ></div>
                      ))}
                    </div>
                    <p className={`text-xs font-semibold ${
                      passwordStrength.level >= 4 ? 'text-green-600' : passwordStrength.level >= 3 ? 'text-blue-600' : passwordStrength.level >= 2 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      Password Strength: {passwordStrength.text}
                    </p>
                  </div>
                )}
                {errors.password && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.password}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  Confirm Password
                  <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                    }`}
                    disabled={loading}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && !errors.confirmPassword && (
                    <span className="absolute right-4 top-3.5 text-green-500 text-lg">✓</span>
                  )}
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.confirmPassword}</p>}
              </div>

              {/* Lawyer-Specific Fields */}
              {formData.role === 'lawyer' && (
                <div className="mt-8 pt-8 border-t-2 border-gradient space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Professional Information</h3>
                  </div>
                  
                  {/* Phone */}
                  <div className="group">
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">📱</span>
                      Phone Number
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                        errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      disabled={loading}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.phone}</p>}
                  </div>

                  {/* License Number */}
                  <div className="group">
                    <label htmlFor="licenseNumber" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">🎖️</span>
                      License Number / Bar Registration
                      <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="e.g. BC/2021/12345"
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                        errors.licenseNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      disabled={loading}
                    />
                    {errors.licenseNumber && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.licenseNumber}</p>}
                  </div>

                  {/* Specialization */}
                  <div className="group">
                    <label htmlFor="specialization" className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-lg">📚</span>
                        Specialization(s)
                        <span className="text-red-600">*</span>
                      </span>
                      <span className="text-xs text-gray-500 font-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="e.g. Corporate Law, IP Law, Contract Law"
                      className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:bg-white text-gray-900 placeholder-gray-400 group-hover:bg-white ${
                        errors.specialization ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'
                      }`}
                      disabled={loading}
                    />
                    {errors.specialization && <p className="text-red-500 text-sm mt-2 font-semibold flex items-center gap-1">⚠️ {errors.specialization}</p>}
                  </div>
                </div>
              )}

              {/* Certificate Upload Section - Lawyer Only */}
              {formData.role === 'lawyer' && (
                <div className="mt-8 pt-8 border-t-2 border-gradient">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 text-white flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Document Verification</h3>
                  </div>
                  
                  <label htmlFor="barCouncilCertificate" className="block text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    Bar Council Certificate
                    <span className="text-red-600">*</span>
                  </label>
                  
                  <div className={`w-full px-6 py-8 bg-gray-50 border-2 border-dashed rounded-2xl transition-all hover:bg-white cursor-pointer hover:border-primary-400 ${
                    errors.certificate ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    <label htmlFor="barCouncilCertificate" className="flex flex-col items-center cursor-pointer">
                      {certificateFile ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-2xl mb-3">
                            ✓
                          </div>
                          <p className="text-sm font-bold text-green-700 text-center truncate max-w-xs">{certificateFile.name}</p>
                          <p className="text-xs text-gray-500 mt-2">Click to change</p>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-2xl mb-3">
                            📁
                          </div>
                          <p className="text-sm font-semibold text-gray-700 text-center">Upload Bar Council Certificate</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG • Max 5MB</p>
                        </>
                      )}
                    </label>
                    <input
                      type="file"
                      id="barCouncilCertificate"
                      name="barCouncilCertificate"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading}
                    />
                  </div>
                  {errors.certificate && <p className="text-red-500 text-sm mt-3 font-semibold flex items-center gap-1">⚠️ {errors.certificate}</p>}
                  <p className="text-xs text-blue-600 mt-3 font-medium bg-blue-50 p-3 rounded-lg">ℹ️ Please upload a verified copy of your Bar Council ID, Registration Certificate, or License.</p>
                </div>
              )}

              {/* Terms & Conditions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <label className="flex items-start cursor-pointer group gap-3">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-1 rounded-lg border-2 border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer transition-all"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    I agree to the{' '}
                    <button type="button" className="font-bold text-primary-600 hover:text-primary-700 underline hover:no-underline transition-all">
                      Terms & Conditions
                    </button>
                    {' '} and {' '}
                    <button type="button" className="font-bold text-primary-600 hover:text-primary-700 underline hover:no-underline transition-all">
                      Privacy Policy
                    </button>
                  </span>
                </label>
                {errors.agreeTerms && <p className="text-red-500 text-sm mt-3 font-semibold flex items-center gap-1">⚠️ {errors.agreeTerms}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={otpSending}
                className="w-full mt-8 btn-modern bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed active:translate-y-0"
              >
                {otpSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending Verification Code...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓ Create Account</span>
                  </span>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-8 text-center animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 text-4xl">
              📧
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h3>
              <p className="text-gray-600 text-lg">We've sent a 6-digit verification code to:</p>
              <p className="text-primary-600 font-bold text-lg mt-2 break-all">{formData.email}</p>
            </div>

            {/* OTP Input */}
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 p-6 rounded-2xl border-2 border-primary-200">
              <label className="block text-sm font-bold text-gray-800 mb-4">Enter Verification Code</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.5em] text-4xl font-bold px-4 py-6 bg-white border-2 border-primary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all hover:border-primary-400 placeholder-gray-300"
                placeholder="000000"
                disabled={loading}
                autoFocus
              />
              <p className="text-sm text-gray-600 mt-3">6-digit code</p>
            </div>

            {/* Verify Button */}
            <button
              type="button"
              onClick={handleVerifyOtpAndSignup}
              disabled={loading || otp.length < 6}
              className="w-full btn-modern bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 transition-all transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed active:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying...</span>
                </span>
              ) : 'Verify & Create Account'}
            </button>

            {/* Additional Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <div className="flex justify-center items-center gap-2 text-sm">
                <button 
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  disabled={loading}
                  className="font-bold text-primary-600 hover:text-primary-700 transition-colors hover:underline"
                >
                  Change Email
                </button>
                <span className="text-gray-300">•</span>
                <button 
                  type="button"
                  onClick={handleSendOtp}
                  disabled={otpSending || loading}
                  className="font-bold text-gray-600 hover:text-primary-600 transition-colors hover:underline"
                >
                  {otpSending ? 'Resending...' : 'Resend Code'}
                </button>
              </div>
              <p className="text-xs text-gray-500">Didn't receive the code? Check your spam folder or try resending.</p>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          <span className="text-gray-500 text-sm font-semibold">Already a member?</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-700 font-medium">
          <a href="/login" className="inline-flex items-center gap-2 font-bold text-primary-600 hover:text-primary-700 transition-colors group">
            <span>Sign In Here</span>
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </p>
      </div>
    </div>
  );
}

export default SignupForm;
