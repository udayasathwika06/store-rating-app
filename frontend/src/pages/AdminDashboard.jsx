import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Store, Star, Calendar, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/dashboard');
      setStats(res.data.data.stats);
      setActivities(res.data.data.recentActivities);
    } catch (err) {
      toast.error('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[50vh]" />;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Real-time statistics and system activities.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-semibold">Sync Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
                {stats.totalUsers}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stores</span>
              <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
                {stats.totalStores}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Store className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Ratings</span>
              <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
                {stats.totalRatings}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Star className="w-6 h-6 fill-purple-400/20" />
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities Section */}
      <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/80 bg-slate-900/20 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200">Recent Activities</h3>
          <span className="text-xs text-slate-500">Last 10 actions</span>
        </div>
        <div className="p-6">
          {activities.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">No recent activities found.</p>
          ) : (
            <div className="flow-root">
              <ul className="-mb-8">
                {activities.map((activity, idx) => (
                  <li key={idx}>
                    <div className="relative pb-8">
                      {idx !== activities.length - 1 && (
                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-800" aria-hidden="true" />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-slate-950 ${
                            activity.type === 'user_register' ? 'bg-sky-950 text-sky-400' :
                            activity.type === 'store_add' ? 'bg-indigo-950 text-indigo-400' :
                            'bg-purple-950 text-purple-400'
                          }`}>
                            {activity.type === 'user_register' ? <Users className="w-4 h-4" /> :
                             activity.type === 'store_add' ? <Store className="w-4 h-4" /> :
                             <Star className="w-4 h-4" />}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-slate-300">
                              {activity.description}
                            </p>
                          </div>
                          <div className="text-right text-xs whitespace-nowrap text-slate-500 flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{new Date(activity.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
