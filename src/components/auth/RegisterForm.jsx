import { useState } from 'react';

function RegisterForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',
    bio: '',
    cookingLevel: 'beginner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });

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

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (key === 'bio' || key === 'cookingLevel' || key === 'role') {
        return;
      }

      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (name === 'password' || name === 'confirmPassword') {
      const error = validateField(name, newValue);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  }

  function hasError(fieldName) {
    return !!errors[fieldName];
  }

  function getError(fieldName) {
    return errors[fieldName];
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1 block text-sm font-medium text-gray-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="off"
          data-lpignore="true"
          className={`w-full rounded-lg border px-4 py-2 ${hasError('username') ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="Chef John"
          disabled={loading}
        />
        {hasError('username') && <p className="mt-1 text-sm text-red-600">{getError('username')}</p>}
      </div>

      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          autoComplete="off"
          data-lpignore="true"
          className={`w-full rounded-lg border px-4 py-2 ${hasError('fullName') ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="John Kamau"
          disabled={loading}
        />
        {hasError('fullName') && <p className="mt-1 text-sm text-red-600">{getError('fullName')}</p>}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="off"
          data-lpignore="true"
          className={`w-full rounded-lg border px-4 py-2 ${hasError('email') ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="me@example.com"
          disabled={loading}
        />
        {hasError('email') && <p className="mt-1 text-sm text-red-600">{getError('email')}</p>}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          data-lpignore="true"
          className={`w-full rounded-lg border px-4 py-2 ${hasError('password') ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="••••••••"
          disabled={loading}
        />
        <button type="button" onClick={() => setShowPassword((value) => !value)} className="mt-2 text-sm text-blue-600">
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {hasError('password') && <p className="mt-1 text-sm text-red-600">{getError('password')}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
          data-lpignore="true"
          className={`w-full rounded-lg border px-4 py-2 ${hasError('confirmPassword') ? 'border-red-300' : 'border-gray-300'}`}
          placeholder="••••••••"
          disabled={loading}
        />
        <button type="button" onClick={() => setShowConfirmPassword((value) => !value)} className="mt-2 text-sm text-blue-600">
          {showConfirmPassword ? 'Hide' : 'Show'}
        </button>
        {hasError('confirmPassword') && <p className="mt-1 text-sm text-red-600">{getError('confirmPassword')}</p>}
      </div>

      <div>
        <label htmlFor="role" className="mb-1 block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="user">Student</option>
          <option value="instructor">Instructor</option>
        </select>
      </div>

      <div>
        <label htmlFor="cookingLevel" className="mb-1 block text-sm font-medium text-gray-700">
          Experience Level
        </label>
        <select
          id="cookingLevel"
          name="cookingLevel"
          value={formData.cookingLevel}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          disabled={loading}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="3"
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          placeholder="Tell us about yourself"
          disabled={loading}
          maxLength="500"
        />
      </div>

      <div className="flex items-start gap-2">
        <input id="terms" name="terms" type="checkbox" required disabled={loading} />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I agree to the Terms of Service and Privacy Policy.
        </label>
      </div>

      <button type="submit" disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}

export default RegisterForm;
