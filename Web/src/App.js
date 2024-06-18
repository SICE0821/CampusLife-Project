import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import './App.css'; // Import the CSS file

function App() {
  const [qrData, setQrData] = useState(""); 
  const [remainingTime, setRemainingTime] = useState(20);
  
  const qrTime = 2;

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
    <div className="App">
      <header className="App-header">
        <h1>출석 체크</h1>
        <div>
          <QRCode value={qrData} bgColor={'white'} size={512}/>
          <p>남은 시간: {remainingTime}초</p>
        </div>
      </header>
    </div>
  );
}

export default App;