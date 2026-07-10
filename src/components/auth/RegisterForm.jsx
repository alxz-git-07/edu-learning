// src/components/auth/RegisterForm.jsx
import React, { useState } from 'react';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

function RegisterForm({ onSubmit, loading }) {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Form data state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',           // 'user' or 'instructor'
    bio: '',
    cookingLevel: 'beginner'
  });

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field-specific errors
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

  // ============================================
  // VALIDATION FUNCTIONS
  // ============================================

  // Validate individual fields
  function validateField(name, value) {
    let error = '';

    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Username is required';
        } else if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else if (value.length > 20) {
          error = 'Username must be less than 20 characters';
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          error = 'Username can only contain letters, numbers, and underscores';
        }
        break;

      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'fullName':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.length < 2) {
          error = 'Full name must be at least 2 characters';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;

      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;

      default:
        break;
    }

    return error;
  }

  // Validate all fields before submission
  function validateForm() {
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach(key => {
      // Skip confirmPassword and optional fields
      if (key === 'bio' || key === 'cookingLevel' || key === 'role') {
        return;
      }

      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    // Special validation for confirmPassword
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Handle input changes
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for password fields
    if (name === 'password' || name === 'confirmPassword') {
      const error = validateField(name, newValue);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  }

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Call parent's onSubmit function
    onSubmit(formData);
  }

  // ============================================
  // RENDER HELPERS
  // ============================================

  // Check if a field has an error
  function hasError(fieldName) {
    return !!errors[fieldName];
  }

  // Get error message for a field
  function getError(fieldName) {
    return errors[fieldName];
  }

  // ============================================
  // COMPONENT RENDER
  // ============================================

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      
      {/* ===== USERNAME FIELD ===== */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError('username') 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="chef_john"
            disabled={loading}
          />
          {hasError('username') && (
            <p className="mt-1 text-sm text-red-600">{getError('username')}</p>
          )}
        </div>
      </div>

      {/* ===== FULL NAME FIELD ===== */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full Name <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserCircleIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError('fullName') 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="John Doe"
            disabled={loading}
          />
          {hasError('fullName') && (
            <p className="mt-1 text-sm text-red-600">{getError('fullName')}</p>
          )}
        </div>
      </div>

      {/* ===== EMAIL FIELD ===== */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError('email') 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="you@example.com"
            disabled={loading}
          />
          {hasError('email') && (
            <p className="mt-1 text-sm text-red-600">{getError('email')}</p>
          )}
        </div>
      </div>

      {/* ===== PASSWORD FIELD ===== */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            className={`w-full px-4 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError('password') 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Password Requirements */}
        {formData.password && !hasError('password') && (
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500">Password must contain:</p>
            <ul className="text-xs space-y-0.5">
              <li className={`flex items-center space-x-1 ${
                formData.password.length >= 6 ? 'text-green-600' : 'text-gray-400'
              }`}>
                <span>{formData.password.length >= 6 ? '✅' : '⬜'}</span>
                <span>At least 6 characters</span>
              </li>
              <li className={`flex items-center space-x-1 ${
                /[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
              }`}>
                <span>{/[A-Z]/.test(formData.password) ? '✅' : '⬜'}</span>
                <span>One uppercase letter</span>
              </li>
              <li className={`flex items-center space-x-1 ${
                /[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
              }`}>
                <span>{/[a-z]/.test(formData.password) ? '✅' : '⬜'}</span>
                <span>One lowercase letter</span>
              </li>
              <li className={`flex items-center space-x-1 ${
                /\d/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
              }`}>
                <span>{/\d/.test(formData.password) ? '✅' : '⬜'}</span>
                <span>One number</span>
              </li>
            </ul>
          </div>
        )}
        
        {hasError('password') && (
          <p className="mt-1 text-sm text-red-600">{getError('password')}</p>
        )}
      </div>

      {/* ===== CONFIRM PASSWORD FIELD ===== */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LockClosedIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              hasError('confirmPassword') 
                ? 'border-red-300 focus:ring-red-500' 
                : 'border-gray-300'
            }`}
            placeholder="••••••••"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={loading}
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
        {hasError('confirmPassword') && (
          <p className="mt-1 text-sm text-red-600">{getError('confirmPassword')}</p>
        )}
        
        {/* Password Match Indicator */}
        {formData.confirmPassword && (
          <p className={`mt-1 text-xs ${
            formData.password === formData.confirmPassword 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {formData.password === formData.confirmPassword 
              ? '✅ Passwords match' 
              : '❌ Passwords do not match'}
          </p>
        )}
      </div>

      {/* ===== ROLE SELECTION ===== */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          I want to...
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="user">🎓 Learn as a Student</option>
          <option value="instructor">👨‍🏫 Teach as an Instructor</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          {formData.role === 'user' 
            ? 'Access courses, complete assignments, and track your progress' 
            : 'Create courses, manage students, and share your knowledge'}
        </p>
      </div>

      {/* ===== COOKING LEVEL ===== */}
      <div>
        <label htmlFor="cookingLevel" className="block text-sm font-medium text-gray-700">
          Cooking Level
        </label>
        <select
          id="cookingLevel"
          name="cookingLevel"
          value={formData.cookingLevel}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        >
          <option value="beginner">👶 Beginner - Just starting out</option>
          <option value="intermediate">👨‍🍳 Intermediate - Some experience</option>
          <option value="expert">👨‍🍳👨‍🍳 Expert - Advanced skills</option>
        </select>
      </div>

      {/* ===== BIO FIELD ===== */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
          Bio (Optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself, your interests, and why you're joining EduConnect..."
          disabled={loading}
          maxLength="500"
        />
        <div className="flex justify-between mt-1">
          <p className="text-xs text-gray-500">
            {formData.bio.length}/500 characters
          </p>
          {formData.bio.length > 450 && (
            <p className={`text-xs ${
              formData.bio.length >= 500 ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {formData.bio.length >= 500 ? '⚠️ Maximum reached' : '⚠️ Nearing limit'}
            </p>
          )}
        </div>
      </div>

      {/* ===== TERMS AND CONDITIONS ===== */}
      <div className="flex items-start space-x-2">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          disabled={loading}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-500">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-500">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* ===== SUBMIT BUTTON ===== */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        ) : (
          'Create Account'
        )}
      </button>
    </form>
  );
}

export default RegisterForm;
