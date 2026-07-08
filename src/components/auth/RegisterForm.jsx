// src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';

function RegisterPage() {
  // Hooks
  const navigate = useNavigate();
  const { register } = useAuth();
  
  // State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  async function handleSubmit(formData) {
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      full_name: formData.fullName,
      role: formData.role,
      bio: formData.bio || '',
      cooking_level: formData.cookingLevel || 'beginner'
    };

    // Call register function from context
    const result = await register(userData);

    if (result.success) {
      // Navigate to login page on success
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-gray-900">Join EduConnect</h2>
          <p className="mt-2 text-gray-600">Create your account and start learning!</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <RegisterForm 
          onSubmit={handleSubmit}
          loading={loading}
        />

        {/* Login Link */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
