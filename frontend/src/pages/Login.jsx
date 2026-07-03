import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, Star } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const user = await login(data.email, data.password);
      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Store Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl border border-slate-800">
        
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-3 shadow-lg shadow-sky-500/5">
            <Star className="w-6 h-6 fill-sky-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">Sign in to rate and manage stores</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                placeholder="you@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Must be a valid email address',
                  },
                })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                })}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 font-semibold">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:pointer-events-none"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-400 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
