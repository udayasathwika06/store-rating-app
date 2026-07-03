import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Table from '../components/Table';
import { toast } from 'react-toastify';
import { Star, Award, TrendingUp, RefreshCw, Mail } from 'lucide-react';

const StoreOwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stores/owner/stats');
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to load store owner stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const columns = [
    { key: 'userName', label: 'User Name', sortable: false },
    { key: 'userEmail', label: 'User Email', sortable: false, render: (row) => (
      <div className="flex items-center space-x-1.5 text-slate-400">
        <Mail className="w-3.5 h-3.5" />
        <span>{row.userEmail}</span>
      </div>
    )},
    { key: 'rating', label: 'Submitted Rating', sortable: false, render: (row) => (
      <div className="flex items-center space-x-1">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="font-bold text-slate-200">{row.rating}</span>
      </div>
    )},
    { key: 'createdAt', label: 'Submitted Date', sortable: false, render: (row) => (
      <span>{new Date(row.createdAt).toLocaleDateString()}</span>
    )},
  ];

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Store Dashboard</h1>
          <p className="text-sky-400 font-semibold text-sm mt-1">
            {stats?.storeName ? `Managing: ${stats.storeName}` : 'My Store Statistics'}
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-semibold">Refresh</span>
        </button>
      </div>

      {stats && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between group">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Rating</span>
                <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform flex items-center space-x-2">
                  <span>{stats.averageRating.toFixed(2)}</span>
                  <span className="text-sm text-slate-500 font-normal">/ 5.00</span>
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Star className="w-6 h-6 fill-amber-400/20" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between group">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ratings</span>
                <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
                  {stats.totalRatings}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* User Reviews Table */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-200">Reviews Ledger</h3>
              <p className="text-slate-500 text-xs mt-0.5">Logs of all rating submissions received from users.</p>
            </div>
            
            <Table
              columns={columns}
              data={stats.ratingsList}
              loading={false}
              emptyMessage="No rating submissions received yet."
            />
          </div>
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
