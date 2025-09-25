"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      showAlert('error', 'Passwords do not match');
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      showAlert('error', 'Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('success', 'Registration successful! Redirecting to login...');
        
        // Navigate to login page after successful registration
        setTimeout(() => {
          router.push('/auth/login');
        }, 2000);
      } else {
        showAlert('error', data.error || 'Registration failed');
      }
    } catch (error) {
      showAlert('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isRegisterEnabled = formData.name && formData.email && formData.phoneNumber && 
                           formData.password && formData.confirmPassword && formData.role;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-white">
      {/* Alert Messages */}
      {alert && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg p-4 shadow-lg ${
          alert.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center">
            <span className="mr-2">
              {alert.type === 'success' ? '✅' : '❌'}
            </span>
            <span className="font-medium">{alert.message}</span>
            <button
              onClick={() => setAlert(null)}
              className="ml-2 text-lg font-bold hover:opacity-70"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Glass Card */}
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <h5 className="mb-2 text-center text-2xl font-bold text-red-600">
          Redeemed Gospel Church - Busia
        </h5>
        <h6 className="mb-6 text-center text-lg font-semibold text-red-500">
          Create Account
        </h6>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Email Field */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Phone Number Field */}
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            required
            className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
          />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-red-600">
              Select Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
              className="mt-2 w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            >
              <option value="" disabled>
                Choose your role
              </option>
              {roles.map((role) => (
                <option key={role} value={role} className="text-red-600">
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-red-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-red-600"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Link */}
          <div className="flex justify-start">
            <Link 
              href="/auth/login" 
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Already have an account? Login here
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isRegisterEnabled || isLoading}
            className={`w-full rounded-lg p-3 font-semibold text-white shadow-lg ${
              isRegisterEnabled && !isLoading
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Creating Account...
              </div>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-red-600">
          © {new Date().getFullYear()} Redeemed Gospel Church - Busia
        </p>
      </div>
    </div>
  );
}
