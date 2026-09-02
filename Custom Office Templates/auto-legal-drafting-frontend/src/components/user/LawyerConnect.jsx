import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter, setLoading } from '../../store/slices/uiSlice';
import { lawyerAPI } from '../../utils/api';
import LawyerCard from './LawyerCard';

function LawyerConnect() {
  const dispatch = useDispatch();
  const { lawyerSpecialization, sortBy, searchQuery } = useSelector(
    (state) => state.ui.filters
  );
  const { lawyers: loadingState } = useSelector((state) => state.ui.loading);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoadingState] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Specializations list
  const specializations = [
    'All',
    'NDA',
    'Employment Law',
    'IP Law',
    'Real Estate',
    'Corporate Law',
    'Contract Law',
    'Intellectual Property',
  ];

  // Fetch lawyers from API
  const fetchLawyers = async () => {
    setLoadingState(true);
    try {
      const filters = {
        // Add timestamp to bypass cache
        _t: Date.now(),
        limit: 100  // Fetch all lawyers (instead of default 10)
      };
      if (lawyerSpecialization !== 'all') {
        filters.specialization = lawyerSpecialization;
      }

      const response = await lawyerAPI.getAllLawyers(filters);
      let lawyers = response.data.data || [];

      // Filter by search query
      if (searchQuery) {
        lawyers = lawyers.filter(
          (lawyer) =>
            lawyer.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Sort
      if (sortBy === 'rating') {
        lawyers = [...lawyers].sort((a, b) => b.rating - a.rating);
      }

      setFilteredLawyers(lawyers);
      setLastRefresh(Date.now()); // Update refresh time
      console.log(`✅ Loaded ${lawyers.length} lawyers at ${new Date().toLocaleTimeString()}`);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      setFilteredLawyers([]);
    } finally {
      setLoadingState(false);
    }
  };

  // Fetch on component mount and when filters change
  useEffect(() => {
    fetchLawyers();
  }, [lawyerSpecialization, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Expert Lawyers</h1>
          <p className="text-gray-600 mt-2">
            Connect with experienced legal professionals for document review
          </p>
        </div>

        {/* Filters & Refresh */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500">
                ✓ Updated {lastRefresh ? new Date(lastRefresh).toLocaleTimeString() : 'just now'}
              </span>
              <button
                onClick={fetchLawyers}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition font-medium text-sm flex items-center gap-2"
              >
                🔄 {loading ? 'Refreshing...' : 'Refresh Lawyers'}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Lawyers
              </label>
              <input
                type="text"
                placeholder="Name, expertise..."
                value={searchQuery}
                onChange={(e) =>
                  dispatch(setFilter({ key: 'searchQuery', value: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <select
                value={lawyerSpecialization}
                onChange={(e) =>
                  dispatch(setFilter({ key: 'lawyerSpecialization', value: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec.toLowerCase()}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  dispatch(setFilter({ key: 'sortBy', value: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>

            {/* Results Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results
              </label>
              <div className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-700">
                {filteredLawyers.length} found
              </div>
            </div>
          </div>
        </div>

        {/* Lawyers Grid */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-5xl mb-4">👨‍⚖️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No lawyers found</h3>
            <p className="text-gray-600">
              Try adjusting your filters or search query
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <LawyerCard key={lawyer._id} lawyer={lawyer} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LawyerConnect;
