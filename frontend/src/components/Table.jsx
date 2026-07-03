import React from 'react';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Table = ({
  columns,
  data,
  loading,
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  sortBy,
  sortOrder,
  onSort,
  pagination,
  onPageChange,
  emptyMessage = 'No data available',
}) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-slate-800/80">
      {/* Search Bar / Controls */}
      {onSearchChange && (
        <div className="p-5 border-b border-slate-800/60 bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/60 border border-slate-800 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 rounded-xl text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && onSort && onSort(col.key)}
                  className={`px-6 py-4 text-xs font-semibold text-slate-400 tracking-wider uppercase ${
                    col.sortable ? 'cursor-pointer select-none hover:text-slate-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.label}</span>
                    {col.sortable && sortBy === col.key && (
                      sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 bg-slate-900/10">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <LoadingSpinner />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  className="hover:bg-slate-900/30 transition-colors border-b border-slate-800/40"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-slate-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 border-t border-slate-800/60 bg-slate-900/20 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-200">{(pagination.page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="font-semibold text-slate-200">{pagination.total}</span> entries
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {[...Array(pagination.pages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => onPageChange(num + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                    pagination.page === num + 1
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/10'
                      : 'border border-slate-800 bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {num + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-3.5 py-1.5 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-50 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
