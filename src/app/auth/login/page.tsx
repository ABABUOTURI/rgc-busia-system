"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const roles = ["Snr Pastor", "Pastor's Wife", "Finance", "Deacons", "Admin"];

export default function LoginPage() {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  const [selectedRole, setSelectedRole] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      const endpoint = loginMethod === 'otp' ? '/api/auth/otp/verify' : '/api/auth/login';
      const payload = loginMethod === 'otp'
        ? { phoneNumber: identifier, otp, role: selectedRole }
        : { identifier, password, role: selectedRole };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and name in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        if (data.name) localStorage.setItem('name', data.name);
        
        showAlert('success', 'Login successful! Redirecting...');
        
        // Navigate based on role
        setTimeout(() => {
          switch (data.role) {
            case 'Admin':
              router.push('/admin');
              break;
            case 'Snr Pastor':
              router.push('/snr-pastor');
              break;
            case "Pastor's Wife":
              router.push('/pastors-wife');
              break;
            case 'Deacons':
              router.push('/deacons');
              break;
            case 'Finance':
              router.push('/finance');
              break;
            default:
              router.push('/dashboard');
          }
        }, 1500);
      } else {
        showAlert('error', data.error || 'Login failed');
      }
    } catch (error) {
      showAlert('error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!identifier || !selectedRole) {
      showAlert('error', 'Enter phone number and select role');
      return;
    }
    setIsSendingOtp(true);
    setAlert(null);
    try {
      const response = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: identifier, role: selectedRole }),
      });
      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        showAlert('success', 'OTP sent. Please check your phone.');
      } else {
        showAlert('error', data.error || 'Failed to send OTP');
      }
    } catch (err) {
      showAlert('error', 'Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const isLoginEnabled = loginMethod === "password" ? (identifier && password) : (identifier && otp);

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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-red-600">
              Select Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
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

          {/* Login Method Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setLoginMethod("password")}
              className={`px-4 py-2 rounded-lg font-medium ${
                loginMethod === "password"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100"
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("otp")}
              className={`px-4 py-2 rounded-lg font-medium ${
                loginMethod === "otp"
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100"
              }`}
            >
              OTP
            </button>
          </div>

          {/* Input Fields */}
          {loginMethod === "password" && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </>
          )}

          {loginMethod === "otp" && (
            <>
              <input
                type="tel"
                placeholder="Phone Number"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSendingOtp}
                className={`w-full rounded-lg p-3 font-semibold text-white ${isSendingOtp ? 'bg-red-300 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
              >
                {isSendingOtp ? 'Sending OTP...' : otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full rounded-lg border border-red-300 bg-red-50 p-3 text-red-600 placeholder-red-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute inset-y-0 right-3 flex items-center text-red-600"
                >
                  {showOtp ? "Hide" : "Show"}
                </button>
              </div>
            </>
          )}

          {/* Forgot Password */}
          <div className="flex justify-end">
            <a href="#" className="text-sm font-medium text-red-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Register Link */}
          <div className="flex justify-start">
            <Link 
              href="/auth/register" 
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Don't have an account? Register here
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!isLoginEnabled || isLoading}
            className={`w-full rounded-lg p-3 font-semibold text-white shadow-lg ${
              isLoginEnabled && !isLoading
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Logging in...
              </div>
            ) : (
              "Login"
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
