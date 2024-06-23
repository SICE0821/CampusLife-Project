import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Adjust path based on your context location
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import logo from '../image/logo.png';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageArea}>
        <img src={logo} alt="Logo" className={styles.image} />
      </div>
      <h2 className={styles.h2}>강의 출석체크 홈페이지</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.inputArea}>
          <label htmlFor="username" className={styles.inputText}>아이디 :</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.inputArea}>
          <label htmlFor="password" className={styles.inputText}>비밀번호 :</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.buttonArea}>
          <button type="submit" className={styles.button}>로그인</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
