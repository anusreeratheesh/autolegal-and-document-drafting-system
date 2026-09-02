import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'user', 'lawyer', 'admin'
  token: null, // SECURITY: Do NOT auto-restore from storage on init
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login Success
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      // Token storage is handled by LoginForm (sessionStorage only)
      sessionStorage.setItem('userRole', action.payload.user.role);
    },

    // Login Start
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Login Failure
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },

    // Signup Success
    signupSuccess: (state, action) => {
      state.user = action.payload.user;
      state.role = action.payload.user.role;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      state.loading = false;
      // Token stored in sessionStorage only
      sessionStorage.setItem('userRole', action.payload.user.role);
    },

    // Signup Start
    signupStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Signup Failure
    signupFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.token = null;
      state.error = null;
      // SECURITY: Completely clear all storage
      // Note: localStorage is no longer used, only sessionStorage
      localStorage.clear();
      sessionStorage.clear();
    },

    // Update User Profile
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    // SECURITY: Removed restoreAuth action
    // Auto-restoring auth from storage is a security risk
    // Users must explicitly login after logout or browser close
  },
});

export const {
  loginSuccess,
  loginStart,
  loginFailure,
  signupSuccess,
  signupStart,
  signupFailure,
  logout,
  updateUserProfile,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
