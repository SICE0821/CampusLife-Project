import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import { BiQrScan } from "react-icons/bi";

function Test() {
  const navigate = useNavigate();

  const handleNavigateToQrCheck = () => {
    navigate('/qrcheck');
  };

  return (
    // <div className={styles.container}>
    //   <div className={styles.head}>
    //     <h2>강의명 : 강의1 (대면, 주간) <br /></h2>
    //     <h3>강의수강자 : 1학년 (002분반) <br /></h3>
    //     <h3>강의실 : B608</h3>
    //   </div>
    //   <div className={styles.body}>
    //     <div className={styles.weekArea}>

    //       <div className={styles.week}>
    //         <div className={styles.textArea}>
    //           <p className={styles.weekText}>1주차 (00월 00일)</p>
    //           <p className={styles.attendanceText}>출석자: 00 지각자: 00 결석자: 00</p>
    //         </div>
    //         <div className={styles.textArea}>
    //           <p className={styles.studentinfo}>총 수강학생: 00명</p>
    //           <p className={styles.studentinfo}>강의상태: 미출결</p>
    //         </div>
    //         <BiQrScan onClick={handleNavigateToQrCheck} size={90} className={styles.qr}/>
    //       </div>

    //       <div className={styles.class}>
    //         <p className={styles.classText}>1교시</p>
    //         <p className={styles.classText}>00월 00일 10:10 ~ 11:00</p>
    //       </div>

    //       <div className={styles.class}>
    //         <p className={styles.classText}>2교시</p>
    //         <p className={styles.classText}>00월 00일 11:10 ~ 12:00</p>
    //       </div>

    //       <div className={styles.class}>
    //         <p className={styles.classText}>3교시</p>
    //         <p className={styles.classText}>00월 00일 12:10 ~ 13:00</p>
    //       </div>

    //     </div>
    //     <div className={styles.student}>
    //       <div className={styles.find}>

    //       </div>

    //     </div>
    //   </div>
    //   <h1>Test Page</h1>
    //   <button onClick={handleNavigateToQrCheck}>Go to QrCheck Page</button>
    // </div>

    <div className={styles.container}>
      <div className={styles.head}>
        <p>ads</p>
      </div>
      <div className={styles.content}>
        <div className={styles.side}></div>
        <div className={styles.week}>
          <div className={styles.weekbox}>

          </div>
        </div>
        <div className={styles.student}>

        </div>
        <div className={styles.side}></div>
      </div>
    </div>
  );
}

export default Test;
