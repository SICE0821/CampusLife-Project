import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Table, Row, Rows } from "react-native-table-component";
import { UserData, Lecture } from '../../../types/type';

const { width } = Dimensions.get("window");

const AcademicRecord = ({ route }: any) => {
    const { userdata, LectureData } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userLecture, setUserLecture] = useState<Lecture[]>(LectureData);

    const [visibleSemesters, setVisibleSemesters] = useState<number[]>([]);
    const [selectedSemester, setSelectedSemester] = useState<number | null>(null);

    useEffect(() => {
        const semesters: number[] = [];
        for (let year = 1; year <= userData.college; year++) {
            semesters.push(year * 2 - 1); // Odd semester
            semesters.push(year * 2); // Even semester
        }
        setVisibleSemesters(semesters);

        // 초기 선택 값 설정 (예를 들어 첫 번째 학기로 설정)
        if (semesters.length > 0) {
            setSelectedSemester(semesters[0]);
        }
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

    return (
        <View style={styles.container}>
            <Picker
                selectedValue={selectedSemester}
                style={{ alignSelf: 'flex-end', height: 50, width: 200, backgroundColor: '#dddddd', color: 'black', elevation: 5, shadowColor: 'black' }}
                dropdownIconColor={'black'}
                onValueChange={(itemValue, itemIndex) => setSelectedSemester(itemValue)}
            >
                {visibleSemesters.map((semester) => (
                    <Picker.Item key={semester} label={semesterLabels[semester]} value={semester} />
                ))}
            </Picker>

            {selectedSemester && (
                <View style={{width: width, height: 'auto', backgroundColor: 'white'}}>
                    {semesterData[selectedSemester].length === 0 ? (
                        <Text style={styles.noDataText}>데이터가 없습니다.</Text>
                    ) : (
                        <ScrollView horizontal={true} alwaysBounceHorizontal={true}>
                            <View style={styles.detail_credit_area}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: 2, borderColor: 'black' }}>
                                        <Row
                                            data={["과목명", "구분", "담당교수", "학점", "수업시간", "강의실"]}
                                            style={{ height: 30, backgroundColor: "#dddddd" }}
                                            textStyle={{ textAlign: "center", fontWeight: "bold", color: 'black' }}
                                            widthArr={[180, 60, 80, 60, 120, 70]}
                                        />
                                        <Rows
                                            data={semesterData[selectedSemester].map(lecture => [
                                                lecture.lecture_name,
                                                lecture.division,
                                                lecture.professor_name,
                                                lecture.credit,
                                                lecture.lecture_time,
                                                lecture.lecture_room
                                            ])}
                                            style={styles.tableRows}
                                            textStyle={{ textAlign: "center", fontWeight: 'bold', color: 'black' }}
                                            widthArr={[180, 60, 80, 60, 120, 70]}
                                        />
                                    </Table>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black'
    },
    detail_credit_area: {},
    table: {
        margin: 10,
    },
    tableRows: {
        height: 50,
        backgroundColor: 'white'
    },
});

export default AcademicRecord;
