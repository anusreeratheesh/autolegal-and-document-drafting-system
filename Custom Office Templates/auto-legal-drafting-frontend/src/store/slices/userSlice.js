import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
  currentDocument: null,
  documentVersions: [],
  reviewRequests: [],
  reviewFeedback: null,
  profile: null,
  stats: {
    totalDocuments: 0,
    reviewedByLawyers: 0,
    pendingReviews: 0,
  },
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Set User Documents
    setDocuments: (state, action) => {
      state.documents = action.payload;
      state.stats.totalDocuments = action.payload.length;
    },

    // Add New Document
    addDocument: (state, action) => {
      state.documents.unshift(action.payload);
      state.stats.totalDocuments += 1;
    },

    // Update Document
    updateDocument: (state, action) => {
      const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
    },

    // Delete Document
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter((doc) => doc._id !== action.payload);
      state.stats.totalDocuments -= 1;
    },

    // Set Current Document
    setCurrentDocument: (state, action) => {
      state.currentDocument = action.payload;
    },

    // Set Document Versions
    setDocumentVersions: (state, action) => {
      state.documentVersions = action.payload;
    },

    // Add Document Version
    addDocumentVersion: (state, action) => {
      state.documentVersions.push(action.payload);
    },

    // Set Review Requests
    setReviewRequests: (state, action) => {
      state.reviewRequests = action.payload;
      const pending = action.payload.filter((req) => req.status === 'pending').length;
      state.stats.pendingReviews = pending;
    },

    // Add Review Request
    addReviewRequest: (state, action) => {
      state.reviewRequests.unshift(action.payload);
      if (action.payload.status === 'pending') {
        state.stats.pendingReviews += 1;
      }
    },

    // Update Review Request Status
    updateReviewRequestStatus: (state, action) => {
      const { requestId, status } = action.payload;
      const request = state.reviewRequests.find((req) => req._id === requestId);
      if (request) {
        if (request.status === 'pending') {
          state.stats.pendingReviews -= 1;
        }
        request.status = status;
        if (status !== 'pending') {
          state.stats.reviewedByLawyers += 1;
        }
      }
    },

    // Set Review Feedback
    setReviewFeedback: (state, action) => {
      state.reviewFeedback = action.payload;
    },

    // Set User Profile
    setUserProfile: (state, action) => {
      state.profile = action.payload;
    },

    // Update User Profile
    updateUserProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
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

    // Reset User State
    resetUserState: (state) => {
      return initialState;
    },
  },
});

export const {
  setDocuments,
  addDocument,
  updateDocument,
  deleteDocument,
  setCurrentDocument,
  setDocumentVersions,
  addDocumentVersion,
  setReviewRequests,
  addReviewRequest,
  updateReviewRequestStatus,
  setReviewFeedback,
  setUserProfile,
  updateUserProfile,
  setLoading,
  setError,
  clearError,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
