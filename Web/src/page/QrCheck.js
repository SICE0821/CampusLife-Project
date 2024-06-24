import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import styles from './QrCheck.module.css';

function QrCheck() {
  const [qrData, setQrData] = useState("");
  const [remainingTime, setRemainingTime] = useState(1); // QR code validity time (seconds)
  const qrTime = 1; // QR code regeneration interval (seconds)

  useEffect(() => {
    const generateQRDataWithTimestamp = () => {
      const prefix = "myApp_";
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      return prefix + timestamp;
    };

    const updateQRCode = () => {
      setQrData(generateQRDataWithTimestamp());
      setRemainingTime(5); // Reset remaining time
    };

    updateQRCode(); // Initial QR code generation

    const interval = setInterval(() => {
      updateQRCode(); // Periodically update QR code
      setRemainingTime(5); // Reset remaining time with each update
    }, qrTime * 1000);

    const countdown = setInterval(() => {
      setRemainingTime(prevTime => prevTime > 0 ? prevTime - 1 : 0); // Decrease remaining time
    }, 1000);

    // Cleanup intervals on component unmount
    return () => {
      clearInterval(interval);
      clearInterval(countdown);
    };
  }, []);

  useEffect(() => {
    if (remainingTime === 0) {
      setQrData(""); // Clear QR code when time is up
    }
  }, [remainingTime]);

  return (
    <div className={styles.App}>
      <header className="App-header">
        <h1>출석 체크</h1>
        <div>
          <QRCode value={qrData} bgColor={'white'} size={512} />
        </div>
        {/* <p>남은 시간: {remainingTime}초</p> */}
      </header>
    </div>
  );
}

export default QrCheck;
