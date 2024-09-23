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
            {/* 학기 선택기 */}
            <Picker
                selectedValue={selectedSemester}
                style={styles.picker}
                dropdownIconColor={'white'}
                onValueChange={(itemValue, itemIndex) => setSelectedSemester(itemValue)}
            >
                {visibleSemesters.map((semester) => (
                    <Picker.Item key={semester} label={semesterLabels[semester]} value={semester} />
                ))}
            </Picker>

            {/* 학기별 강의 데이터 테이블 */}
            {selectedSemester && (
                <View style={styles.tableContainer}>
                    {semesterData[selectedSemester].length === 0 ? (
                        <Text style={styles.noDataText}>데이터가 없습니다.</Text>
                    ) : (
                        <ScrollView horizontal={true} alwaysBounceHorizontal={true}>
                            <View style={styles.detailCreditArea}>
                                <View style={styles.table}>
                                    <Table borderStyle={{ borderWidth: 1, borderColor: '#E0E0E0' }}>
                                        <Row
                                            data={["과목명", "구분", "담당교수", "학점", "수업시간", "강의실"]}
                                            style={styles.tableHeader}
                                            textStyle={styles.tableHeaderText}
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
                                            textStyle={styles.tableText}
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
        backgroundColor: '#F5F5F5',
        paddingTop: 20,
        paddingHorizontal: 15,
    },
    picker: {
        height: 50,
        width: 220,
        backgroundColor: '#4CAF50',
        color: 'white',
        elevation: 5,
        borderRadius: 10,
        marginBottom: 20,
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '600',
    },
    tableContainer: {
        flex: 1,
        backgroundColor: '#fff',
        marginHorizontal: 10,
        borderRadius: 10,
        elevation: 3,
        paddingBottom: 20,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'gray',
    },
    detailCreditArea: {
        marginHorizontal: 10,
        marginBottom: 20,
    },
    table: {
        marginTop: 10,
        borderRadius: 10,
    },
    tableHeader: {
        height: 40,
        backgroundColor: '#4CAF50',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
    },
    tableHeaderText: {
        textAlign: "center",
        fontWeight: "600",
        color: 'white',
        fontSize: 16,
    },
    tableRows: {
        height: 50,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    tableText: {
        textAlign: "center",
        fontWeight: '500',
        color: '#333',
    },
});

export default AcademicRecord;
