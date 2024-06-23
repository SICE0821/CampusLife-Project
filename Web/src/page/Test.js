import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import { BiQrScan } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

const weeksData = Array.from({ length: 15 }, (_, i) => ({
    week: `${i + 1}주차 (00월 00일)`,
    attendance: '출석: 0 지각: 0 결석: 0',
    classStatus: '강의상태: 미출결',
    classTimes: [
        '1교시 00월 00일 10:10 ~ 11:00',
        '2교시 00월 00일 11:10 ~ 12:00',
        '3교시 00월 00일 12:10 ~ 13:00'
    ]
}));

const studentsData = [
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    { id: '2033053', name: '최지태', department: '컴퓨터소프트웨어과' },
    { id: '2033054', name: '김영희', department: '컴퓨터소프트웨어과' },
    
    // Add more student data here
];

function Test() {
    const navigate = useNavigate();

    const handleNavigateToQrCheck = () => {
        navigate('/qrcheck');
    };

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.side}></div>
                <div className={styles.headText}>
                    <div className={styles.headTextArea}>
                        <p className={styles.lectureName}>강의명 : 강의이름1 (대면, 주간)</p>
                        <p className={styles.lectureInfo}>강의 수강자 : 1학년 (002분반)</p>
                        <p className={styles.lectureInfo}>강의실 : B608</p>
                    </div>
                </div>
                <div className={styles.side}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.side}></div>
                <div className={styles.content}>
                    <div className={styles.class}>
                        {weeksData.map((week, index) => (
                            <div key={index} className={styles.classBox}>
                                <div className={styles.week}>
                                    <div className={styles.weekBox}>
                                        <p className={styles.weekText}>{week.week}</p>
                                        <p className={styles.attendace}>{week.attendance}</p>
                                    </div>
                                    <div className={styles.classStudent}>
                                        <p className={styles.studentNum}>수강학생: 00</p>
                                        <p className={styles.attendaceCheck}>{week.classStatus}</p>
                                    </div>
                                    <BiQrScan onClick={handleNavigateToQrCheck} size={80} className={styles.qr} />
                                </div>
                                {week.classTimes.map((classTime, idx) => (
                                    <div key={idx} className={styles.detailClassBox}>
                                        <div className={styles.detailClassText}>
                                            <p className={styles.classNum}>{classTime.split(' ')[0]}</p>
                                            <p className={styles.classTime}>{classTime}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div className={styles.student}>
                        <div className={styles.attendaceFind}>
                            <p className={styles.attendaceFindText}>출석자현황</p>
                            <FaSearch size={50} className={styles.search} />
                        </div>
                        {studentsData.map((student, index) => (
                            <div key={index} className={styles.studentInfoBox}>
                                <div className={styles.studentInfo}>
                                    <div className={styles.studentText}>
                                        <p className={styles.studentInfoText}>({student.id}) {student.name}</p>
                                        <p className={styles.studentDepartment}>{student.department}</p>
                                    </div>
                                    <div className={styles.attendaceBox}>
                                        <div className={styles.attendaceCheckBox}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.side}></div>
            </div>
        </div>
    );
}

export default Test;
