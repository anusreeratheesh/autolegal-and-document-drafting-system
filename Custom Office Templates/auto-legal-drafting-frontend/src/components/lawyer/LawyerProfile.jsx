import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateLawyerProfile } from '../../store/slices/lawyerSlice';
import toast from 'react-hot-toast';

function LawyerProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { profile } = useSelector((state) => state.lawyer);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    bio: profile?.bio || 'Experienced lawyer with expertise in corporate law',
    phone: user?.phone || '',
    experienceYears: profile?.experienceYears || 10,
    specializations: profile?.specializations || ['Contract Law', 'Corporate Law'],
    certifications: profile?.certifications || ['Bar Council Admission', 'LLM'],
    availableHours: profile?.availableHours || 40,
    website: profile?.website || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSpecializationChange = (index, value) => {
    const updated = [...formData.specializations];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      specializations: updated,
    }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      dispatch(updateLawyerProfile(formData));
      setLoading(false);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <img
                src={user?.avatar || 'https://i.pravatar.cc/150?img=1'}
                alt={user?.name}
                className="w-24 h-24 rounded-lg border-4 border-blue-600"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
                <p className="text-gray-600 mt-1">Licensed Attorney at Law</p>
                <div className="flex items-center gap-2 mt-2 text-yellow-500">
                  {'⭐'.repeat(4)} <span className="text-gray-600">4.8/5 (142 reviews)</span>
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-6">
          {/* Bio */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Bio</h2>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-700">{formData.bio}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.phone}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.website || 'Not provided'}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Professional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.experienceYears}+ years</p>
                )}
              </div>

              {/* Available Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Hours / Week
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="availableHours"
                    value={formData.availableHours}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ) : (
                  <p className="text-gray-900">{formData.availableHours} hours/week</p>
                )}
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Specializations</h2>
            {isEditing ? (
              <div className="space-y-2">
                {formData.specializations.map((spec, i) => (
                  <input
                    key={i}
                    type="text"
                    value={spec}
                    onChange={(e) => handleSpecializationChange(i, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Certifications</h2>
            {isEditing ? (
              <div className="space-y-2">
                {formData.certifications.map((cert, i) => (
                  <input
                    key={i}
                    type="text"
                    value={cert}
                    onChange={(e) => {
                      const updated = [...formData.certifications];
                      updated[i] = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        certifications: updated,
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {formData.certifications.map((cert, i) => (
                  <li key={i} className="text-gray-900 flex items-center gap-2">
                    ✅ {cert}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { tier: 'Quick', price: 199, time: '6 hours' },
                { tier: 'Standard', price: 499, time: '24 hours' },
                { tier: 'Premium', price: 999, time: '1-2 hours' },
              ].map((option, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg text-center"
                >
                  <p className="font-bold text-gray-900">{option.tier}</p>
                  <p className="text-2xl font-bold text-blue-600 my-2">₹{option.price}</p>
                  <p className="text-sm text-gray-600">{option.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
              >
                {loading ? 'Saving...' : '✅ Save Changes'}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LawyerProfile;
