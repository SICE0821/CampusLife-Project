import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust path based on your context location
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    login(username, password);
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>로그인</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label>사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.button}>로그인</button>
      </form>
    </div>
  );
}

export default Login;
