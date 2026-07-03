import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff } from 'lucide-react';

const ChangePassword = () => {
  const { updatePassword } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]).{8,16}$/;

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      const success = await updatePassword(data.oldPassword, data.newPassword);
      if (success) reset();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Update Password</h1>
        <p className="text-slate-400 text-sm mt-1">
          Keep your account secure by changing your password periodically.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Old Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showOld ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('oldPassword', { required: 'Current password is required' })}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-rose-400 font-semibold">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  maxLength: {
                    value: 16,
                    message: 'Password cannot exceed 16 characters',
                  },
                  pattern: {
                    value: passwordRegex,
                    message: 'Must contain one uppercase, one number, and one special character',
                  },
                })}
                className="w-full pl-10 pr-12 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="text-xs text-rose-400 font-semibold">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/10 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-75 disabled:pointer-events-none"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
            ) : (
              <span>Update Password</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
