import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import { BiQrScan } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { useLocation } from 'react-router-dom';
import config from './config'
import Modal from 'react-modal';
import Select from 'react-select';

Modal.setAppElement('#root'); // 접근성을 위해 필요합니다.

const options = [
    { value: 'all', label: '전체' },
    { value: 'attendance', label: '출석' },
    { value: 'absent', label: '결석' },
    { value: 'late', label: '지각' }
];

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
    console.log(selectLecture); //이게 선택한 과목 정보
    const [selected, setSelected] = useState({ weekIndex: 0, classIndex: 0 }); //주차와 교시(차시)를 선택할때 사용하는 데이터
    const [totalStudentNum, setTotalStudentNum] = useState();
    const [studentAttendanceStates, setStudentAttendanceStates] = useState([]);
    const [totalStudentInfo, setTotalStudentInfo] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(options[0]); //리스트 박스 값 저장
    const [inputValue, setInputValue] = useState(''); //학생 이름 찾는 Text

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    // 리스트 박스 핸들러
    const handleChange = (option) => {
        setSelectedOption(option);
        console.log("Selected option:", option);
    }

    // 학생 이름 찾을 때 사용되는 함수
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

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
            console.log(StudentAttendanceStates);
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
                                            console.log(`${weekIndex}주차 ${classIndex}번 누름`);
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
                            <input
                                type="text"               
                                value={inputValue}         
                                onChange={handleInputChange} 
                                placeholder="찾으시는 학생 이름을 입력해주세요" 
                                style={{ width: '330px' }}  
                            />
                            <button className={styles.searchButton}>찾기</button>
                            <FaSearch size={50} className={styles.search} />
                        </div>
                        <Select
                            value={selectedOption}  
                            onChange={handleChange}  
                            options={options}  
                        />
                        {(studentAttendanceStates.length > 0 ? studentAttendanceStates : totalStudentInfo).map((student, index) => (
                            <div key={index} className={styles.studentInfoBox}>
                                <div className={styles.studentInfo}>
                                    <div className={styles.studentText}>
                                        <p className={styles.studentInfoText}>({student.student_id}) {student.student_name}</p>
                                        <p className={styles.studentDepartment}>{student.department_name}</p>
                                    </div>
                                    <div className={styles.chagneAttendaceBox}>
                                        <button className={styles.changeAttendaceButton} onClick={() => {
                                            openModal();
                                            console.log("모달 열려라 얍 : " + isOpen)
                                        }}>
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
                                                    transform: 'translate(-50%, -50%)',  
                                                    width: '220px',  
                                                    height: '260px',  
                                                    borderRadius: '10px',  
                                                    padding: '10px',  
                                                },
                                            }}
                                        >
                                            <div className={styles.modalheaderBox}>
                                                <p className={styles.modalheaderText}>출석정보변경</p>
                                                <button className={styles.ModalCancleButton} onClick={closeModal}>닫기</button>
                                            </div>
                                            <div className={styles.modalbuttonBox}>
                                                <button className={styles.ModalButton} onClick={closeModal}>출결 처리</button>
                                            </div>
                                            <div className={styles.modalbuttonBox}>
                                                <button className={styles.ModalButton} onClick={closeModal}>결석 처리</button>
                                            </div>
                                            <div className={styles.modalbuttonBox}>
                                                <button className={styles.ModalButton} onClick={closeModal}>지각 처리</button>
                                            </div>
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
