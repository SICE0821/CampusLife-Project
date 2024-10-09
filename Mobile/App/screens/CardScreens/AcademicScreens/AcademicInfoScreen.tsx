import React, { useState, useEffect, useRef } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    Animated,
    Easing,
    TouchableOpacity,
    Alert,
    TextInput,
    Image,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Table, Row } from 'react-native-table-component';
import { UserData, Lecture } from '../../../types/type';
import LottieView from 'lottie-react-native';
import IconH from 'react-native-vector-icons/FontAwesome';
import IconB from 'react-native-vector-icons/SimpleLineIcons';
import { useFocusEffect } from '@react-navigation/native';
import config from '../../../config';
import Svg, { Circle } from 'react-native-svg';
import Modal from 'react-native-modal';

const { width } = Dimensions.get('window');

// 원형 진행 표시 애니메이션을 위한 AnimatedCircle 컴포넌트 생성
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// 가로 막대 그래프 컴포넌트 - 현재 GPA와 목표 GPA를 시각화
const HorizontalBarGraph = ({ currentGPA, goalGPA }: any) => {
    const [graphWidth, setGraphWidth] = useState(0); // 그래프 너비를 저장하는 상태
    const animationWidth = 150; // 애니메이션의 너비 설정

    // 목표 학점을 백분율로 계산
    const goalPercentage = (goalGPA / 4.5) * 100;
    // 현재 학점을 백분율로 계산
    const currentPercentage = (currentGPA / 4.5) * 100;

    // 애니메이션 위치를 그래프 너비에 맞게 조정
    const adjustedPosition = graphWidth ? (currentPercentage / 100) * graphWidth - animationWidth / 2 : 0;

    // 애니메이션 시작 상태
    const [animationStarted, setAnimationStarted] = useState(false);

    // 컴포넌트가 렌더링된 후 애니메이션 시작
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimationStarted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View
            style={styles.horizontalBarGraphContainer}
            onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setGraphWidth(width); // 그래프의 실제 너비 저장
            }}
        >
            {/* 현재 학점 표시 막대 */}
            <View style={styles.graphContainer}>
                {/* 애니메이션이 시작되면 Lottie 애니메이션을 표시 */}
                {animationStarted && (
                    <LottieView
                        source={require('../../../assets/Animation - 1725893333150.json')}
                        autoPlay
                        loop={true} // 반복하도록 설정
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
                    {/* 현재 학점을 그래프로 표시 */}
                    <View
                        style={[
                            styles.graphBarFill,
                            { width: `${currentPercentage}%`, backgroundColor: '#2196f3' },
                        ]}
                    />
                    <Text style={styles.graphBarText}>현재 학점: {currentGPA.toFixed(2)}</Text>
                </View>
            </View>

            {/* 목표 학점 표시 막대 */}
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

// 원형 프로그레스 애니메이션 컴포넌트
const AnimatedCircularProgress = ({ percent, label, value, maxValue }: any) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    // 애니메이션을 시작하는 useEffect
    useEffect(() => {
        const timer = setTimeout(() => {
            animatedValue.setValue(0); // 애니메이션 초기화
            Animated.timing(animatedValue, {
                toValue: percent, // 퍼센트 값을 목표로 애니메이션 진행
                duration: 2000, // 애니메이션 시간 설정
                easing: Easing.out(Easing.exp), // 이징 함수 적용
                useNativeDriver: false,
            }).start();
        }, 1000); // 1초 후 애니메이션 시작

        return () => clearTimeout(timer);
    }, [percent]);

    const circumference = 100 * Math.PI; // 원주 계산
    const strokeDashoffset = animatedValue.interpolate({
        inputRange: [0, 100],
        outputRange: [circumference, 0], // 퍼센트에 따른 선의 길이 변화
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

// 학사 정보 화면 컴포넌트
const AcademicInfoScreen = ({ route }: any) => {
    const { userdata, LectureData } = route.params;
    const [userData] = useState<UserData>(userdata); // 사용자 데이터를 상태로 관리
    const [userLecture] = useState<Lecture[]>(LectureData); // 강의 데이터를 상태로 관리
    const [selectedYear, setSelectedYear] = useState<number>(1); // 선택된 학년
    const [selectedSemester, setSelectedSemester] = useState<number>(0); // 선택된 학기 (0: 1학기, 1: 2학기)
    const [goalGPA, setGoalGPA] = useState<number>(1); // 목표 학점
    const [isModalVisible, setModalVisible] = useState(false); // 목표 학점 설정 모달의 가시성
    const [changegoalGPA, setChangegoalGPA] = useState(''); // 목표 학점 변경 입력 상태

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

    // 서버에서 목표 학점을 가져오는 비동기 함수
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
            setGoalGPA(result.goal_gpa); // 서버에서 가져온 목표 학점을 상태에 저장
        } catch (error) {
            console.error(error);
        }
    };

    // 목표 학점을 변경하는 비동기 함수
    const change_GoalGPA = async () => {
        try {
            const parsedValue = convertToFloat();
            // 0~4.5 범위 내에서만 설정 가능하게 제한
            if (parsedValue >= 0 && parsedValue <= 4.5) {
                const response = await fetch(`${config.serverUrl}/change_GoalGPA`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: userData.user_pk,
                        goal_gpa: parsedValue // 입력된 값을 float으로 변환하여 전송
                    })
                });
                await response.json();
                ChangGoalGpaAlert(); // 성공 알림
                setChangegoalGPA(''); // 입력 필드 초기화
                await getGoalGPA(); // 목표 학점 재갱신
            } else {
                Alert.alert('오류', '목표 학점은 0에서 4.5 사이여야 합니다.');
            }
        } catch (error) {
            console.error(error);
        }
    };


    // 입력된 목표 학점을 float으로 변환하는 함수
    const convertToFloat = () => {
        const parsedValue = parseFloat(changegoalGPA);
        return parsedValue;
    };

    // 모달 토글 함수
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    // 목표 학점 설정 성공 시 경고창
    const ChangGoalGpaAlert = () => {
        Alert.alert(
            "목표 학점 설정",
            "목표 학점 설정 성공!!",
            [{ text: "확인", onPress: () => toggleModal() }]
        );
    };

    // 숫자 입력 처리 함수
    const handleNumberInput = (value: string) => {
        setChangegoalGPA(value);
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

    const gradesData = Array(9).fill(0); // 등급별 성적 카운트를 저장하는 배열

    // 강의 데이터를 순회하여 등급별 성적 카운트
    userLecture.forEach((lecture) => {
        const gradeIndex = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].indexOf(
            lecture.lecture_grades
        );
        if (gradeIndex !== -1) gradesData[gradeIndex]++;
    });

    // GPA 데이터를 계산하는 useEffect
    useEffect(() => {
        // 전체 학점 계산
        const totalCredits = userLecture.reduce(
            (sum, lecture) => sum + lecture.lecture_credit,
            0
        );
        // 전체 평점 계산
        const averageGPA = parseFloat((totalCredits / userLecture.length).toFixed(2));

        // 전공 및 교양 강의를 필터링
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

    // 애니메이션 값 설정을 useRef로 변경하여 재생성 방지
    const animatedValues = useRef(gradesData.map(() => new Animated.Value(0))).current;

    // 등급별 애니메이션 시작 useEffect를 빈 배열로 변경하여 컴포넌트 마운트 시 한 번만 실행
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
        }, 1000);

        return () => clearTimeout(timer);
    }, []); // 빈 배열로 설정하여 한 번만 실행

    // 등급별 색상 설정
    const gradeColors = [
        '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#F44336', '#E91E63', '#9C27B0',
    ];

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* 뱃지 영역 */}
                <View style={styles.badgeTitle}>
                    <Text style={styles.badgeTitleText}>내 뱃지</Text>
                    <IconB style={styles.badgeIcon} name="badge" size={30} />
                </View>
                <ScrollView horizontal={true} style={styles.badgeContainer}>
                    {/* 개별 뱃지 일단 반투명 하게 하고 얻으면 불투명하게 하면 될듯?*/}
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>우등상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지2.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>수강상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지3.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>성장상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지4.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>노력상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지5.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>출석상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지6.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>소통상</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Image
                            source={require('../../../assets/뱃지7.png')}
                            resizeMode="contain"
                            style={styles.badgeImage}
                        />
                        <Text style={styles.badgeText}>최고상</Text>
                    </View>
                </ScrollView>
                {/* 원형 프로그레스 표시 */}
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
                </View>

                {/* 가로 막대 그래프 */}
                <HorizontalBarGraph
                    currentGPA={progressCircleConfigs[0].value}
                    goalGPA={goalGPA}
                />

                {/* 목표 학점 변경 버튼 */}
                <View style={styles.changeGoalGPAButtonContainer}>
                    <TouchableOpacity
                        style={styles.changeGoalGPAButton}
                        onPress={() => toggleModal()}>
                        <Text style={styles.changeGoalGPAButtonText}>목표 학점 변경 하기</Text>
                    </TouchableOpacity>
                </View>

                {/* 목표 학점 변경 모달 */}
                <Modal
                    isVisible={isModalVisible}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.6}
                >
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>목표 학점 설정</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={changegoalGPA}
                            onChangeText={handleNumberInput}
                            placeholder="0 ~ 4.5"
                            maxLength={4} // 소수점 포함하여 최대 4글자로 제한
                        />
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.submitButton} onPress={change_GoalGPA}>
                                <Text style={styles.buttonText}>설정</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={toggleModal}>
                                <Text style={styles.buttonText}>닫기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* 등급별 성적 분포 그래프 */}
                <Text style={styles.gradeDistributionTitle}>등급별 성적 분포</Text>
                <View style={styles.gradeDistributionChartContainer}>
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
                </View>

                {/* 학기 선택기 */}
                <View style={styles.semesterPickerContainer}>
                    <View style={styles.pickerWrapper}>
                        <IconH name="calendar" size={20} style={styles.pickerIcon} />
                        <Picker
                            selectedValue={selectedYear}
                            style={styles.picker}
                            onValueChange={(itemValue: number) => setSelectedYear(itemValue)}
                        >
                            {[...Array(userData.college)].map((_, index) => (
                                <Picker.Item key={index} label={`${index + 1}학년`} value={index + 1} />
                            ))}
                        </Picker>
                    </View>
                    <View style={styles.pickerWrapper}>
                        <IconH name="calendar-o" size={20} style={styles.pickerIcon} />
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
                </View>

                {/* 강의 목록 테이블 */}
                {semesterData[selectedYear * 2 - 1 + selectedSemester].length > 0 ? (
                    <View style={styles.lectureTableContainer}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: '#C0C0C0' }}>
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
                                        style={{
                                            ...styles.lectureTableRow,
                                            ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                                        }}
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
    badgeTitle: {
        height: 50,
        width: '50%',
        marginVertical: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#F29F05',
        backgroundColor: 'white',
        elevation: 5,
    },
    badgeTitleText: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
    },
    badgeIcon: {
        color: '#F29F05',
        marginLeft: 5,
        
    },
    badgeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: 'white',
        height: 100,
    },
    badgeItem: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 5,
    },
    badgeImage: {
        width: 50,
        height: 50,
        opacity: 0.3
    },
    badgeText: {
        color: 'black',
    },
    // 프로그레스 서클 영역 스타일
    progressCircleContainer: {
        marginTop: 20,
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
        marginTop: 10,
        marginBottom: 10,
    },
    goalGPATitleContainer: {
        height: 50,
        width: '50%', // 폭을 전체로 변경
        marginBottom: 10,
        borderWidth: 1,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'row',
        borderColor: '#F29F05',
        backgroundColor: 'white', // 배경색 추가
        elevation: 5,
    },
    goalGPATitleText: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
    },
    goalGPAIcon: {
        color: '#F29F05',
        marginLeft: 5
    },
    // 목표 학점 변경 버튼 스타일
    changeGoalGPAButtonContainer: {
        alignItems: 'center',
        marginTop: 10, // 버튼과 그래프 사이에 여백 추가
        marginBottom: 20, // 아래쪽에 여백 추가
    },
    changeGoalGPAButton: {
        height: 50,
        width: '50%',
        backgroundColor: '#F29F05',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    changeGoalGPAButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    modalContent: {
        backgroundColor: '#f9f9f9',
        padding: 25,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#333',
        marginBottom: 20,
    },
    input: {
        height: 50,
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 18,
        marginBottom: 25,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    cancelButton: {
        backgroundColor: '#f44336',
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    horizontalBarGraphContainer: {
        width: '100%',
        paddingHorizontal: 10,
        marginTop: 20,
    },
    lottieAnimation: {
        width: 80,
        height: 80,
        marginTop: -50
    },
    graphContent: {
        position: 'relative',
    },
    graphContainer: {
        width: '95%',
        marginBottom: 20,
        alignSelf: 'center'
    },
    graphBarBackground: {
        height: 35,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        overflow: 'hidden',
        position: 'relative', // 자식의 절대 위치 기준
        justifyContent: 'center',
    },
    graphBarFill: {
        height: '100%',
        borderRadius: 8,
    },
    graphBarText: {
        position: 'absolute',
        alignSelf: 'center',
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    },
    // 등급 분포 그래프 스타일
    gradeDistributionTitle: {
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        marginVertical: 25,
        color: '#333',
    },
    gradeDistributionChartContainer: {
        marginBottom: 20,
        paddingHorizontal: 25,
    },
    gradeDistributionChart: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    gradeBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    gradeBar: {
        height: 25,
        borderRadius: 12.5,
        marginRight: 10,
    },
    gradeLabel: {
        width: 60,
        marginRight: 10,
        textAlign: 'center',
        fontWeight: '600',
        color: '#555',
        fontSize: 16,
    },
    gradeCount: {
        marginLeft: 10,
        fontWeight: '600',
        color: '#555',
        fontSize: 16,
    },
    // 학기 선택기 스타일
    semesterPickerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    pickerWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        elevation: 3, // 그림자 효과 추가
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    picker: {
        width: width * 0.3, // 선택기 너비 조정
        color: 'black',
        fontSize: 16,
    },
    pickerIcon: {
        marginRight: 10,
        color: '#333',
    },
    // 강의 테이블 스타일
    lectureTableContainer: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    lectureTableHeader: {
        height: 50,
        backgroundColor: '#4CAF50',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    lectureTableHeaderText: {
        textAlign: 'center',
        fontWeight: '700',
        color: 'white',
        fontSize: 18,
    },
    lectureTableRow: {
        height: 50,
        backgroundColor: '#f9f9f9',
    },
    evenRow: {
        backgroundColor: '#f1f1f1',
    },
    oddRow: {
        backgroundColor: '#ffffff',
    },
    lectureTableText: {
        textAlign: 'center',
        fontWeight: '500',
        color: '#333',
        fontSize: 16,
    },
    noLectureDataText: {
        textAlign: 'center',
        fontSize: 20,
        marginTop: 20,
        color: 'gray',
    },
});

export default AcademicInfoScreen;
