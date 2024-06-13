import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ProgressCircle from 'react-native-progress-circle';
import { Table, Row } from "react-native-table-component";
import { BarChart } from "react-native-chart-kit";
import { UserData, Lecture } from '../../../types/type';

const { width } = Dimensions.get("window");

const AcademicInfoScreen = ({ route }: any) => {
    const { userdata, LectureData } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userLecture, setUserLecture] = useState<Lecture[]>(LectureData);
    const [selectedYear, setSelectedYear] = useState<number>(1);
    const [selectedSemester, setSelectedSemester] = useState<number>(1);

    const [circleData, setCircleData] = useState({
        circle1Data: 0,
        circle2Data: 0,
        circle3Data: 0,
        circle4Data: 0,
        circle5Data: 0,
        circle6Data: 0,
    });

    const gradesData = Array(9).fill(0); // A+부터 F까지의 갯수를 담을 배열

    userLecture.forEach(lecture => {
        const gradeIndex = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].indexOf(lecture.lecture_grades);
        if (gradeIndex !== -1) gradesData[gradeIndex]++;
    });

    useEffect(() => {
        const totalCredits = userLecture.reduce((sum, lecture) => sum + lecture.lecture_credit, 0);
        const averageCredits = parseFloat((totalCredits / userLecture.length).toFixed(2));

        const majorLectures = userLecture.filter(lecture => lecture.division === '전공');
        const cultureLectures = userLecture.filter(lecture => lecture.division === '교양');

        const majorCredits = majorLectures.reduce((sum, lecture) => sum + lecture.lecture_credit, 0);
        const cultureCredits = cultureLectures.reduce((sum, lecture) => sum + lecture.lecture_credit, 0);

        const majorAverageCredits = parseFloat((majorCredits / majorLectures.length).toFixed(2));
        const cultureAverageCredits = parseFloat((cultureCredits / cultureLectures.length).toFixed(2));

        const totalCredits2 = userLecture.reduce((sum, lecture) => sum + lecture.credit, 0);
        const majorCredits2 = majorLectures.reduce((sum, lecture) => sum + lecture.credit, 0);
        const cultureCredits2 = cultureLectures.reduce((sum, lecture) => sum + lecture.credit, 0);

        setCircleData({
            circle1Data: averageCredits,
            circle2Data: majorAverageCredits,
            circle3Data: cultureAverageCredits,
            circle4Data: totalCredits2,
            circle5Data: majorCredits2,
            circle6Data: cultureCredits2,
        });
    }, [userLecture]);

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

    const circleConfigs = [
        { label: '전체 평점', value: circleData.circle1Data, maxValue: 4.5 },
        { label: '전공 평점', value: circleData.circle2Data, maxValue: 4.5 },
        { label: '교양 평점', value: circleData.circle3Data, maxValue: 4.5 },
        { label: '전체 학점', value: circleData.circle4Data, maxValue: 120 },
        { label: '전공 학점', value: circleData.circle5Data, maxValue: 80 },
        { label: '교양 학점', value: circleData.circle6Data, maxValue: 20 },
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.circleArea}>
                    {[...Array(Math.ceil(circleConfigs.length / 3))].map((_, rowIndex) => (
                        <View style={styles.circleRow} key={rowIndex}>
                            {circleConfigs.slice(rowIndex * 3, (rowIndex + 1) * 3).map((config, index) => (
                                <View style={styles.circle} key={index}>
                                    <ProgressCircle
                                        percent={(config.value / config.maxValue) * 100}
                                        radius={50}
                                        borderWidth={10}
                                        color="#FFC81E"
                                        shadowColor="#EEEEEE"
                                        bgColor="#fff">
                                        <Text style={styles.circleText}>
                                            {`${config.label}\n${config.value.toFixed(2)}/${config.maxValue}`}
                                        </Text>
                                    </ProgressCircle>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                <ScrollView style={styles.chartArea} horizontal={true}>
                    <BarChart
                        data={{
                            labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
                            datasets: [{ data: gradesData }],
                        }}
                        
                        width={width*1.2}
                        height={220}
                        yAxisLabel=''
                        yAxisSuffix=''
                        
                        showValuesOnTopOfBars={true}
                        withHorizontalLabels={true}
                        chartConfig={{
                            backgroundColor: "#fff",
                            backgroundGradientFrom: "#eee",
                            backgroundGradientTo: "#eee",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        }}
                        style={styles.chart}
                    />
                </ScrollView>
                <View style={styles.pickerArea}>
                    <Picker
                        selectedValue={selectedYear}
                        style={styles.picker}
                        dropdownIconColor={'black'}
                        onValueChange={(itemValue: React.SetStateAction<number>) => setSelectedYear(itemValue)}
                    >
                        {[...Array(userData.college)].map((_, index) => (
                            <Picker.Item key={index} label={`${index + 1}학년`} value={index + 1} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={selectedSemester}
                        style={styles.picker}
                        dropdownIconColor={'black'}
                        onValueChange={(itemValue: React.SetStateAction<number>) => setSelectedSemester(itemValue)}
                    >
                        {[1, 2].map((semester, index) => (
                            <Picker.Item key={index} label={`${semester}학기`} value={semester - 1} />
                        ))}
                    </Picker>
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
    circleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    circle: {
        flex: 1,
        alignItems: 'center',
    },
    circleText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    chartArea: {
        marginBottom: 15,
        borderWidth: 1,
    },
    chart: {
        overflow: 'visible',
        borderColor: 'black',
    },
    pickerArea:{
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    picker:{
        width: width*0.45,
        backgroundColor: '#dddddd',
        marginHorizontal: 5,
        color: 'black',
        elevation: 5,
        shadowColor: 'black',
    },
    detailCreditArea: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15
    },
    tableHeader: {
        height: 30,
        backgroundColor: "#dddddd",
    },
    tableHeaderText: {
        textAlign: "center",
        fontWeight: "bold",
        color: 'gray',
    },
    tableRow: {
        height: 50,
    },
    tableText: {
        textAlign: "center",
        fontWeight: 'bold',
        color: 'black',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: 'gray',
    },
});

export default AcademicInfoScreen;
