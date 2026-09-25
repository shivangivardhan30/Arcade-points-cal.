import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, CloudLightning, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setErr('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setErr('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setErr('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (error) {
      setErr(error.message || 'Registration failed. Please check your data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md app-card p-8 sm:p-10"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#4285F4] text-white shadow mb-3">
            <CloudLightning className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#E6EAF2]">
            Create an Account
          </h2>
          <p className="text-xs text-[#94A3B8] mt-1.5">
            Join Points<span className="text-[#4285F4]">Calculator</span> to calculate and track your progress
          </p>
        </div>

        {/* Error Alert */}
        {err && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 p-3.5 mb-6 text-sm text-[#EA4335] bg-[#EA4335]/10 border border-[#EA4335]/30 rounded-xl"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-medium">{err}</span>
          </motion.div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#E6EAF2] pl-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-5 h-5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#E6EAF2] pl-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-[#94A3B8]" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#E6EAF2] pl-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-[#94A3B8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#94A3B8] hover:text-[#E6EAF2] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[#E6EAF2] pl-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-[#94A3B8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#0B1220] border border-[#1E2A44] rounded-xl text-xs font-semibold text-[#E6EAF2] placeholder:text-[#94A3B8] outline-none focus:border-[#4285F4] transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 mt-6 py-3 px-4 rounded-xl bg-[#4285F4] hover:bg-blue-500 text-white font-semibold shadow disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign Up <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#94A3B8] mt-8">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#4285F4] hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};
