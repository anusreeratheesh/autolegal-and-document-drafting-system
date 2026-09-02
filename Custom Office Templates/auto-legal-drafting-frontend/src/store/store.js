import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import lawyerReducer from './slices/lawyerSlice';
import adminReducer from './slices/adminSlice';
import notificationReducer from './slices/notificationSlice';
import uiReducer from './slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    lawyer: lawyerReducer,
    admin: adminReducer,
    notifications: notificationReducer,
    ui: uiReducer,
  },
});

export default store;
