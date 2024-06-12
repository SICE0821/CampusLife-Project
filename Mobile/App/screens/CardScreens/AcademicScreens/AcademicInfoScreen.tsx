import React, { useState, useEffect } from 'react';
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
import { UserData, Lecture } from '../../../types/type';

const width = Dimensions.get("window").width;

const AcademicInfoScreen = ({route} : any) => {
    const { userdata, LectureData } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userLecture, setUserLecture] = useState<Lecture[]>(LectureData);
    const [visibleSemesters, setVisibleSemesters] = useState<number[]>([]);

    const [circle1Data, setCircle1Data] = useState(0);
    const [circle2Data, setCircle2Data] = useState(0);
    const [circle3Data, setCircle3Data] = useState(0);
    const [circle4Data, setCircle4Data] = useState(0);
    const [circle5Data, setCircle5Data] = useState(0);
    const [circle6Data, setCircle6Data] = useState(0);

    // 성적 데이터 초기화
    let datas = [0, 0, 0, 0, 0, 0, 0, 0, 0]; // A+부터 F까지의 갯수를 담을 배열

    // userLecture 배열을 순회하면서 성적을 확인하고 datas 배열 업데이트
    userLecture.forEach(lecture => {
        // 성적에 따라 datas 배열 업데이트
        switch (lecture.lecture_grades) {
            case 'A+':
                datas[0]++;
                break;
            case 'A':
                datas[1]++;
                break;
            case 'B+':
                datas[2]++;
                break;
            case 'B':
                datas[3]++;
                break;
            case 'C+':
                datas[4]++;
                break;
            case 'C':
                datas[5]++;
                break;
            case 'D+':
                datas[6]++;
                break;
            case 'D':
                datas[7]++;
                break;
            case 'F':
                datas[8]++;
                break;
            default:
                break;
        }
    });

    useEffect(() => {
        const totalCredits = userLecture.reduce((sum, lecture) => sum + lecture.lecture_credit, 0);
        const averageCredits = parseFloat((totalCredits / userLecture.length).toFixed(2));

        const majorCredits = userLecture.filter(lecture => lecture.division === '전공').reduce((sum, lecture) => sum + lecture.lecture_credit, 0);
        const majorCount = userLecture.filter(lecture => lecture.division === '전공').length;
        const majorAverageCredits = parseFloat((majorCredits / majorCount).toFixed(2));

        const cultureCredits = userLecture.filter(lecture => lecture.division === '교양').reduce((sum, lecture) => sum + lecture.lecture_credit, 0);
        const cultureCount = userLecture.filter(lecture => lecture.division === '교양').length;
        const cultureAverageCredits = parseFloat((cultureCredits / cultureCount).toFixed(2));
        
        const totalCredits2 = userLecture.reduce((sum, lecture) => sum + lecture.credit, 0);
        const majorCredits2 = userLecture.filter(lecture => lecture.division === '전공').reduce((sum, lecture) => sum + lecture.credit, 0);
        const cultureCredits2 = userLecture.filter(lecture => lecture.division === '교양').reduce((sum, lecture) => sum + lecture.credit, 0);

        setCircle1Data(averageCredits);
        setCircle2Data(majorAverageCredits);
        setCircle3Data(cultureAverageCredits);
        setCircle4Data(totalCredits2);
        setCircle5Data(majorCredits2);
        setCircle6Data(cultureCredits2);
    }, [userLecture]);

    // "#00BFFF"  

    const circleRadius = 50;
    const circleBorderWidth = 10;
    const circleColor = "#FFC81E";
    const circlShadowColor = "#EEEEEE";

    const creditMax = 120; // 최대 학점 데이터
    const majorCreditMax = 80; // 최대 전공 학점 데이터
    const cultureCreditMax = 20; // 최대 교양 학점 데이터

    const circle1_percent = (circle1Data / 4.5) * 100;
    const circle2_percent = (circle2Data / 4.5) * 100;
    const circle3_percent = (circle3Data / 4.5) * 100;
    const circle4_percent = (circle4Data / creditMax) * 100;
    const circle5_percent = (circle5Data / majorCreditMax) * 100;
    const circle6_percent = (circle6Data / cultureCreditMax) * 100;

    
    useEffect(() => {
        const semesters: number[] = [];
        for (let year = 1; year <= userData.college; year++) {
            const maxSemester = year === userData.college ? 2 : 2; // 만약 학년이 현재 학년이면 userData.student_semester까지, 아니면 2학기까지만 보이도록 조절
            for (let semester = 1; semester <= maxSemester; semester++) {
                semesters.push((year - 1) * 2 + semester); // 학년과 학기를 조합하여 배열에 추가
            }
        }
        setVisibleSemesters(semesters);
    }, [userData.college, userData.student_semester]);

    const semesterLabels: Record<number, string> = {
        1: '1학년 1학기',
        2: '1학년 2학기',
        3: '2학년 1학기',
        4: '2학년 2학기',
        5: '3학년 1학기',
        6: '3학년 2학기',
        7: '4학년 1학기',
        8: '4학년 2학기',
    };

    const semesterData: Record<number, Lecture[]> = {
        1: userLecture.filter(lecture => lecture.lecture_grade === 1 && lecture.lecture_semester === 1),
        2: userLecture.filter(lecture => lecture.lecture_grade === 1 && lecture.lecture_semester === 2),
        3: userLecture.filter(lecture => lecture.lecture_grade === 2 && lecture.lecture_semester === 1),
        4: userLecture.filter(lecture => lecture.lecture_grade === 2 && lecture.lecture_semester === 2),
        5: userLecture.filter(lecture => lecture.lecture_grade === 3 && lecture.lecture_semester === 1),
        6: userLecture.filter(lecture => lecture.lecture_grade === 3 && lecture.lecture_semester === 2),
        7: userLecture.filter(lecture => lecture.lecture_grade === 4 && lecture.lecture_semester === 1),
        8: userLecture.filter(lecture => lecture.lecture_grade === 4 && lecture.lecture_semester === 2),
    };
    
    const [detailCreditAreaVisible, setDetailCreditAreaVisible] = useState<Record<number, boolean>>({
        1: true,
        2: true,
        3: true,
        4: true,
        5: true,
        6: true,
        7: true,
        8: true,
    });

    const toggleDetailCreditAreaVisibility = (semesterKey: number) => {
        setDetailCreditAreaVisible({
            ...detailCreditAreaVisible,
            [semesterKey]: !detailCreditAreaVisible[semesterKey],
        });
    };

    const tableHead = ["과목명", "구분", "학점", "성적"];
    const widthArrs = [ width*0.65, width*0.1, width*0.1, width*0.1,]; // 테이블 간격
    const tableBorderWidth = 3; // 테이블 border 크기
    const tableBorderColor = 'gray'; // 테이블 bordder 색

    return (
        <View style={styles.container}>
            <View style={{borderBottomWidth: 2, marginTop: 5, borderColor: "black"}}></View>
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
                                    {circle1Data + '/' + 4.5}
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
                                    {circle2Data + '/' + 4.5}
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
                                    {circle3Data + '/' + 4.5}
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
                                    {circle4Data + '/' + creditMax}
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
                                    {circle5Data + '/' + majorCreditMax}
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
                                    {circle6Data + '/' + cultureCreditMax}
                                </Text>
                            </ProgressCircle>
                        </View>
                    </View>
                </View>
                {/* Bar Chart */}
                <View style={styles.area}>
                    <BarChart
                        data={{
                            labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
                            datasets: [
                                {
                                    data: datas
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width*1.18} // from react-native
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={1} // optional, defaults to 1
                        showValuesOnTopOfBars={true}
                        withHorizontalLabels={true}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#fff",
                            backgroundGradientTo: "#fff",
                            decimalPlaces: 0, // optional, defaults to 2dp
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                
                            },
                            propsForDots: {},
                        }}
                        style={{
                            left: -35,
                            borderWidth: 1,
                            borderColor: 'black'
                        }}
                    />
                </View>


                {/* 학기별 상세 성적 확인용 영역 */}
                {visibleSemesters.map((semesterKey) => {
                    const semesterLabel = semesterLabels[semesterKey];
                    const lectures = semesterData[semesterKey];
                    
                    return (
                        <View key={semesterKey}>
                            <View style={styles.detail_credit_box}>
                                <Text style={styles.semester_text}>{semesterLabel}</Text>
                                <TouchableOpacity onPress={() => toggleDetailCreditAreaVisibility(semesterKey)}>
                                    <Icon name={detailCreditAreaVisible[semesterKey] ? "chevron-down" : "chevron-up"} style={styles.semester_button} />
                                </TouchableOpacity>
                            </View>
                            {!detailCreditAreaVisible[semesterKey] && (
                                <View style={styles.detail_credit_area}>
                                    <View style={styles.table}>
                                        <Table borderStyle={{ borderWidth: tableBorderWidth, borderColor: tableBorderColor }}>
                                            <Row
                                                data={tableHead}
                                                style={{ height: 30, backgroundColor: "#dddddd" }}
                                                textStyle={{ textAlign: "center", fontWeight: "bold", color: 'gray' }}
                                                widthArr={widthArrs}
                                            />
                                            {lectures.map((lecture, index) => (
                                                <Row 
                                                    key={index}
                                                    data={[lecture.lecture_name, lecture.division, lecture.lecture_credit, lecture.lecture_grades]}  
                                                    style={styles.tableRows} 
                                                    textStyle={{ textAlign: "center", fontWeight: 'bold', color: 'black' }}
                                                    widthArr={widthArrs}
                                                />
                                            ))}
                                        </Table>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}
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
        alignSelf: 'center',
    },
    circleRow: { // 학점 정보 열 영역
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10
    },
    circle: { // 학점 정보 Circle
        marginHorizontal: 18
    },
    circleText: { // Circle 텍스트
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black'
    },
    area: { // 직선 그래프 영역
        marginTop: 15,
        marginBottom: 15,
        width: '100%',
        alignItems: 'center',
    },
    detail_credit_box: { // 학기별 상세 성적 박스 영역
        backgroundColor: '#FFEFD5',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1
    },
    semester_text: { // 박스 내 텍스트
        fontSize: 28,
        marginLeft: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    semester_button: { // 박스 내 버튼
        fontSize: 50,
        marginRight: 15,
        color: 'black'
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