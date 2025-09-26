import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, BarChart, Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Trophy size={32} />
          <span>FIFA Career Stats</span>
        </div>
        <ul className="navbar-nav">
          <li>
            <Link to="/">
              <BarChart size={18} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin">
              <Settings size={18} />
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 