import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import styles from './QrCheck.module.css';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import config from './config'

function QrCheck() {
  const [qrData, setQrData] = useState("");
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState(1); // QR code validity time (seconds)
  const qrTime = 1; // QR code regeneration interval (seconds)
  const location = useLocation();
  const { selectLecture, weeknum } = location.state || {};

  useEffect(() => {
    const generateQRDataWithTimestamp = () => {
      const prefix = "CampusLife_" + selectLecture.lecture_name + "_";
      const now = new Date();
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      //console.log(prefix + timestamp);
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

  const handleNavigateToTest = () => {
    navigate('/test', { state: { selectLecture } });
  };

  useEffect(() => {
    if (remainingTime === 0) {
      setQrData(""); // Clear QR code when time is up
    }
  }, [remainingTime]);

  //해당 과목을 듣는 전체 총 학생 PK 가져오기
  const GetTotalStudentPK = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetTotalStudentPK`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lecture_id: selectLecture.lecture_id
        })
      })
      const TotalStudentFk = await response.json();
      return TotalStudentFk
    } catch (error) {
      console.error(error);
    }
  }

  //해당 과목 출석한 총 학생 PK 가져오기
  const GetAttendanceStudentPK = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/GetAttendanceStudentPK`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lecture_id: selectLecture.lecture_id,
          weeknum: weeknum
        })
      })
      const AttendanceStudentFk = await response.json();
      return AttendanceStudentFk
    } catch (error) {
      console.error(error);
    }
  }

  //나머지 학생들 데이터 결석 처리하기
  const InsertMissingStudentAttendance = async (sutdent_fk, classnum) => {
    try {
      const response = await fetch(`${config.serverUrl}/InsertMissingStudentAttendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sutdent_fk: sutdent_fk,
          lecture_fk: selectLecture.lecture_id,
          weeknum: weeknum,
          classnum: classnum
        })
      })
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={styles.App}>
      <header className="App-header">
        <h1>출석 체크</h1>
        <div>
          <QRCode value={qrData} bgColor={'white'} size={512} />
        </div>
        {/* <p>남은 시간: {remainingTime}초</p> */}
      </header>
      <div className={styles.Button_space}>
        <button className={styles.completeAttendance} onClick={async () => {
          const TotalStudentPK = await GetTotalStudentPK(); //과목 총 학생 FK
          const AttendanceStudentPK = await GetAttendanceStudentPK(); //과목 출석 학생 FK

          const totalStudentIds = new Set(TotalStudentPK.map(item => item.student_id));
          const attendanceStudentIds = new Set(AttendanceStudentPK.map(item => item.student_id));

          // Find the student_ids that are in TotalStudentPK but not in AttendanceStudentPK
          const missingStudentIds = [...totalStudentIds].filter(id => !attendanceStudentIds.has(id)); //나머지 학생 FK

          const periods = [1, 2, 3];

          for (const student of missingStudentIds) {
            for (const period of periods) {
              try {
                await InsertMissingStudentAttendance(student, period);
              } catch (error) {
                console.error(error);
              }
            }
          }
          handleNavigateToTest();
        }
        }>
          <p className={styles.completeAttendanceText}>출석 마감</p>
        </button>
      </div>
    </div>
  );
}

export default QrCheck;