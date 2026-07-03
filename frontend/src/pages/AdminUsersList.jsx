import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Eye, Plus, Shield, UserPlus, EyeOff } from 'lucide-react';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Modals state
  const [isAddOpen, setAddOpen] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/users', {
        params: {
          page,
          limit: 10,
          search,
          role: roleFilter,
          sortBy,
          sortOrder,
        },
      });
      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
    } catch (err) {
      toast.error('Failed to retrieve user list');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, sortBy, sortOrder]);

  const handleSort = (columnKey) => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleViewDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setDetailsOpen(true);
      const res = await API.get(`/admin/user/${userId}`);
      setSelectedUser(res.data.data);
    } catch (err) {
      toast.error('Failed to load user details');
      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=/[\]\\~`';]).{8,16}$/;

  const handleCreateUser = async (data) => {
    try {
      const res = await API.post('/admin/users', data);
      toast.success(res.data.message || 'User created successfully');
      setAddOpen(false);
      reset();
      fetchUsers();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create user';
      toast.error(errorMsg);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (row) => (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
        row.role === 'Admin' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
        row.role === 'Store Owner' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' :
        'bg-sky-500/10 text-sky-400 border border-sky-500/20'
      }`}>
        {row.role}
      </span>
    )},
    { key: 'address', label: 'Address', sortable: false, render: (row) => (
      <span className="truncate max-w-[200px] block" title={row.address}>
        {row.address}
      </span>
    )},
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (row) => (
        <button
          onClick={() => handleViewDetails(row.id)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage Users</h1>
          <p className="text-slate-400 text-sm mt-1">Create and inspect system accounts.</p>
        </div>
        <button
          onClick={() => { reset(); setShowPassword(false); setAddOpen(true); }}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg shadow-sky-500/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Role Filter Selector */}
      <div className="flex items-center space-x-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 max-w-max">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Filter:</span>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-lg text-xs text-slate-200 py-1.5 px-3 outline-none cursor-pointer"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="User">Normal User</option>
          <option value="Store Owner">Store Owner</option>
        </select>
      </div>

      {/* Users Table */}
      <Table
        columns={columns}
        data={users}
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

      {/* Modal 1: Add User */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Create New Account">
        <form onSubmit={handleSubmit(handleCreateUser)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              placeholder="Min 20, max 60 characters"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 20, message: 'Name must be at least 20 characters' },
                maxLength: { value: 60, message: 'Name cannot exceed 60 characters' },
              })}
              className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none"
            />
            {errors.name && <p className="text-xs text-rose-400 font-semibold">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              placeholder="user@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Must be a valid email address',
                },
              })}
              className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none"
            />
            {errors.email && <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  maxLength: { value: 16, message: 'Password cannot exceed 16 characters' },
                  pattern: {
                    value: passwordRegex,
                    message: 'Must contain one uppercase, one number, and one special character',
                  },
                })}
                className="w-full pl-4 pr-12 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-400 font-semibold">{errors.password.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Address</label>
            <textarea
              placeholder="Max 400 characters"
              rows="2"
              {...register('address', {
                required: 'Address is required',
                maxLength: { value: 400, message: 'Address cannot exceed 400 characters' },
              })}
              className="w-full px-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none resize-none"
            />
            {errors.address && <p className="text-xs text-rose-400 font-semibold">{errors.address.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Role</label>
            <select
              {...register('role', { required: 'Role is required' })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl text-sm text-slate-200 outline-none cursor-pointer"
            >
              <option value="User">Normal User</option>
              <option value="Store Owner">Store Owner</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
          >
            Create User
          </button>
        </form>
      </Modal>

      {/* Modal 2: View User Details */}
      <Modal isOpen={isDetailsOpen} onClose={() => setDetailsOpen(false)} title="User Account Details">
        {detailsLoading ? (
          <div className="py-12 flex justify-center"><LoadingSpinner /></div>
        ) : selectedUser ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">{selectedUser.name}</h4>
                <span className="text-xs text-slate-500">{selectedUser.email}</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</span>
                <p className="text-sm text-slate-300 font-semibold">{selectedUser.role}</p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address</span>
                <p className="text-sm text-slate-300">{selectedUser.address}</p>
              </div>

              {selectedUser.role === 'Store Owner' && (
                <div className="grid grid-cols-2 gap-4 bg-sky-500/5 p-4 rounded-xl border border-sky-500/10">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Average Store Rating</span>
                    <p className="text-xl font-extrabold text-sky-400 mt-1">
                      {selectedUser.averageStoreRating ? `${selectedUser.averageStoreRating} / 5.0` : 'No Ratings'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Store Ratings</span>
                    <p className="text-xl font-extrabold text-slate-200 mt-1">{selectedUser.totalRatingsCount}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-6">Could not load details.</p>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsersList;
