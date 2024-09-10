import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ProgressCircle from 'react-native-progress-circle';
import { Table, Row } from "react-native-table-component";
import { BarChart } from "react-native-chart-kit";
import { UserData, Lecture } from '../../../types/type';
import LottieView from 'lottie-react-native';
import IconH from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const HorizontalBarGraph = () => {
    const goalGPA = 4.5;
    const currentGPA = 1;

    const goalPercentage = (goalGPA / 4.5) * 100;
    const currentPercentage = (currentGPA / 4.5) * 100;

    const adjustedPercentage = -10 + (currentPercentage * 0.9);
    return (
        <View style={styles.TargetGradeArea}>
            <LottieView
                source={require('../../../assets/Animation - 1725893333150.json')}
                autoPlay
                onAnimationFinish={() => console.log('애니메이션이 완료되었습니다')}
                loop
                style={[styles.animation, { left: `${adjustedPercentage}%` }]}
            />
            <View style={styles.graphArea}>
                <View style={styles.graphContainer}>
                    <View style={[styles.bar, { width: `${currentPercentage}%`, backgroundColor: '#2196f3' }]}>
                        <Text style={styles.barText}>현재 학점: {currentGPA}</Text>
                    </View>
                </View>
                <View style={styles.graphContainer}>
                    <View style={[styles.bar, { width: `${goalPercentage}%`, backgroundColor: '#4caf50' }]}>
                        <Text style={styles.barText}>목표 학점: {goalGPA}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

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
                <View style={styles.BadgeTextArea}>
                    <Text style={styles.BadgeTextFont}>달성기록</Text>
                    <IconH style={styles.BadgeIcon} name="trophy" size={30} />
                </View>
                <ScrollView horizontal={true} style={styles.BadgeArea}>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>우등상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지2.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>수강상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지3.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>성장상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지4.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>노력상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지5.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>출석상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지6.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>소통상</Text>
                    </View>
                    <View style={styles.OneBadgeArea}>
                        <Image
                            source={require('../../../assets/뱃지7.png')}
                            resizeMode="contain"
                            style={{ width: '65%', height: '65%' }}
                        />
                        <Text style={{ color: 'black' }}>최고상</Text>
                    </View>
                </ScrollView>
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
                                            {`${config.label}\n${config.value.toFixed(config.label.includes('학점') ? 0 : 2)}/${config.maxValue}`}
                                        </Text>
                                    </ProgressCircle>
                                </View>
                            ))}
                        </View>
                    ))}
                    <View style={styles.BadgeTextArea2}>
                        <Text style={styles.BadgeTextFont}>목표학점</Text>
                        <IconH style={styles.BadgeIcon} name="trophy" size={30} />
                    </View>

                    <HorizontalBarGraph />
                </View>

                <ScrollView style={styles.chartArea} horizontal={true}>
                    <BarChart
                        data={{
                            labels: ["A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"],
                            datasets: [{ data: gradesData }],
                        }}

                        width={width * 1.2}
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



                {semesterData[selectedYear * 2 - 1 + selectedSemester].length > 0 ? (
                    <View style={styles.detailCreditArea}>
                        <Table borderStyle={{ borderWidth: 3, borderColor: 'gray' }}>
                            <Row data={["과목명", "구분", "학점", "성적"]} style={styles.tableHeader} textStyle={styles.tableHeaderText} widthArr={[width * 0.65, width * 0.1, width * 0.1, width * 0.1]} />
                            {semesterData[selectedYear * 2 - 1 + selectedSemester].map((lecture, index) => (
                                <Row key={index} data={[lecture.lecture_name, lecture.division, lecture.lecture_credit, lecture.lecture_grades]} style={styles.tableRow} textStyle={styles.tableText} widthArr={[width * 0.65, width * 0.1, width * 0.1, width * 0.1]} />
                            ))}
                        </Table>
                    </View>
                ) : (
                    <Text style={styles.noDataText}>데이터가 없습니다.</Text>
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    circleArea: {
        marginTop: 50,
        width: '90%',
        alignSelf: 'center',
        //backgroundColor: 'red'
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
        height: height - 550,
        marginBottom: 15,
        borderWidth: 1,
    },
    chart: {
        overflow: 'visible',
        borderColor: 'black',
    },
    pickerArea: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10
    },
    picker: {
        width: width * 0.45,
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
    BadgeArea: {
        height: '10%',
        padding: 10,
        borderBottomWidth: 1
    },
    OneBadgeArea: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width - 410,
        //backgroundColor: 'blue'
    },
    BadgeTextFont: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500'
    },
    BadgeIcon: {
        marginLeft: 10,
        color: '#F29F05'
    },
    BadgeTextArea: {
        height: "4%",
        width: '30%',
        marginTop: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 24,
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#F29F05'
        //backgroundColor: 'blue'
    },

    BadgeTextArea2: {
        height: "10%",
        width: '33%',
        marginLeft : 2,
        marginTop: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#F29F05'
        //backgroundColor: 'blue'
    },
    TargetGradeArea: {
        height: height - 800,
        //backgroundColor: 'blue'
    },
    animation: {
        width: 150,
        height: 150,
        //backgroundColor: 'red',
        //position: 'relative', // 상대적인 위치 설정
        //zIndex: 1, // 기본적으로 낮은 zIndex 설정
    },
    label: {
        color: 'white',
        fontWeight: 'bold',
    },
    graphContainer: {
        height: 30,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        marginBottom: 20,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    bar: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        flexDirection: 'row'
    },
    barText: {
        color: 'white',
        fontWeight: 'bold',
    },
    graphArea: {
        flex: 1,
        bottom: 20
    }
});

export default AcademicInfoScreen;
