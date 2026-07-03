import React from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-8 animate-bounce">
        <HelpCircle className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight mb-4">
        Page Not Found
      </h1>
      <p className="text-slate-400 max-w-md mb-8 text-sm md:text-base">
        The page you are looking for does not exist or has been moved to a different URL.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-sky-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
