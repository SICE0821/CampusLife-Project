import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { Table, Row, Rows } from "react-native-table-component";
import { UserData, Lecture } from '../../../types/type';

const AcademicRecord = ({route} : any) => {
    const { userdata, LectureData } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userLecture, setUserLecture] = useState<Lecture[]>(LectureData);

    const [visibleSemesters, setVisibleSemesters] = useState<number[]>([]);

    useEffect(() => {
        const semesters: number[] = [];
        for (let year = 1; year <= userData.college; year++) {
            semesters.push(year * 2 - 1); // Odd semester
            semesters.push(year * 2); // Even semester
        }
        setVisibleSemesters(semesters);
    }, [userData.college]);

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

    const [visibility, setVisibility] = useState<Record<number, boolean>>({});

    const toggleVisibility = (semester: number) => {
        setVisibility(prev => ({
            ...prev,
            [semester]: !prev[semester]
        }));
    };

    // 초기에 모든 학기를 숨김 상태로 설정
    useEffect(() => {
        const initialVisibility: Record<number, boolean> = {};
        visibleSemesters.forEach(semester => {
            initialVisibility[semester] = false;
        });
        setVisibility(initialVisibility);
    }, [visibleSemesters]);


    return (
        <View style={styles.container}>
            <ScrollView>
                {visibleSemesters.map((semester) => (
                    <View key={semester} style={styles.area}>
                        <View style={styles.detail_credit_box}>
                            <Text style={styles.semester_text}>{semesterLabels[semester]}</Text>
                            <TouchableOpacity onPress={() => toggleVisibility(semester)}>
                                <Icon name={visibility[semester] ? "chevron-up" : "chevron-down"} style={styles.semester_button} />
                            </TouchableOpacity>
                        </View>
                        {visibility[semester] && (
                            <ScrollView horizontal={true} alwaysBounceHorizontal={true}>
                                <View style={styles.detail_credit_area}>
                                    <View style={styles.table}>
                                        <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                                            <Row
                                                data={["과목명", "구분", "담당교수", "학점", "수업시간", "강의실"]}
                                                style={{ height: 30, backgroundColor: "#dddddd" }}
                                                textStyle={{ textAlign: "center", fontWeight: "bold" }}
                                                widthArr={[200, 60, 70, 60, 80, 70]}
                                            />
                                            <Rows
                                                data={semesterData[semester].map(lecture => [
                                                    lecture.lecture_name,
                                                    lecture.division,
                                                    lecture.professor_name,
                                                    lecture.credit,
                                                    lecture.lecture_time,
                                                    lecture.lecture_room
                                                ])}
                                                style={styles.tableRows}
                                                textStyle={{ textAlign: "center", fontWeight: 'bold' }}
                                                widthArr={[200, 60, 70, 60, 80, 70]}
                                            />
                                        </Table>
                                    </View>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    area: {
        marginTop: 20,
    },
    detail_credit_box: {
        backgroundColor: '#999999',
        width: '100%',
        height: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        marginTop: 20,
    },
    semester_text: {
        fontSize: 32,
        marginLeft: 15,
        fontWeight: 'bold',
    },
    semester_button: {
        fontSize: 50,
        marginRight: 15,
    },
    detail_credit_area: {},
    table: {
        margin: 10,
    },
    tableRows: {
        height: 50,
    },
});

export default AcademicRecord;