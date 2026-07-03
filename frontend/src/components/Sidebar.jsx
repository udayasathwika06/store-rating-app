import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  KeyRound, 
  Star,
  X 
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const baseLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-slate-400 hover:text-sky-400 hover:bg-sky-500/5 border border-transparent";
  const activeLinkClasses = "flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sky-400 bg-sky-500/10 border-sky-500/20 font-semibold";

  const getLinks = () => {
    if (!user) return [];

    const common = [
      {
        path: '/change-password',
        label: 'Change Password',
        icon: <KeyRound className="w-5 h-5 group-hover:scale-105 transition-transform" />
      }
    ];

    if (user.role === 'Admin') {
      return [
        {
          path: '/admin/dashboard',
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5 group-hover:scale-105 transition-transform" />
        },
        {
          path: '/admin/users',
          label: 'Manage Users',
          icon: <Users className="w-5 h-5 group-hover:scale-105 transition-transform" />
        },
        {
          path: '/admin/stores',
          label: 'Manage Stores',
          icon: <Store className="w-5 h-5 group-hover:scale-105 transition-transform" />
        },
        ...common
      ];
    }

    if (user.role === 'User') {
      return [
        {
          path: '/user/dashboard',
          label: 'Stores Listing',
          icon: <Store className="w-5 h-5 group-hover:scale-105 transition-transform" />
        },
        ...common
      ];
    }

    if (user.role === 'Store Owner') {
      return [
        {
          path: '/owner/dashboard',
          label: 'My Store Stats',
          icon: <LayoutDashboard className="w-5 h-5 group-hover:scale-105 transition-transform" />
        },
        ...common
      ];
    }

    return common;
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-45 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/60 border-r border-slate-800/80 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          <div className="flex items-center justify-between lg:justify-center">
            <div className="flex items-center space-x-2">
              <Star className="w-6 h-6 text-sky-400 fill-sky-400 animate-pulse" />
              <span className="font-bold text-lg tracking-wider text-slate-100">NAVIGATOR</span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {getLinks().map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={onClose}
                className={({ isActive }) => (isActive ? activeLinkClasses : baseLinkClasses)}
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="border-t border-slate-800/80 pt-6">
          <div className="bg-slate-950/50 border border-slate-800/50 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-semibold text-slate-400">System Connected</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
