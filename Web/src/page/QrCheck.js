import React from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';

const QrCheck = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/Test');
  };

  return (
    <div>
      <h1>QrCheck Page</h1>
      <QRCode value="example-qrcode-value" />
      <button onClick={handleBackClick}>Back to Test Page</button>
    </div>
  );
}

export default QrCheck;
