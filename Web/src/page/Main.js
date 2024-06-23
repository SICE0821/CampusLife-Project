import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Main.module.css';
import { BiSolidNavigation } from "react-icons/bi";

function Pagebtn({ handleNavigateToTest, lecture }) {
  return (
    <button onClick={handleNavigateToTest} className={styles.pagebtn}>
      <div className={styles.pagebtntext}>
        <h3>{lecture.title} <br /></h3>
        <h5>{lecture.details} <br /></h5>
        <h5>{lecture.time}</h5>
      </div>
      <BiSolidNavigation size={80} />
    </button>
  );
}

function Main() {
  const [selectedCategory, setSelectedCategory] = useState('전공');
  const navigate = useNavigate();

  const handleNavigateToTest = () => {
    navigate('/test');
  };

  const lectures = {
    전공: [
      { title: '강의1', details: '1학년 (002분반) B608', time: '(10:10 ~ 13:00) 화요일' },
      { title: '강의2', details: '2학년 (001분반) B609', time: '(11:00 ~ 12:30) 수요일' },
      { title: '강의3', details: '2학년 (001분반) B609', time: '(11:00 ~ 12:30) 목요일' },
      { title: '강의4', details: '2학년 (001분반) B609', time: '(11:00 ~ 12:30) 금요일' },
      // Add more 전공 lectures here
    ],
    교양: [
      { title: '강의1', details: '1학년 (003분반) A101', time: '(09:00 ~ 10:30) 월요일' },
      { title: '강의2', details: '2학년 (002분반) A102', time: '(14:00 ~ 15:30) 금요일' },
      // Add more 교양 lectures here
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.area}>
        <div className={styles.selectLecture}>
          <button className={styles.btn} onClick={() => setSelectedCategory('전공')}>전공</button>
          <button className={styles.btn} onClick={() => setSelectedCategory('교양')}>교양</button>
        </div>
        <div className={styles.test}>
          <h1>{selectedCategory}과목</h1>
          <hr className={styles.hr} />
          {lectures[selectedCategory].map((lecture, index) => (
            <Pagebtn key={index} handleNavigateToTest={handleNavigateToTest} lecture={lecture} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
