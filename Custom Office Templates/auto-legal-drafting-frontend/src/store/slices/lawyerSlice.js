import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reviewAPI } from '../../utils/api';

// Async Thunks
export const acceptReviewRequest = createAsyncThunk(
  'lawyer/acceptReviewRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.acceptReview(requestId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept review');
    }
  }
);

export const rejectReviewRequest = createAsyncThunk(
  'lawyer/rejectReviewRequest',
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      await reviewAPI.rejectReview(requestId, reason);
      return requestId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject review');
    }
  }
);

const initialState = {
  profile: null,
  reviewRequests: [],
  inProgressReviews: [],
  completedReviews: [],
  earnings: {
    totalEarnings: 0,
    pendingPayout: 0,
    thisMonth: 0,
    weeklyBreakdown: [],
  },
  ratings: {
    averageRating: 0,
    totalReviews: 0,
    recentReviews: [],
  },
  availability: {
    isOnline: false,
    isBusy: false,
    workingHours: {
      start: '09:00',
      end: '18:00',
    },
    maxReviewsPerDay: 5,
  },
  stats: {
    totalReviewsCompleted: 0,
    acceptanceRate: 0,
    averageResponseTime: '4h',
    disputeRate: 0,
  },
  loading: false,
  error: null,
};

const lawyerSlice = createSlice({
  name: 'lawyer',
  initialState,
  reducers: {
    // Set Lawyer Profile
    setLawyerProfile: (state, action) => {
      state.profile = action.payload;
    },

    // Update Lawyer Profile
    updateLawyerProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },

    // Set Review Requests
    setReviewRequests: (state, action) => {
      state.reviewRequests = action.payload;
    },

    // Move to Completed
    completeReview: (state, action) => {
      const review = state.inProgressReviews.find((req) => req._id === action.payload);
      if (review) {
        state.inProgressReviews = state.inProgressReviews.filter((req) => req._id !== action.payload);
        state.completedReviews.unshift(review);
        state.stats.totalReviewsCompleted += 1;
      }
    },

    // Set In-Progress Reviews
    setInProgressReviews: (state, action) => {
      state.inProgressReviews = action.payload;
    },


    // Set Completed Reviews
    setCompletedReviews: (state, action) => {
      state.completedReviews = action.payload;
      state.stats.totalReviewsCompleted = action.payload.length;
    },

    // Update Earnings
    updateEarnings: (state, action) => {
      state.earnings = { ...state.earnings, ...action.payload };
    },

    // Add Earning
    addEarning: (state, action) => {
      state.earnings.totalEarnings += action.payload;
      state.earnings.pendingPayout += action.payload;
      state.earnings.thisMonth += action.payload;
    },

    // Set Ratings
    setRatings: (state, action) => {
      state.ratings = action.payload;
    },

    // Add Rating
    addRating: (state, action) => {
      state.ratings.recentReviews.unshift(action.payload);
      state.ratings.totalReviews += 1;
      // Recalculate average
      const sum = state.ratings.recentReviews.reduce((acc, review) => acc + review.stars, 0);
      state.ratings.averageRating = (sum / state.ratings.totalReviews).toFixed(1);
    },

    // Set Availability
    setAvailability: (state, action) => {
      state.availability = { ...state.availability, ...action.payload };
    },

    // Toggle Online Status
    toggleOnlineStatus: (state) => {
      state.availability.isOnline = !state.availability.isOnline;
    },

    // Toggle Busy Status
    toggleBusyStatus: (state) => {
      state.availability.isBusy = !state.availability.isBusy;
    },

    // Set Working Hours
    setWorkingHours: (state, action) => {
      state.availability.workingHours = action.payload;
    },

    // Set Stats
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    // Set Loading
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set Error
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Clear Error
    clearError: (state) => {
      state.error = null;
    },

    // Reset Lawyer State
    resetLawyerState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Accept Review
      .addCase(acceptReviewRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptReviewRequest.fulfilled, (state, action) => {
        state.loading = false;
        const review = action.payload;
        state.reviewRequests = state.reviewRequests.filter((req) => req._id !== review._id);
        state.inProgressReviews.push(review);
      })
      .addCase(acceptReviewRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reject Review
      .addCase(rejectReviewRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(rejectReviewRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewRequests = state.reviewRequests.filter((req) => req._id !== action.payload);
      })
      .addCase(rejectReviewRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setLawyerProfile,
  updateLawyerProfile,
  setReviewRequests,
  completeReview,
  setInProgressReviews,
  setCompletedReviews,
  updateEarnings,
  addEarning,
  setRatings,
  addRating,
  setAvailability,
  toggleOnlineStatus,
  toggleBusyStatus,
  setWorkingHours,
  setStats,
  setLoading,
  setError,
  clearError,
  resetLawyerState,
} = lawyerSlice.actions;

export default lawyerSlice.reducer;

