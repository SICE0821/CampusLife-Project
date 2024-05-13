import React, { useState } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import Icon from 'react-native-vector-icons/Entypo';
import { Table, Row, Rows } from "react-native-table-component";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

{ // 학점 정보 데이터 요기
    var circle1_data = 3.8; // 전체 평점 데이터
    var circle1_percent = (circle1_data / 4.5) * 100; // 전체 평점 퍼센트

    var circle2_data = 4.2; // 전공 평점 데이터
    var circle2_percent = (circle2_data / 4.5) * 100; // 전공 평점 퍼센트

    var circle3_data = 3.25; // 교양 평점 데이터
    var circle3_percent = (circle3_data / 4.5) * 100; // 교양 평점 퍼센트

    var circle4_data = 84; // 전체 학점 데이터
    var credit_max = 120; // 최대 학점 데이터
    var circle4_percent = (circle4_data / credit_max) * 100; // 전체 학점 퍼센트

    var circle5_data = 60; // 전공 학점 데이터
    var major_credit_max = 80; // 최대 전공 학점 데이터
    var circle5_percent = (circle5_data / major_credit_max) * 100; // 전공 평점 퍼센트

    var circle6_data = 24; // 교양 학점 데이터
    var culture_credit_max = 80; // 최대 교양 학점 데이터
    var circle6_percent = (circle6_data / culture_credit_max) * 100; // 교양 평점 퍼센트
}

{ // 학점 Circle 데이터
    var circleRadius = 60;
    var circleBorderWidth = 8;
    var circleColor = "#000000";
    var circlShadowColor = "#EEEEEE";
}

// 학점 등급별 갯수 데이터 요기
var datas = [1, 2, 3, 4, 5, 5, 3, 2, 1, 0,];


{ // 테이블 관련 설정
    var widthArrs = [240,70,70,70] // 테이블 간격
    var tableBorderWidth = 3 // 테이블 border 크기
    var tableBorderColor = 'gray' // 테이블 bordder 색
}

{ // 학년 학기별 과목명, 구분, 학점, 성적 요기
    var tableHead = ["과목명", "구분", "학점", "성적"];
    var credit_data_1_1 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_1_2 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_2_1 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_2_2 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_3_1 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_3_2 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_4_1 = [
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
        [ "Subject name", "Division", "Credit", "Grades" ],
    ]
    var credit_data_4_2 = [
    ]
}

const AcademicInfoScreen = () => {
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
        <View style={styles.container}>
            <ScrollView>
                {/* 학점 Circle 데이터 영역 */}
                <View style={styles.circleArea}>
                    {/* 학점 Circle 열 영역 */}
                    <View style={styles.circleRow}>
                        {/* 전체 평점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle1_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'전체 평점' + '\n'}
                                    {circle1_data + '/' + 4.5}
                                </Text>
                            </ProgressCircle>
                        </View>
                        {/* 전공 평점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle2_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'전공 평점' + '\n'}
                                    {circle2_data + '/' + 4.5}
                                </Text>
                            </ProgressCircle>
                        </View>
                        {/* 교양 평점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle3_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'교양 평점' + '\n'}
                                    {circle3_data + '/' + 4.5}
                                </Text>
                            </ProgressCircle>
                        </View>
                    </View>
                    {/* 학점 Circle 열 영역 */}
                    <View style={styles.circleRow}>
                        {/* 전체 학점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle4_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'전체 학점' + '\n'}
                                    {circle4_data + '/' + credit_max}
                                </Text>
                            </ProgressCircle>
                        </View>
                        {/* 전공 학점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle5_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'전공 학점' + '\n'}
                                    {circle5_data + '/' + major_credit_max}
                                </Text>
                            </ProgressCircle>
                        </View>
                        {/* 교양 학점 Circle */}
                        <View style={styles.circle}>
                            {/* Circle 설정 */}
                            <ProgressCircle
                                percent={circle6_percent}
                                radius={circleRadius}
                                borderWidth={circleBorderWidth}
                                color={circleColor}
                                shadowColor={circlShadowColor}
                                bgColor="#fff">
                                {/* Circle안의 텍스트 설정 */}
                                <Text style={styles.circleText}>
                                    {'교양 학점' + '\n'}
                                    {circle6_data + '/' + culture_credit_max}
                                </Text>
                            </ProgressCircle>
                        </View>
                    </View>
                </View>
                {/* Bar Chart */}
                <View style={styles.area}>
                    <BarChart
                        data={{
                            labels: ["A", "A0", "A-", "B+", "B0", "B-", "C+", "C0", "C-", "F"],
                            datasets: [
                                {
                                    data: datas
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        showValuesOnTopOfBars={true}
                        withHorizontalLabels={true}
                        chartConfig={{
                            
                            backgroundColor: "#D3D3D3",
                            backgroundGradientFrom: "#D3D3D3",
                            backgroundGradientTo: "#D3D3D3",
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                
                            },
                            propsForDots: {},
                        }}
                        style={{
                            
                        }}
                    />
                </View>


                {/* 학기별 상세 성적 확인용 영역 */}
                <View style={styles.detail_credit_box}>
                    <Text style={styles.semester_text}>1학년 1학기</Text>
                    <TouchableOpacity onPress={toggleDetailCreditAreaVisibility11}>
                        <Icon name={detailCreditAreaVisible11 ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                    </TouchableOpacity>
                </View>
                {/* 학기 상세 성적 확인 */}
                {!detailCreditAreaVisible11 && (
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                    <View style={styles.detail_credit_area}>
                        <View style={styles.table}>
                            <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: "tableBorderColor" }}>
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
                )}


                <View style={styles.bottom_area}>
                    {/* 바텀 탭 때문에 공간 만들려고 만들었다. */}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { // 전체 뷰
        flex: 1,
        backgroundColor: 'white',
    },
    circleArea: { // 학점 정보 circle 영역
        marginTop: 10,
        width: '90%',
        height: 300,
        borderTopWidth: 2,
        borderBottomWidth: 2,
        alignSelf: 'center',
    },
    circleRow: { // 학점 정보 열 영역
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 18
    },
    circle: { // 학점 정보 Circle
        marginHorizontal: 18
    },
    circleText: { // Circle 텍스트
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    area: { // 직선 그래프 영역
        marginTop: 15,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    detail_credit_box: { // 학기별 상세 성적 박스 영역
        backgroundColor: '#999999',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1
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
        //backgroundColor: 'red',
        width: '100%',
    },
    table: { // 테이블
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        alignSelf: 'center',
    },
    tableRows:{ // 테이블 열
        height: 50
    },

    bottom_area: { // 바닥 잉여 영역
        //backgroundColor: 'gray',
        height:100
    }
});

export default AcademicInfoScreen;
