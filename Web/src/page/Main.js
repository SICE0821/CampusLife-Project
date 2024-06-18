import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './Main.css'; // Import the CSS file
import QrCheck from './QrCheck'; // Import the test component

function Main() {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/QrCheck');
  };

  return (
    <div>
      <h1>메인 페이지 입니다.</h1>
      <p>This is the test page.</p>
      <button onClick={handleButtonClick}>Go test</button>
    </div>
  );
}

function MainWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/QrCheck" element={<QrCheck />} />
      </Routes>
    </Router>
  );
}

export default MainWithRouter;