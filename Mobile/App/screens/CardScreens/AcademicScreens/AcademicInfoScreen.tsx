import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Animated,
    Easing,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Table, Row } from 'react-native-table-component';
import { UserData, Lecture } from '../../../types/type';
import LottieView from 'lottie-react-native';
import IconH from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../../config';
import Svg, { Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// AnimatedCircle 생성
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type HorizontalBarGraphProps = {
    currentGPA: number;
    goalGPA: number;
};

// 전체 학점 평균과 목표 학점을 받아 가로 막대 그래프를 그리는 컴포넌트
const HorizontalBarGraph = ({ currentGPA, goalGPA }: HorizontalBarGraphProps) => {
    const [graphWidth, setGraphWidth] = useState(0); // 그래프의 실제 너비를 저장하는 상태
    const animationWidth = 150; // 애니메이션의 너비

    const goalPercentage = (goalGPA / 4.5) * 100; // 목표 학점을 백분율로 변환
    const currentPercentage = (currentGPA / 4.5) * 100; // 현재 학점을 백분율로 변환

    // 애니메이션의 위치를 계산
    const adjustedPosition = graphWidth ? (currentPercentage / 100) * graphWidth - animationWidth / 2 : 0;

    // 애니메이션 시작을 위한 상태 및 useEffect
    const [animationStarted, setAnimationStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStarted(true);
        }, 0); // 0.5초 후에 애니메이션 시작
        return () => clearTimeout(timer);
    }, []);

    return (
        <View
            style={styles.horizontalBarGraphContainer}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setGraphWidth(width); // 그래프의 실제 너비를 저장
            }}
        >
            {/* 현재 학점 그래프 */}
            <View style={styles.graphContainer}>
                {/* 애니메이션을 현재 학점 바의 자식으로 이동 */}
                {animationStarted && (
                    <LottieView
                        source={require('../../../assets/Animation - 1725893333150.json')}
                        autoPlay
                        loop
                        style={[
                            styles.lottieAnimation,
                            {
                                left: adjustedPosition,
                                bottom: 0,
                            },
                        ]}
                    />
                )}
                <View style={styles.graphBarBackground}>
                    <View
                        style={[
                            styles.graphBarFill,
                            { width: `${currentPercentage}%`, backgroundColor: '#2196f3' },
                        ]}
                    />
                    <Text style={styles.graphBarText}>현재 학점: {currentGPA.toFixed(2)}</Text>
                </View>
            </View>
            {/* 목표 학점 그래프 */}
            <View style={styles.graphContainer}>
                <View style={styles.graphBarBackground}>
                    <View
                        style={[
                            styles.graphBarFill,
                            { width: `${goalPercentage}%`, backgroundColor: '#4caf50' },
                        ]}
                    />
                    <Text style={styles.graphBarText}>목표 학점: {goalGPA.toFixed(2)}</Text>
                </View>
            </View>
        </View>
    );
};

