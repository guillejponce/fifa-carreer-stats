import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BarChart, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="w-full bg-gray-900 text-white sticky top-0 z-30 shadow">
      <div className="page-wrapper flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Trophy size={24} className="text-yellow-400" />
          <span className="hidden sm:block">FIFA Career Stats</span>
        </Link>

        <ul className="flex items-center gap-4 text-sm">
          <li>
            <Link to="/" className="flex items-center gap-1 hover:text-cyan-400">
              <BarChart size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin" className="flex items-center gap-1 hover:text-cyan-400">
              <Settings size={18} />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 