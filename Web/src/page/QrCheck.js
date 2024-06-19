import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import styles from './QrCheck.module.css';

function QrCheck() {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState("");
  const [remainingTime, setRemainingTime] = useState(2);

  const qrTime = 2;

  const handleBackClick = () => {
    navigate('/test');
  };

  useEffect(() => {
    const generateRandomQRData = () => {
      return Math.random().toString(36).substring(2, 15);
    };

    setQrData(generateRandomQRData());

    const interval = setInterval(() => {
      setQrData(generateRandomQRData());
      setRemainingTime(qrTime);
    }, qrTime * 1000);

    const countdown = setInterval(() => {
      setRemainingTime(prevTime => prevTime > 0 ? prevTime - 1 : qrTime);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  return (
    <div className={styles.container}>
      <h1>QrCheck Page</h1>
      <QRCode value={qrData} bgColor={'white'} size={256} />
      <p>Remaining Time: {remainingTime} seconds</p>
      <button onClick={handleBackClick} className={styles.button}>Back to Test Page</button>
    </div>
  );
}

export default QrCheck;
