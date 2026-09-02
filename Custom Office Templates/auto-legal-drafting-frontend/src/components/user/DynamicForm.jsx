import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentDocument } from '../../store/slices/userSlice';
import { documentSchemas } from '../../utils/constants';
import ChatbotWidget from '../common/ChatbotWidget';
import toast from 'react-hot-toast';

function DynamicForm({ onFormSubmit, loading }) {
  const dispatch = useDispatch();
  const { documentType } = useSelector((state) => state.ui.filters);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);

  // Get schema for selected document type
  const schema = documentSchemas[documentType] || documentSchemas.default;

  useEffect(() => {
    // Initialize form data with empty values
    const initialData = {};
    schema.fields.forEach((field) => {
      initialData[field.name] = field.type === 'checkbox' ? false : '';
    });
    setFormData(initialData);
  }, [documentType]);

  const validateForm = () => {
    const newErrors = {};

    schema.fields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
      }

      // Email validation
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid email address';
        }
      }

      // Phone validation
      if (field.type === 'tel' && formData[field.name]) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Invalid phone number';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
    // Clear error for this field
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file size (max 20MB)
    const validFiles = files.filter((file) => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 20MB)`);
        return false;
      }
      return true;
    });

    setAttachments((prev) => [...prev, ...validFiles]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors above');
      return;
    }

    const documentData = {
      title: formData.title || `${documentType} - ${new Date().toLocaleDateString()}`,
      template_id: documentType,
      fields: formData,
      attachments: attachments.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
      created_at: new Date().toISOString(),
      status: 'draft',
    };

    dispatch(setCurrentDocument(documentData));
    onFormSubmit(documentData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Create {documentType}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Document Title
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder={`${documentType} - ${new Date().toLocaleDateString()}`}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        {/* Dynamic Fields from Schema */}
        {schema.fields.map((field) => (
          <div key={field.name}>
            {/* Text Input */}
            {(field.type === 'text' || field.type === 'email' || field.type === 'tel' || field.type === 'number') && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={field.type}
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors[field.name]
                    ? 'border-red-500'
                    : 'border-gray-300'
                    }`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </>
            )}

            {/* Textarea */}
            {field.type === 'textarea' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <textarea
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  rows="4"
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors[field.name]
                    ? 'border-red-500'
                    : 'border-gray-300'
                    }`}
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </>
            )}

            {/* Select */}
            {field.type === 'select' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                <select
                  value={formData[field.name] || ''}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.value)
                  }
                  disabled={loading}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-100 ${errors[field.name]
                    ? 'border-red-500'
                    : 'border-gray-300'
                    }`}
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </>
            )}

            {/* Checkbox */}
            {field.type === 'checkbox' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={field.name}
                  checked={formData[field.name] || false}
                  onChange={(e) =>
                    handleInputChange(field.name, e.target.checked)
                  }
                  disabled={loading}
                  className="rounded border-gray-300"
                />
                <label
                  htmlFor={field.name}
                  className="ml-2 text-sm text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
            )}
          </div>
        ))}

        {/* Attachments */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attachments (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
            <input
              type="file"
              id="attachments"
              multiple
              onChange={handleFileChange}
              disabled={loading}
              className="hidden"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="attachments"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-500">
                PDF, DOCX, JPG, PNG (Max 20MB each)
              </span>
            </label>
          </div>

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* Submit Button */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            {loading ? 'Generating Document...' : 'Generate Document with AI'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* AI Chatbot Widget */}
      <ChatbotWidget
        context="form"
        metadata={{
          templateId: documentType,
          currentField: Object.keys(formData).find(key => document.activeElement?.name === key)
        }}
      />
    </div>
  );
}

export default DynamicForm;
