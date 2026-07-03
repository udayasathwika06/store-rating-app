import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Plus, Star, Store, User, EyeOff, Eye } from 'lucide-react';

const AdminStoresList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Add Store Modal state
  const [isAddOpen, setAddOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stores', {
        params: {
          page,
          limit: 10,
          search,
          sortBy,
          sortOrder,
        },
      });
      setStores(res.data.data.stores);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to retrieve stores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [page, search, sortBy, sortOrder]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleCreateStore = async (data) => {
    try {
      const res = await API.post('/admin/stores', data);
      toast.success(res.data.message || 'Store and owner created successfully');
      setAddOpen(false);
      reset();
      fetchStores();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create store';
      toast.error(errorMsg);
    }
  };

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]).{8,16}$/;

  const columns = [
    { key: 'name', label: 'Store Name', sortable: true },
    { key: 'email', label: 'Store Email', sortable: true },
    { key: 'address', label: 'Address', sortable: false, render: (row) => (
      <span className="truncate max-w-[200px] block" title={row.address}>
        {row.address}
      </span>
    )},
    {
      key: 'overallRating',
      label: 'Overall Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span className="font-bold text-slate-200">{row.overallRating.toFixed(1)}</span>
          <span className="text-slate-500 text-xs">({row.totalRatings})</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage Stores</h1>
          <p className="text-slate-400 text-sm mt-1">Configure and manage listing locations.</p>
        </div>
        <button
          onClick={() => { reset(); setShowPassword(false); setAddOpen(true); }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Store</span>
        </button>
      </div>

      {/* Stores Table */}
      <Table
        columns={columns}
        data={stores}
        loading={loading}
        searchValue={search}
        onSearchChange={(val) => { setSearch(val); setPage(1); }}
        searchPlaceholder="Search by Name, Email, or Address..."
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        pagination={pagination}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modal: Add Store & Owner */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Add New Store & Owner">
        <form onSubmit={handleSubmit(handleCreateStore)} className="space-y-5">
          {/* Section 1: Store Information */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Store className="w-4 h-4" />
              <span>Store Details</span>
            </h4>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Store Name</label>
              <input
                type="text"
                placeholder="Store Name (20-60 characters)"
                {...register('name', {
                  required: 'Store Name is required',
                  minLength: { value: 20, message: 'Store Name must be at least 20 characters' },
                  maxLength: { value: 60, message: 'Store Name cannot exceed 60 characters' },
                })}
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none"
              />
              {errors.name && <p className="text-xs text-rose-400 font-semibold">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Store Email</label>
              <input
                type="email"
                placeholder="store@example.com"
                {...register('email', {
                  required: 'Store email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Must be a valid email address',
                  },
                })}
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none"
              />
              {errors.email && <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Store Address</label>
              <textarea
                placeholder="Store location address (max 400 characters)"
                rows="2"
                {...register('address', {
                  required: 'Store address is required',
                  maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
                })}
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none resize-none"
              />
              {errors.address && <p className="text-xs text-rose-400 font-semibold">{errors.address.message}</p>}
            </div>
          </div>

          <div className="border-t border-slate-800 my-2"></div>

          {/* Section 2: Owner Information */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center space-x-1.5">
              <User className="w-4 h-4" />
              <span>Owner Account Details</span>
            </h4>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Owner Name</label>
              <input
                type="text"
                placeholder="Owner Name (20-60 characters)"
                {...register('ownerName', {
                  required: 'Owner Name is required',
                  minLength: { value: 20, message: 'Owner Name must be at least 20 characters' },
                  maxLength: { value: 60, message: 'Owner Name cannot exceed 60 characters' },
                })}
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none"
              />
              {errors.ownerName && <p className="text-xs text-rose-400 font-semibold">{errors.ownerName.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Owner Email</label>
              <input
                type="email"
                placeholder="owner@example.com"
                {...register('ownerEmail', {
                  required: 'Owner email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: 'Must be a valid email address',
                  },
                })}
                className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none"
              />
              {errors.ownerEmail && <p className="text-xs text-rose-400 font-semibold">{errors.ownerEmail.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">Owner Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('ownerPassword', {
                    required: 'Owner password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                    maxLength: { value: 16, message: 'Password cannot exceed 16 characters' },
                    pattern: {
                      value: passwordRegex,
                      message: 'Must contain one uppercase, one number, and one special character',
                    },
                  })}
                  className="w-full pl-4 pr-12 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.ownerPassword && <p className="text-xs text-rose-400 font-semibold">{errors.ownerPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
          >
            Create Store & Owner
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AdminStoresList;
