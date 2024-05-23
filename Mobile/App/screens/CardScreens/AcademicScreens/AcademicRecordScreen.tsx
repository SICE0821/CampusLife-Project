import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Table, Row, Rows } from "react-native-table-component";

{
    var boxColor = '#999999'
}

{ // 테이블 관련 설정
    var widthArrs = [ 200, 60, 70, 60, 80, 70 ] // 테이블 간격
    var tableBorderWidth = 2 // 테이블 border 크기
    var tableBorderColor = 'black' // 테이블 bordder 색
}

{ // 학년 학기별 과목명, 구분, 학점, 성적 요기
    var tableHead = [ "과목명", "구분", "담당교수", "학점", "수업시간", "온라인유무" ];
    var credit_data_1_1 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_1_2 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_2_1 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_2_2 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_3_1 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_3_2 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_4_1 = [
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "비대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
        [ "Subject name", "Division", "professor", "Grades", "lectureTime", "대면" ],
    ]
    var credit_data_4_2 = [
    ]
}

const AcademicRecord = () => {
    // 1학년 1학기
    const [detailCreditAreaVisible11, setDetailCreditAreaVisible11] = useState(true);
    const toggleDetailCreditAreaVisibility11 = () => {
        setDetailCreditAreaVisible11(!detailCreditAreaVisible11);
    };
    // 1학년 2학기
    const [detailCreditAreaVisible12, setDetailCreditAreaVisible12] = useState(true);
    const toggleDetailCreditAreaVisibility12 = () => {
        setDetailCreditAreaVisible12(!detailCreditAreaVisible12);
    };
    // 2학년 1학기
    const [detailCreditAreaVisible21, setDetailCreditAreaVisible21] = useState(true);
    const toggleDetailCreditAreaVisibility21 = () => {
        setDetailCreditAreaVisible21(!detailCreditAreaVisible21);
    };
    // 2학년 2학기
    const [detailCreditAreaVisible22, setDetailCreditAreaVisible22] = useState(true);
    const toggleDetailCreditAreaVisibility22 = () => {
        setDetailCreditAreaVisible22(!detailCreditAreaVisible22);
    };
    // 3학년 1학기
    const [detailCreditAreaVisible31, setDetailCreditAreaVisible31] = useState(true);
    const toggleDetailCreditAreaVisibility31 = () => {
        setDetailCreditAreaVisible31(!detailCreditAreaVisible31);
    };
    // 3학년 2학기
    const [detailCreditAreaVisible32, setDetailCreditAreaVisible32] = useState(true);
    const toggleDetailCreditAreaVisibility32 = () => {
        setDetailCreditAreaVisible32(!detailCreditAreaVisible32);
    };

    return (
        <View style = {styles.container}>
            <ScrollView>
                <View style = {styles.area}>
                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>1학년 1학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility11}>
                            <Icon name={detailCreditAreaVisible11 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible11 && (
                        <ScrollView horizontal={true} alwaysBounceHorizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_1_1}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>1학년 2학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility12}>
                            <Icon name={detailCreditAreaVisible12 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible12 && (
                        <ScrollView horizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_1_2}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>2학년 1학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility21}>
                            <Icon name={detailCreditAreaVisible21 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible21 && (
                        <ScrollView horizontal={true} alwaysBounceHorizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_2_1}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>2학년 2학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility22}>
                            <Icon name={detailCreditAreaVisible22 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible22 && (
                        <ScrollView horizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_2_2}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>3학년 1학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility31}>
                            <Icon name={detailCreditAreaVisible31 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible31 && (
                        <ScrollView horizontal={true} alwaysBounceHorizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_3_1}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}

                    {/* 학기별 상세 성적 확인용 영역 */}
                    <View style={styles.detail_credit_box}>
                        <Text style={styles.semester_text}>3학년 2학기</Text>
                        <TouchableOpacity onPress={toggleDetailCreditAreaVisibility32}>
                            <Icon name={detailCreditAreaVisible32 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                        </TouchableOpacity>
                    </View>
                    {/* 학기 상세 성적 확인 */}
                    {!detailCreditAreaVisible32 && (
                        <ScrollView horizontal={true} >
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                        <Row
                                            data={tableHead}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                            widthArr={widthArrs}
                                        />
                                        <Rows 
                                            data={credit_data_3_2}  
                                            style={styles.tableRows} 
                                            textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                            widthArr={widthArrs}
                                            />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                    
                </View>
            </ScrollView>
        </View>

    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
    },
    area: {
        marginTop: 20
    },
    detail_credit_box: { // 학기별 상세 성적 박스 영역
        backgroundColor: boxColor,
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        marginTop: 20,
    },
    semester_text: { // 박스 내 텍스트
        fontSize: 32,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    semester_button: { // 박스 내 버튼
        fontSize: 50,
        marginRight: 15
    },
    detail_credit_area: { // 상세 성적 테이블 영역

    },
    table: { // 테이블
        margin: 10,
    },
    tableRows:{ // 테이블 열
        height: 50
    },
    }
)

export default AcademicRecord;
