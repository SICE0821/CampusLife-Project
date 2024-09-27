import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

type Question = {
  id: string;
  type: 'text' | 'radio' | 'picker';
  label: string;
  options?: string[];
};

type Applicant = {
  id: string;
  answers: { [key: string]: string };
  questions: Question[];
};

const SchoolClubSignStateScreen = ({ route, navigation }: any) => {
  console.log('you are in SchoolClubSignStateScreen');
  const { item, userData } = route.params;

  // 예시 질문 데이터 (SchoolClubSignScreen과 동일하게 설정)
  const questions: Question[] = [
    {
      id: 'name',
      type: 'text',
      label: '입력란',
    },
    {
      id: 'department',
      type: 'picker',
      label: '선택지',
      options: ['선택지1', '선택지2', '선택지3', '선택지4'],
    },
    {
      id: 'gender',
      type: 'radio',
      label: '성별',
      options: ['남성', '여성', '포크레인'],
    },
    {
      id: 'introduction',
      type: 'text',
      label: '자기소개',
    },
  ];

  // 샘플 신청자 데이터
  const [applicants, setApplicants] = useState<Applicant[]>([
    {
      id: '1',
      answers: {
        name: '김철수',
        department: '선택지1',
        gender: '남성',
        introduction: '열정적인 개발자 지망생입니다.',
      },
      questions: questions,
    },
    {
      id: '2',
      answers: {
        name: '이영희',
        department: '선택지2',
        gender: '여성',
        introduction: '전자공학에 관심이 많습니다.',
      },
      questions: questions,
    },
    {
      id: '3',
      answers: {
        name: '박민수',
        department: '선택지3',
        gender: '남성',
        introduction: '기계 설계에 흥미가 있습니다.',
      },
      questions: questions,
    },
    // 추가 샘플 데이터...
  ]);

  const renderApplicant = ({ item }: { item: Applicant }) => (
    <TouchableOpacity
      style={styles.applicantItem}
      onPress={() =>
        navigation.navigate('SchoolClubSignDetailScreen', { applicant: item })
      }
    >
      <View style={styles.applicantInfo}>
        <Text style={styles.name}>{item.answers.name}</Text>
        <Text style={styles.detail}>{item.answers.department}</Text>
      </View>
      <Icon name="right" size={20} color="#555" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>동아리 신청자 목록</Text>
      <FlatList
        data={applicants}
        renderItem={renderApplicant}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    alignSelf: 'center',
    marginVertical: 20,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  applicantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  applicantInfo: {
    flexDirection: 'column',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  detail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  separator: {
    height: 10,
  },
});

export default SchoolClubSignStateScreen;
