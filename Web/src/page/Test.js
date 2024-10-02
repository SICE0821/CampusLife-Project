import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import { BiQrScan } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import config from './config'
import Modal from 'react-modal';

Modal.setAppElement('#root'); // 접근성을 위해 필요합니다.

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
    const location = useLocation();
    const { selectLecture } = location.state || {};
    const [selected, setSelected] = useState({ weekIndex: 0, classIndex: 0 }); //주차와 교시(차시)를 선택할때 사용하는 데이터
    const [totalStudentNum, setTotalStudentNum] = useState();
    const [studentAttendanceStates, setStudentAttendanceStates] = useState([]);
    const [totalStudentInfo, setTotalStudentInfo] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await GetTotalStudentNum();
                await GetWeekClassStudentAttendanceStates(1, 1);
                await GetTotalStudentInfo();

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);



    //주차 차시 색 변경 함수
    const handleButtonClick = (weekIndex, classIndex) => {
        setSelected({ weekIndex, classIndex });
        GetWeekClassStudentAttendanceStates(weekIndex + 1, classIndex + 1);
    };

    //해당과목 날짜 변환기
    const formatDateWithOffset = (dateString, offsetDays) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + offsetDays);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${month}월 ${day}일`;
    };
    //해당과목 시간 변환기
    function splitTimeSlots(timeRange) {
        const [startTime, endTime] = timeRange.replace(/\s/g, '').split('~');
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour] = endTime.split(':').map(Number);
        const timeSlots = [];

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour) {
            const nextHour = currentHour + 1;
            const nextMinute = 0;

            timeSlots.push(`${String(currentHour).padStart(2, '0')}: ${String(currentMinute).padStart(2, '0')} ~ ${String(nextHour).padStart(2, '0')}: ${String(nextMinute).padStart(2, '0')}`);

            currentHour++;
        }

        return timeSlots;
    }

    // 테스트
    const input = "14 : 10 ~ 17 : 00";
    const result = splitTimeSlots(input);
    console.log(result);


    //QR 코드 화면으로 이동하기
    const handleNavigateToQrCheck = () => {
        navigate('/qrcheck');
    };

    //해당 과목을 듣는 전체 총 학생 수 가져오기
    const GetTotalStudentNum = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/GetTotalStudentNum`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lecture_id: selectLecture.lecture_id
                })
            })
            const TotalStudentNum = await response.json();
            setTotalStudentNum(TotalStudentNum.TotalstudentNum);
        } catch (error) {
            console.error(error);
        }
    }


    //해당 과목을 듣는 전체 총 학생 정보 가져오기
    const GetTotalStudentInfo = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/GetTotalStudentInfo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lecture_id: selectLecture.lecture_id
                })
            })
            const TotalStudentInfo = await response.json();
            console.log(TotalStudentInfo);
            setTotalStudentInfo(TotalStudentInfo);
        } catch (error) {
            console.error(error);
        }
    }

    //주차와 차시를 통한 학생들 출결 상태 가져오기
    const GetWeekClassStudentAttendanceStates = async (weeknum, classnum) => {
        try {
            const response = await fetch(`${config.serverUrl}/GetWeekClassStudentAttendanceStates`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lecture_id: selectLecture.lecture_id,
                    weeknum: weeknum,
                    classnum: classnum
                })
            })
            const StudentAttendanceStates = await response.json();
            setStudentAttendanceStates(StudentAttendanceStates);
        } catch (error) {
            console.error(error);
        }
    }

    const weeksData = Array.from({ length: selectLecture.lecture_have_week }, (_, i) => {
        const Tiemslosts = splitTimeSlots(selectLecture.lecture_time);
        const lecture_start_date = formatDateWithOffset(selectLecture.lecture_start_date, i * 7);
        return {
            week: `${i + 1}주차 (${lecture_start_date})`,
            attendance: '출석: 0 지각: 0 결석: 0',
            classStatus: '강의상태: 미출결',
            classTimes: [
                `1교시 ${lecture_start_date} ${Tiemslosts[0]}`,
                `2교시 ${lecture_start_date} ${Tiemslosts[1]}`,
                `3교시 ${lecture_start_date} ${Tiemslosts[2]}`
            ]
        };
    });

    return (
        <div className={styles.container}>
            <div className={styles.head}>
                <div className={styles.side}></div>
                <div className={styles.headText}>
                    <div className={styles.headTextArea}>
                        <p className={styles.lectureName}>강의명 : {selectLecture.lecture_name}
                            {selectLecture.lecture_room === "온라인수업" ? ' (온라인 수업)' : ' (대면, 주간)'}
                        </p>
                        <p className={styles.lectureInfo}>강의 수강자 : {selectLecture.lecture_grade}학년 [{selectLecture.section_class}]</p>
                        <p className={styles.lectureInfo}>강의실 : {selectLecture.lecture_room}</p>
                    </div>
                </div>
                <div className={styles.side}></div>
            </div>
            <div className={styles.body}>
                <div className={styles.side}></div>
                <div className={styles.content}>
                    <div className={styles.class}>
                        {weeksData.map((week, weekIndex) => (
                            <div key={weekIndex} className={styles.classBox}>
                                <div className={styles.week}>
                                    <div className={styles.weekBox}>
                                        <p className={styles.weekText}>{week.week}</p>
                                        <p className={styles.attendace}>{week.attendance}</p>
                                    </div>
                                    <div className={styles.classStudent}>
                                        <p className={styles.studentNum}>총 수강학생: {totalStudentNum}</p>

                                    </div>
                                    <BiQrScan onClick={handleNavigateToQrCheck} size={80} className={styles.qr} />
                                </div>
                                {week.classTimes.map((classTime, classIndex) => (
                                    <div
                                        key={classIndex}
                                        className={`${styles.detailClassBox} ${selected.weekIndex === weekIndex && selected.classIndex === classIndex ? styles.selected : ''}`}
                                        onClick={() => {
                                        
                                            handleButtonClick(weekIndex, classIndex);
                                        }}
                                        role="button"
                                        tabIndex={0}
                                    >
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
                        {(studentAttendanceStates.length > 0 ? studentAttendanceStates : totalStudentInfo).map((student, index) => (
                            <div key={index} className={styles.studentInfoBox}>
                                <div className={styles.studentInfo}>
                                    <div className={styles.studentText}>
                                        <p className={styles.studentInfoText}>({student.student_id}) {student.student_name}</p>
                                        <p className={styles.studentDepartment}>{student.department_name}</p>
                                    </div>
                                    <div className={styles.chagneAttendaceBox}>
                                        <button className={styles.changeAttendaceButton} onClick={ () => {
                                            openModal();
                                            console.log("모달 열려라 얍 : " + isOpen)}}>
                                            <p className={styles.changeAttendaceButtonText}>출석자 정보변경</p>
                                        </button >
                                        <Modal
                                            isOpen={isOpen}
                                            onRequestClose={closeModal}
                                            contentLabel="Example Modal"
                                            style={{
                                                overlay: {
                                                  backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 모달 배경 반투명 처리
                                                  zIndex: 1000,  // 다른 요소보다 위에 있도록 설정
                                                },
                                                content: {
                                                  top: '50%',
                                                  left: '50%',
                                                  right: 'auto',
                                                  bottom: 'auto',
                                                  marginRight: '-50%',
                                                  transform: 'translate(-50%, -50%)',  // 화면 중앙에 배치
                                                  width: '400px',  // 모달의 너비 설정
                                                  height: '200px',  // 모달의 높이 설정
                                                  borderRadius: '10px',  // 모달의 둥근 테두리 설정
                                                  padding: '20px',  // 내부 여백
                                                },
                                              }}
                                        >
                                            <h2>모달 제목</h2>
                                            <button onClick={closeModal}>닫기</button>
                                        </Modal>

                                    </div>
                                    <div className={styles.attendaceBox}>
                                        <div className={`${styles.attendaceCheckBox} 
                                                         ${student.attendance_Info === '출결' ? styles.present :
                                                student.attendance_Info === '결석' ? styles.absent :
                                                    student.attendance_Info === '지각' ? styles.late : ''}`}>
                                        </div>
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
