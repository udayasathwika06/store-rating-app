import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Shield, Menu } from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="glass-panel sticky top-0 z-40 w-full border-b border-slate-800/80 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors mr-2"
        >
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-extrabold text-xl bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-wide">
          STORE RATER
        </span>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-200">{user.name}</span>
            <div className="flex items-center justify-end space-x-1">
              {user.role === 'Admin' && <Shield className="w-3 h-3 text-rose-400" />}
              <span className="text-xs font-medium text-slate-400">{user.role}</span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <User className="w-5 h-5" />
          </div>

          <button
            onClick={logout}
            className="flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-rose-400 transition-all group"
            title="Log Out"
          >
            <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
