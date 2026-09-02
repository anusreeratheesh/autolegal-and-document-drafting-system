import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  modals: {
    loginModal: false,
    createDocumentModal: false,
    lawyerProfileModal: false,
    reviewFeedbackModal: false,
    disputeResolutionModal: false,
    settingsModal: false,
  },
  filters: {
    documentType: 'all',
    reviewStatus: 'all',
    lawyerSpecialization: 'all',
    sortBy: 'recent',
    searchQuery: '',
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
  loading: {
    documents: false,
    lawyers: false,
    reviews: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    // Open Modal
    openModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = true;
      }
    },

    // Close Modal
    closeModal: (state, action) => {
      if (state.modals.hasOwnProperty(action.payload)) {
        state.modals[action.payload] = false;
      }
    },

    // Set Filter
    setFilter: (state, action) => {
      const { key, value } = action.payload;
      if (state.filters.hasOwnProperty(key)) {
        state.filters[key] = value;
        state.pagination.currentPage = 1; // Reset to first page on filter change
      }
    },

    // Clear Filters
    clearFilters: (state) => {
      state.filters = {
        documentType: 'all',
        reviewStatus: 'all',
        lawyerSpecialization: 'all',
        sortBy: 'recent',
        searchQuery: '',
      };
      state.pagination.currentPage = 1;
    },

    // Set Pagination
    setPagination: (state, action) => {
      const { currentPage, itemsPerPage, totalItems } = action.payload;
      if (currentPage) state.pagination.currentPage = currentPage;
      if (itemsPerPage) state.pagination.itemsPerPage = itemsPerPage;
      if (totalItems !== undefined) state.pagination.totalItems = totalItems;
    },

    // Go to Previous Page
    previousPage: (state) => {
      if (state.pagination.currentPage > 1) {
        state.pagination.currentPage -= 1;
      }
    },

    // Go to Next Page
    nextPage: (state) => {
      const totalPages = Math.ceil(
        state.pagination.totalItems / state.pagination.itemsPerPage
      );
      if (state.pagination.currentPage < totalPages) {
        state.pagination.currentPage += 1;
      }
    },

    // Set Loading
    setLoading: (state, action) => {
      const { key, value } = action.payload;
      if (state.loading.hasOwnProperty(key)) {
        state.loading[key] = value;
      }
    },

    // Reset UI
    resetUI: (state) => {
      return initialState;
    },
  },
});

export const {
  toggleSidebar,
  openModal,
  closeModal,
  setFilter,
  clearFilters,
  setPagination,
  previousPage,
  nextPage,
  setLoading,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
