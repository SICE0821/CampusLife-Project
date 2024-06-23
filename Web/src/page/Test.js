import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Test.module.css';
import { BiQrScan } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

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
                        <div className={styles.classBox}>
                            <div className={styles.week}>
                                <div className={styles.weekBox}>
                                    <p className={styles.weekText}>1주차 (00월 00일)</p>
                                    <p className={styles.attendace}>출석: 0 지각: 0 결석: 0</p>
                                </div>
                                <div className={styles.classStudent}>
                                    <p className={styles.studentNum}>수강학생: 00</p>
                                    <p className={styles.attendaceCheck}>강의상태: 미출결</p>
                                </div>
                                <BiQrScan onClick={handleNavigateToQrCheck} size={80} className={styles.qr} />
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>1교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>2교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>3교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.classBox}>
                            <div className={styles.week}>
                                <div className={styles.weekBox}>
                                    <p className={styles.weekText}>1주차 (00월 00일)</p>
                                    <p className={styles.attendace}>출석: 0 지각: 0 결석: 0</p>
                                </div>
                                <div className={styles.classStudent}>
                                    <p className={styles.studentNum}>수강학생: 00</p>
                                    <p className={styles.attendaceCheck}>강의상태: 미출결</p>
                                </div>
                                <BiQrScan onClick={handleNavigateToQrCheck} size={80} className={styles.qr} />
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>1교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>2교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>3교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.classBox}>
                            <div className={styles.week}>
                                <div className={styles.weekBox}>
                                    <p className={styles.weekText}>1주차 (00월 00일)</p>
                                    <p className={styles.attendace}>출석: 0 지각: 0 결석: 0</p>
                                </div>
                                <div className={styles.classStudent}>
                                    <p className={styles.studentNum}>수강학생: 00</p>
                                    <p className={styles.attendaceCheck}>강의상태: 미출결</p>
                                </div>
                                <BiQrScan onClick={handleNavigateToQrCheck} size={80} className={styles.qr} />
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>1교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>2교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                            <div className={styles.detailClassBox}>
                                <div className={styles.detailClassText}>
                                    <p className={styles.classNum}>3교시</p>
                                    <p className={styles.classTime}>00월 00일  10:10 ~ 11:00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.student}>
                        <div className={styles.attendaceFind}>
                            <p className={styles.attendaceFindText}>출석자현황</p>
                            <FaSearch size={50} className={styles.search} />
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.studentInfoBox}>
                            <div className={styles.studentInfo}>
                                <div className={styles.studentText}>
                                    <p className={styles.studentInfoText}>(2033053) 최지태</p>
                                    <p className={styles.studentDepartment}>컴퓨터소프트웨어과</p>
                                </div>
                                <div className={styles.attendaceBox}>
                                    <div className={styles.attendaceCheckBox}>

                                    </div>
                                </div>
                            </div>
                        </div>
                        

                    </div>
                </div>
                <div className={styles.side}></div>
            </div>

        </div>
    );
}

export default Test;
