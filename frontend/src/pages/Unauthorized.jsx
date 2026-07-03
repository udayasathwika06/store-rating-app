import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-8 animate-pulse">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
        Access Denied
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm md:text-base">
        You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default Unauthorized;
