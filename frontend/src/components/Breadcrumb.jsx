import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex text-sm text-slate-400 mb-6 bg-slate-900/40 px-4 py-2.5 rounded-lg border border-slate-800/60 max-w-max">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/" className="hover:text-sky-400 transition-colors">
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');

          return (
            <li key={name} className="flex items-center">
              <span className="mx-2 text-slate-600">/</span>
              {isLast ? (
                <span className="text-slate-200 font-medium">{displayName}</span>
              ) : (
                <Link to={routeTo} className="hover:text-sky-400 transition-colors">
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
