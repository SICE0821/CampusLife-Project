import React  from 'react';
import styles from './App.module.css';

const App = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Main Page</h1>
      <p className={styles.subTitle}>This is the test page.</p>
    </div>
  );
}

export default App;