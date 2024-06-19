import React from 'react';
import { useNavigate } from 'react-router-dom';

function Test() {
  const navigate = useNavigate();

  const handleNavigateToQrCheck = () => {
    navigate('/qrcheck');
  };

  return (
    <div>
      <h1>Test Page</h1>
      <button onClick={handleNavigateToQrCheck}>Go to QrCheck Page</button>
    </div>
  );
}

export default Test;
