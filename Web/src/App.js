import { useState, useEffect, useMemo } from 'react';
import QRCode from 'react-qr-code';

function App() {
  const [qrData, setQrData] = useState(""); // QR 코드 데이터 상태 추가
  const [remainingTime, setRemainingTime] = useState(20); // 남은 시간 상태 추가
  const qrCodeDataArray = useMemo(() => ["QR 데이터 1", "QR 데이터 2", "QR 데이터 3"], []); // useMemo를 사용하여 초기화

  useEffect(() => {
    const timer = setInterval(() => {
      // 20초마다 QR 데이터를 변경
      const randomIndex = Math.floor(Math.random() * qrCodeDataArray.length);
      setQrData(qrCodeDataArray[randomIndex]);

      // 남은 시간 업데이트
      setRemainingTime(20);
    }, 20000); // 20초

    const countdown = setInterval(() => {
      // 매 초마다 남은 시간 업데이트
      setRemainingTime(prevTime => prevTime - 1);
    }, 1000); // 1초

    // 컴포넌트가 언마운트될 때 타이머 해제
    return () => {
      clearInterval(timer);
      clearInterval(countdown);
    };
  }, [qrCodeDataArray]); // 처음 한 번만 실행되어야 함

  return (
    <div className="App">
      <h1>QRCode Check</h1>
      <div>
        <QRCode value={qrData} />
        <p>남은 시간: {remainingTime}초</p> {/* 남은 시간을 텍스트로 표시 */}
      </div>
    </div>
  );
}

export default App;
