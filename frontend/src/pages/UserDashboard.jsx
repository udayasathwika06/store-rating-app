import React, { useState, useEffect } from 'react';
import API from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Star, MapPin, Search, ArrowUpDown, Award, CheckCircle } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Rating Modal state
  const [isRatingOpen, setRatingOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stores', {
        params: {
          search,
          sortBy,
          sortOrder,
        },
      });
      setStores(res.data.data);
    } catch (err) {
      toast.error('Failed to load stores list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder]);

  const handleOpenRating = (store) => {
    setSelectedStore(store);
    setSelectedRating(store.myRating || 5);
    setRatingOpen(true);
  };

  const handleRatingSubmit = async () => {
    try {
      setRatingSubmitting(true);
      // We can use POST /api/ratings, which handles upserting (creating if new, updating if exists)
      const res = await API.post('/ratings', {
        rating: selectedRating,
        storeId: selectedStore.id,
      });

      toast.success(res.data.message || 'Rating submitted successfully!');
      setRatingOpen(false);
      fetchStores();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit rating';
      toast.error(errorMsg);
    } finally {
      setRatingSubmitting(false);
    }
  };

  // Stats summaries
  const totalStores = stores.length;
  const myRatedStores = stores.filter((s) => s.myRating !== null).length;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Stores Listing</h1>
        <p className="text-slate-400 text-sm mt-1">Explore, search, and rate your favorite stores.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Stores</span>
            <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
              {totalStores}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800/80 flex items-center justify-between group">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Rated Stores</span>
            <h2 className="text-3xl font-extrabold text-slate-100 group-hover:scale-105 origin-left transition-transform">
              {myRatedStores}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-slate-900/30 p-5 rounded-2xl border border-slate-800/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search stores by Name or Address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort By:</span>
          </span>
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [by, order] = e.target.value.split('-');
              setSortBy(by);
              setSortOrder(order);
            }}
            className="bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-xs text-slate-200 py-2 px-3 outline-none cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="overallRating-desc">Highest Rated</option>
            <option value="overallRating-asc">Lowest Rated</option>
          </select>
        </div>
      </div>

      {/* Stores List */}
      {loading ? (
        <div className="py-12 flex justify-center"><LoadingSpinner size="lg" /></div>
      ) : stores.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl border border-slate-800/80 text-center">
          <p className="text-slate-500 text-sm">No matching stores found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="glass-panel p-6 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-slate-100 group-hover:text-sky-400 transition-colors">
                    {store.name}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 flex items-start space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span>{store.address}</span>
                </p>
              </div>

              <div className="border-t border-slate-800/80 my-1 pt-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Overall Rating</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-200 text-sm">{store.overallRating.toFixed(1)}</span>
                    <span className="text-slate-500 text-[10px]">({store.totalRatings})</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 block">My Rating</span>
                  <div className="flex items-center space-x-1 mt-0.5 justify-end">
                    {store.myRating ? (
                      <>
                        <Star className="w-4 h-4 text-sky-400 fill-sky-400" />
                        <span className="font-bold text-sky-400 text-sm">{store.myRating}</span>
                      </>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Not Rated</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleOpenRating(store)}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all border ${
                  store.myRating
                    ? 'border-sky-500/20 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20'
                    : 'border-slate-800 bg-slate-900 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {store.myRating ? 'Edit Rating' : 'Rate Store'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Rating Submission */}
      <Modal
        isOpen={isRatingOpen}
        onClose={() => setRatingOpen(false)}
        title={selectedStore?.myRating ? `Edit Rating for ${selectedStore.name}` : `Rate ${selectedStore?.name}`}
      >
        <div className="space-y-6 text-center">
          <p className="text-slate-400 text-sm">
            Select a rating value between 1 and 5 stars for this store location.
          </p>

          {/* Interactive Star Selector */}
          <div className="flex items-center justify-center space-x-3">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSelectedRating(val)}
                className="p-1 hover:scale-110 active:scale-95 transition-transform"
              >
                <Star
                  className={`w-10 h-10 transition-colors ${
                    val <= selectedRating
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-800 fill-transparent'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setRatingOpen(false)}
              className="flex-1 py-2 rounded-xl border border-slate-800 bg-slate-900 text-xs font-bold text-slate-300 hover:bg-slate-850"
            >
              Cancel
            </button>
            <button
              onClick={handleRatingSubmit}
              disabled={ratingSubmitting}
              className="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg transition-all flex items-center justify-center space-x-1"
            >
              {ratingSubmitting ? (
                <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin"></div>
              ) : (
                <span>Submit Rating</span>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserDashboard;
