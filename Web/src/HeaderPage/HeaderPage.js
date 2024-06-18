import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../page/AuthContext'; // Adjust path based on your context location

const HeaderPage = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null; // Return null to hide the header when not logged in
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/Test">Test Page</Link>
          </li>
          <li>
            <Link to="/QrCheck">QrCheck Page</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderPage;