// 커스텀 프로그레스 서클 컴포넌트
const AnimatedCircularProgress = ({ percent, label, value, maxValue }: any) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const timer = setTimeout(() => {
            animatedValue.setValue(0); // 애니메이션 초기화
            Animated.timing(animatedValue, {
                toValue: percent,
                duration: 2000, // 애니메이션 지속 시간 늘리기
                easing: Easing.out(Easing.exp), // 이징 함수 적용
                useNativeDriver: false,
            }).start();
        }, 1000); // 2초 후에 애니메이션 시작

        return () => clearTimeout(timer);
    }, [percent]);

    const circumference = 100 * Math.PI;
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0],
    });

    return (
        <View style={styles.progressCircleItem}>
            <Svg width={120} height={120}>
                <Circle
                    stroke="#EEEEEE"
                    fill="none"
                    cx={60}
                    cy={60}
                    r={50}
                    strokeWidth={10}
                />
                <AnimatedCircle
                    stroke="#FFC81E"
                    fill="none"
                    cx={60}
                    cy={60}
                    r={50}
                    strokeWidth={10}
                    strokeDasharray={`${circumference}, ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={styles.progressCircleTextContainer}>
                <Text style={styles.progressCircleText}>
                    {`${label}\n${value.toFixed(label.includes('학점') ? 0 : 2)}/${maxValue}`}
                </Text>
            </View>
        </View>
    );
};

const AcademicInfoScreen = ({ route }: any) => {
    const { userdata, LectureData } = route.params;
    const [userData] = useState<UserData>(userdata); // 사용자 데이터 상태
    const [userLecture] = useState<Lecture[]>(LectureData); // 강의 데이터 상태
    const [selectedYear, setSelectedYear] = useState<number>(1); // 선택된 학년
    const [selectedSemester, setSelectedSemester] = useState<number>(0); // 선택된 학기 (0: 1학기, 1: 2학기)
    const [goalGPA, setGoalGPA] = useState<number>(1); // 목표 학점

    // 목표 학점을 서버에서 가져오는 함수
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await getGoalGPA();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, [])
    );

    const getGoalGPA = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_GoalGPA`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.user_pk,
                }),
            });
            const result = await response.json();
            setGoalGPA(result.goal_gpa); // 목표 학점 설정
        } catch (error) {
            console.error(error);
        }
    };

    // GPA 및 학점 데이터를 저장하는 상태
    const [gpaData, setGpaData] = useState({
        overallGPA: 0,
        majorGPA: 0,
        electiveGPA: 0,
        totalCredits: 0,
        majorCredits: 0,
        electiveCredits: 0,
    });

    const gradesData = Array(9).fill(0); // 등급별 성적 카운트 배열 초기화

    // 강의 데이터를 순회하며 등급별 성적 카운트
    userLecture.forEach((lecture) => {
        const gradeIndex = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].indexOf(
            lecture.lecture_grades
        );
        if (gradeIndex !== -1) gradesData[gradeIndex]++;
    });

    useEffect(() => {
        // 전체 학점 계산
        const totalCredits = userLecture.reduce(
            (sum, lecture) => sum + lecture.lecture_credit,
            0
        );
        // 전체 평점 계산
        const averageGPA = parseFloat((totalCredits / userLecture.length).toFixed(2));

        // 전공 및 교양 강의 필터링
        const majorLectures = userLecture.filter((lecture) => lecture.division === '전공');
        const electiveLectures = userLecture.filter((lecture) => lecture.division === '교양');

        // 전공 학점 및 평점 계산
        const majorCredits = majorLectures.reduce(
            (sum, lecture) => sum + lecture.lecture_credit,
            0
        );
        const majorAverageGPA = majorLectures.length
            ? parseFloat((majorCredits / majorLectures.length).toFixed(2))
            : 0;

        // 교양 학점 및 평점 계산
        const electiveCredits = electiveLectures.reduce(
            (sum, lecture) => sum + lecture.lecture_credit,
            0
        );
        const electiveAverageGPA = electiveLectures.length
            ? parseFloat((electiveCredits / electiveLectures.length).toFixed(2))
            : 0;

        // GPA 데이터 상태 업데이트
        setGpaData({
            overallGPA: averageGPA,
            majorGPA: majorAverageGPA,
            electiveGPA: electiveAverageGPA,
            totalCredits: totalCredits,
            majorCredits: majorCredits,
            electiveCredits: electiveCredits,
        });
    }, [userLecture]);

    // 학기별 강의 데이터를 저장하는 객체
    const semesterData: Record<number, Lecture[]> = {
        1: userLecture.filter(
            (lecture) => lecture.lecture_grade === 1 && lecture.lecture_semester === 1
        ),
        2: userLecture.filter(
            (lecture) => lecture.lecture_grade === 1 && lecture.lecture_semester === 2
        ),
        3: userLecture.filter(
            (lecture) => lecture.lecture_grade === 2 && lecture.lecture_semester === 1
        ),
        4: userLecture.filter(
            (lecture) => lecture.lecture_grade === 2 && lecture.lecture_semester === 2
        ),
        5: userLecture.filter(
            (lecture) => lecture.lecture_grade === 3 && lecture.lecture_semester === 1
        ),
        6: userLecture.filter(
            (lecture) => lecture.lecture_grade === 3 && lecture.lecture_semester === 2
        ),
        7: userLecture.filter(
            (lecture) => lecture.lecture_grade === 4 && lecture.lecture_semester === 1
        ),
        8: userLecture.filter(
            (lecture) => lecture.lecture_grade === 4 && lecture.lecture_semester === 2
        ),
    };

    // 프로그레스 서클에 표시할 데이터 구성
    const progressCircleConfigs = [
        { label: '전체 평점', value: gpaData.overallGPA, maxValue: 4.5 },
        { label: '전공 평점', value: gpaData.majorGPA, maxValue: 4.5 },
        { label: '교양 평점', value: gpaData.electiveGPA, maxValue: 4.5 },
        { label: '전체 학점', value: gpaData.totalCredits, maxValue: 120 },
        { label: '전공 학점', value: gpaData.majorCredits, maxValue: 80 },
        { label: '교양 학점', value: gpaData.electiveCredits, maxValue: 20 },
    ];

    // 등급 라벨 정의
    const gradeLabels = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'];

    // 그래프의 최대 값 계산
    const maxGradeCount = Math.max(...gradesData);

    // 그래프의 최대 너비 설정
    const maxBarWidth = width * 0.6; // 화면 너비의 60% 사용

    // 애니메이션 값 설정
    const animatedValues = gradesData.map(() => new Animated.Value(0));

    useEffect(() => {
        const timer = setTimeout(() => {
            // 애니메이션 시작
            const animations = gradesData.map((_, index) => {
                return Animated.timing(animatedValues[index], {
                    toValue: (gradesData[index] / maxGradeCount) * maxBarWidth,
                    duration: 800,
                    useNativeDriver: false,
                });
            });
            Animated.stagger(100, animations).start();
        }, 1000); // 2초 후에 애니메이션 시작

        return () => clearTimeout(timer);
    }, [gradesData]);

    // 등급별 색상 설정
    const gradeColors = [
        '#4CAF50',
        '#8BC34A',
        '#CDDC39',
        '#FFC107',
        '#FF9800',
        '#FF5722',
        '#F44336',
        '#E91E63',
        '#9C27B0',
    ];

    return (
        <View style={styles.container}>
            {/* 뱃지 영역 */}
            <ScrollView horizontal={true} style={styles.badgeContainer}>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>우등상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지2.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>수강상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지3.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>성장상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지4.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>노력상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지5.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>출석상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지6.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>소통상</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image
                        source={require('../../../assets/뱃지7.png')}
                        resizeMode="contain"
                        style={{ width: 50, height: 50 }}
                    />
                    <Text style={{ color: 'black' }}>최고상</Text>
                </View>
            </ScrollView>

            <ScrollView>
                {/* 프로그레스 서클 영역 */}
                <View style={styles.progressCircleContainer}>
                    {[...Array(Math.ceil(progressCircleConfigs.length / 3))].map(
                        (_, rowIndex) => (
                            <View style={styles.progressCircleRow} key={rowIndex}>
                                {progressCircleConfigs
                                    .slice(rowIndex * 3, (rowIndex + 1) * 3)
                                    .map((config, index) => (
                                        <AnimatedCircularProgress
                                            key={index}
                                            percent={(config.value / config.maxValue) * 100}
                                            label={config.label}
                                            value={config.value}
                                            maxValue={config.maxValue}
                                        />
                                    ))}
                            </View>
                        )
                    )}
                </View>

                {/* 목표 학점 영역 */}
                <View style={styles.goalGPAContainer}>
                    <View style={styles.goalGPATitleContainer}>
                        <Text style={styles.goalGPATitleText}>목표학점</Text>
                        <IconH style={styles.goalGPAIcon} name="trophy" size={30} />
                    </View>
                    <HorizontalBarGraph
                        currentGPA={progressCircleConfigs[0].value}
                        goalGPA={goalGPA}
                    />
                </View>

                {/* 등급별 성적 분포 그래프 */}
                <Text style={styles.gradeDistributionTitle}>등급별 성적 분포</Text>
                <ScrollView style={styles.gradeDistributionChartContainer}>
                    <View style={styles.gradeDistributionChart}>
                        {gradesData.map((value, index) => (
                            <View key={index} style={styles.gradeBarContainer}>
                                <Text style={styles.gradeLabel}>{gradeLabels[index]}</Text>
                                <Animated.View
                                    style={[
                                        styles.gradeBar,
                                        {
                                            width: animatedValues[index],
                                            backgroundColor: gradeColors[index],
                                        },
                                    ]}
                                />
                                <Text style={styles.gradeCount}>{value}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* 학기 선택기 */}
                <View style={styles.semesterPickerContainer}>
                    <Picker
                        selectedValue={selectedYear}
                        style={styles.picker}
                        onValueChange={(itemValue: number) => setSelectedYear(itemValue)}
                    >
                        {[...Array(userData.college)].map((_, index) => (
                            <Picker.Item key={index} label={`${index + 1}학년`} value={index + 1} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={selectedSemester}
                        style={styles.picker}
                        onValueChange={(itemValue: number) => setSelectedSemester(itemValue)}
                    >
                        {[1, 2].map((semester, index) => (
                            <Picker.Item key={index} label={`${semester}학기`} value={semester - 1} />
                        ))}
                    </Picker>
                </View>

                {/* 강의 목록 테이블 */}
                {semesterData[selectedYear * 2 - 1 + selectedSemester].length > 0 ? (
                    <View style={styles.lectureTableContainer}>
                        <Table borderStyle={{ borderWidth: 3, borderColor: 'gray' }}>
                            <Row
                                data={['과목명', '구분', '학점', '성적']}
                                style={styles.lectureTableHeader}
                                textStyle={styles.lectureTableHeaderText}
                                widthArr={[width * 0.65, width * 0.1, width * 0.1, width * 0.1]}
                            />
                            {semesterData[selectedYear * 2 - 1 + selectedSemester].map(
                                (lecture, index) => (
                                    <Row
                                        key={index}
                                        data={[
                                            lecture.lecture_name,
                                            lecture.division,
                                            lecture.lecture_credit,
                                            lecture.lecture_grades,
                                        ]}
                                        style={styles.lectureTableRow}
                                        textStyle={styles.lectureTableText}
                                        widthArr={[width * 0.65, width * 0.1, width * 0.1, width * 0.1]}
                                    />
                                )
                            )}
                        </Table>
                    </View>
                ) : (
                    <Text style={styles.noLectureDataText}>데이터가 없습니다.</Text>
                )}
            </ScrollView>
        </View>
    );
};

// 스타일 시트 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // 뱃지 영역 스타일
    badgeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#f5f5f5',
        height: 100,
    },
    badgeItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    // 프로그레스 서클 영역 스타일
    progressCircleContainer: {
        marginTop: 50,
        width: '90%',
        alignSelf: 'center',
    },
    progressCircleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    progressCircleItem: {
        flex: 1,
        alignItems: 'center',
    },
    progressCircleTextContainer: {
        position: 'absolute',
        top: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    progressCircleText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
    },
    // 목표 학점 영역 스타일
    goalGPAContainer: {
        marginHorizontal: 20,
    },
    goalGPATitleContainer: {
        height: 50,
        width: '33%',
        marginVertical: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#F29F05',
        paddingBottom: -30,
    },
    goalGPATitleText: {
        fontSize: 18,
        color: 'black',
        fontWeight: '500',
    },
    goalGPAIcon: {
        marginLeft: 10,
        color: '#F29F05',
    },
    horizontalBarGraphContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    lottieAnimation: {
        width: 100,
        height: 100,
    },
    graphContent: {
        position: 'relative',
    },
    graphContainer: {
        marginBottom: 20,
    },
    graphBarBackground: {
        height: 30,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative', // 자식의 절대 위치 기준
        justifyContent: 'center',
    },
    graphBarFill: {
        height: '100%',
        borderRadius: 5,
    },
    graphBarText: {
        position: 'absolute',
        alignSelf: 'center',
        color: 'white',
        fontWeight: 'bold',
    },
    // 등급 분포 그래프 스타일
    gradeDistributionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#333',
    },
    gradeDistributionChartContainer: {
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    gradeDistributionChart: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    gradeBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    gradeBar: {
        height: 25,
        borderRadius: 12.5,
    },
    gradeLabel: {
        width: 50,
        marginRight: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#555',
    },
    gradeCount: {
        marginLeft: 10,
        fontWeight: 'bold',
        color: '#555',
    },
    // 학기 선택기 스타일
    semesterPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
    },
    picker: {
        width: width * 0.45,
        backgroundColor: '#dddddd',
        marginHorizontal: 5,
        color: 'black',
        elevation: 5,
        shadowColor: 'black',
    },
    // 강의 테이블 스타일
    lectureTableContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
    },
    lectureTableHeader: {
        height: 30,
        backgroundColor: '#dddddd',
    },
    lectureTableHeaderText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
    },
    lectureTableRow: {
        height: 50,
    },
    lectureTableText: {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'black',
    },
    noLectureDataText: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: 20,
        color: 'gray',
    },
});

export default AcademicInfoScreen;
