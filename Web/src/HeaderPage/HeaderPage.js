import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../page/AuthContext'; // Adjust path based on your context location
import styles from './HeaderPage.module.css';

const HeaderPage = () => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return null; // Return null to hide the header when not logged in
  }

  return (
    <div className={styles.header}>
      <nav>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Link to="/" className={styles.navLink}>Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/Test" className={styles.navLink}>Test Page</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/QrCheck" className={styles.navLink}>QrCheck Page</Link>
          </li>
          {/* Add more navigation links as needed */}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderPage;
