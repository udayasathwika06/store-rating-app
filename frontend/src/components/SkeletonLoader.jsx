import React from 'react';

const SkeletonLoader = ({ type = 'card', count = 3 }) => {
  const renderSkeletons = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      if (type === 'card') {
        items.push(
          <div key={i} className="glass-card p-6 rounded-xl animate-pulse space-y-4">
            <div className="h-6 bg-slate-800 rounded w-2/3"></div>
            <div className="h-4 bg-slate-800 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-800 rounded"></div>
              <div className="h-3 bg-slate-800 rounded w-5/6"></div>
            </div>
            <div className="flex space-x-2 pt-2">
              <div className="h-9 bg-slate-800 rounded w-24"></div>
              <div className="h-9 bg-slate-800 rounded w-24"></div>
            </div>
          </div>
        );
      } else if (type === 'table') {
        items.push(
          <tr key={i} className="animate-pulse border-b border-slate-800/50">
            <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-2/3"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-1/2"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-3/4"></div></td>
            <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-1/4"></div></td>
          </tr>
        );
      } else {
        items.push(
          <div key={i} className="animate-pulse space-y-2 py-3 border-b border-slate-800/40">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800 rounded w-2/3"></div>
          </div>
        );
      }
    }
    return items;
  };

  if (type === 'table') {
    return <>{renderSkeletons()}</>;
  }

  return <div className={type === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>{renderSkeletons()}</div>;
};

export default SkeletonLoader;
