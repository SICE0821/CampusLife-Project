import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust path based on your context location
import Login from './Login';
import Main from './Main';
import Test from './Test';
import QrCheck from './QrCheck';
import HeaderPage from '../HeaderPage/HeaderPage';

const Navigator = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <HeaderPage />
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Main /> : <Navigate to="/Login" />} />
        <Route path="/Test" element={isLoggedIn ? <Test /> : <Navigate to="/Login" />} />
        <Route path="/QrCheck" element={isLoggedIn ? <QrCheck /> : <Navigate to="/Login" />} />
      </Routes>
    </Router>
  );
}

export default Navigator;
