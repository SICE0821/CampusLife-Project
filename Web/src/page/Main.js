import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';

function Main() {
  const navigate = useNavigate();

  const handleNavigateToTest = () => {
    navigate('/test');
  };

  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
      <button onClick={handleNavigateToTest} className={styles.button}>Go to Test Page</button>
    </div>
  );
}

export default Main;
