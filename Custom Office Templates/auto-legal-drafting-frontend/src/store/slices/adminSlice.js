import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalUsers: 0,
    totalLawyers: 0,
    documentsDraftedToday: 0,
    documentsDraftedThisWeek: 0,
    documentsDraftedThisMonth: 0,
    pendingVerifications: 0,
    pendingDisputes: 0,
    flaggedReviews: 0,
    platformRevenue: 0,
    commissionEarned: 0,
    pendingPayouts: 0,
    newSignupsToday: 0,
  },
  pendingLawyers: [],
  rejectedLawyers: [],
  verifiedLawyers: [],
  allUsers: [],
  disputes: [],
  flaggedReviews: [],
  financialData: {
    totalRevenue: 0,
    commission: 0,
    payouts: [],
    invoices: [],
  },
  templates: [],
  settings: {
    pricing: {
      quick: 199,
      standard: 499,
      premium: 999,
    },
    commission: 20,
    slaTimings: {
      quick: 360,
      standard: 1440,
      premium: 120,
    },
    platformFeatures: [],
  },
  auditLogs: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Set Stats
    setStats: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
    },

    // Set Pending Lawyers
    setPendingLawyers: (state, action) => {
      state.pendingLawyers = action.payload;
      state.stats.pendingVerifications = action.payload.length;
    },

    // Approve Lawyer
    approveLawyer: (state, action) => {
      const lawyer = state.pendingLawyers.find((l) => l._id === action.payload);
      if (lawyer) {
        state.pendingLawyers = state.pendingLawyers.filter((l) => l._id !== action.payload);
        state.verifiedLawyers.unshift(lawyer);
        state.stats.pendingVerifications -= 1;
        state.stats.totalLawyers += 1;
      }
    },

    // Reject Lawyer
    rejectLawyer: (state, action) => {
      const lawyer = state.pendingLawyers.find((l) => l._id === action.payload);
      if (lawyer) {
        state.pendingLawyers = state.pendingLawyers.filter((l) => l._id !== action.payload);
        state.rejectedLawyers.push(lawyer);
        state.stats.pendingVerifications -= 1;
      }
    },

    // Set All Users
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },

    // Ban User
    banUser: (state, action) => {
      const user = state.allUsers.find((u) => u._id === action.payload);
      if (user) {
        user.isBanned = true;
      }
    },

    // Unban User
    unbanUser: (state, action) => {
      const user = state.allUsers.find((u) => u._id === action.payload);
      if (user) {
        user.isBanned = false;
      }
    },

    // Set Disputes
    setDisputes: (state, action) => {
      state.disputes = action.payload;
      const pending = action.payload.filter((d) => d.status === 'pending').length;
      state.stats.pendingDisputes = pending;
    },

    // Resolve Dispute
    resolveDispute: (state, action) => {
      const { disputeId, resolution } = action.payload;
      const dispute = state.disputes.find((d) => d._id === disputeId);
      if (dispute) {
        dispute.status = resolution.status;
        dispute.resolution = resolution;
      }
    },

    // Set Flagged Reviews
    setFlaggedReviews: (state, action) => {
      state.flaggedReviews = action.payload;
      state.stats.flaggedReviews = action.payload.length;
    },

    // Approve Review
    approveReview: (state, action) => {
      const review = state.flaggedReviews.find((r) => r._id === action.payload);
      if (review) {
        review.status = 'approved';
        state.flaggedReviews = state.flaggedReviews.filter((r) => r._id !== action.payload);
        state.stats.flaggedReviews -= 1;
      }
    },

    // Reject Review
    rejectReview: (state, action) => {
      const review = state.flaggedReviews.find((r) => r._id === action.payload);
      if (review) {
        review.status = 'rejected';
        state.flaggedReviews = state.flaggedReviews.filter((r) => r._id !== action.payload);
        state.stats.flaggedReviews -= 1;
      }
    },

    // Set Financial Data
    setFinancialData: (state, action) => {
      state.financialData = { ...state.financialData, ...action.payload };
    },

    // Set Templates
    setTemplates: (state, action) => {
      state.templates = action.payload;
    },

    // Update Template
    updateTemplate: (state, action) => {
      const index = state.templates.findIndex((t) => t._id === action.payload._id);
      if (index !== -1) {
        state.templates[index] = action.payload;
      }
    },

    // Set Settings
    setSettings: (state, action) => {
      state.settings = { ...state.settings, ...action.payload };
    },

    // Update Pricing
    updatePricing: (state, action) => {
      state.settings.pricing = { ...state.settings.pricing, ...action.payload };
    },

    // Update Commission
    updateCommission: (state, action) => {
      state.settings.commission = action.payload;
    },

    // Set Audit Logs
    setAuditLogs: (state, action) => {
      state.auditLogs = action.payload;
    },

    // Add Audit Log
    addAuditLog: (state, action) => {
      state.auditLogs.unshift(action.payload);
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

    // Reset Admin State
    resetAdminState: (state) => {
      return initialState;
    },
  },
});

export const {
  setStats,
  setPendingLawyers,
  approveLawyer,
  rejectLawyer,
  setAllUsers,
  banUser,
  unbanUser,
  setDisputes,
  resolveDispute,
  setFlaggedReviews,
  approveReview,
  rejectReview,
  setFinancialData,
  setTemplates,
  updateTemplate,
  setSettings,
  updatePricing,
  updateCommission,
  setAuditLogs,
  addAuditLog,
  setLoading,
  setError,
  clearError,
  resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
