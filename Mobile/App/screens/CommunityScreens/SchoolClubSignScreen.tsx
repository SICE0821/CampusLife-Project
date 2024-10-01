import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

// 질문 타입 정의
type Question = {
  id: string;
  type: 'text'; // 모든 질문은 'text' 타입으로 정의
  label: string;
};

/**
 * 두 개의 텍스트 입력 질문을 같은 행에 배치하는 컴포넌트
 */
const RowTextQuestions: React.FC<{
  question1: Question;
  question2: Question;
  value1: string;
  value2: string;
  onChange: (id: string, value: string) => void;
}> = ({ question1, question2, value1, value2, onChange }) => (
  <View style={rowTextStyles.rowContainer}>
    <View style={rowTextStyles.inputContainer}>
      <Text style={rowTextStyles.label}>{question1.label}</Text>
      <TextInput
        style={rowTextStyles.input}
        placeholder={`${question1.label}을 입력하세요`}
        value={value1}
        onChangeText={(text) => onChange(question1.id, text)}
      />
    </View>
    <View style={rowTextStyles.inputContainer}>
      <Text style={rowTextStyles.label}>{question2.label}</Text>
      <TextInput
        style={rowTextStyles.input}
        placeholder={`${question2.label}을 입력하세요`}
        value={value2}
        onChangeText={(text) => onChange(question2.id, text)}
      />
    </View>
  </View>
);

/**
 * 거주지 입력 칸 (하나의 긴 텍스트 입력칸)
 */
const SingleTextQuestion: React.FC<{
  question: Question;
  value: string;
  onChange: (id: string, value: string) => void;
}> = ({ question, value, onChange }) => (
  <View style={singleTextStyles.container}>
    <Text style={singleTextStyles.label}>{question.label}</Text>
    <TextInput
      style={singleTextStyles.input}
      placeholder={`${question.label}을 입력하세요`}
      value={value}
      onChangeText={(text) => onChange(question.id, text)}
    />
  </View>
);

/**
 * 동아리 신청서 작성 화면 컴포넌트
 */
const SchoolClubSignScreen = ({ route, navigation }: any) => {
  // 예시 질문 데이터
  const questions: Question[] = [
    { id: 'name', type: 'text', label: '이름' },
    { id: 'birthDate', type: 'text', label: '생년월일' },
    { id: 'school', type: 'text', label: '학교' },
    { id: 'department', type: 'text', label: '학과' },
    { id: 'year', type: 'text', label: '학년' },
    { id: 'contact', type: 'text', label: '연락처' },
    { id: 'address', type: 'text', label: '거주지' },
  ];

  // 각 질문에 대한 응답 상태 관리
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  /**
   * 입력 값 변경 핸들러
   */
  const handleInputChange = (id: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  /**
   * 제출 버튼 핸들러
   */
  const handleSubmit = () => {
    for (let question of questions) {
      if (!answers[question.id]) {
        Alert.alert('모든 입력란에 입력해주세요.');
        return;
      }
    }

    const applicant = {
      id: Date.now().toString(),
      answers,
    };

    console.log('동아리 신청서 제출:', applicant);

    Alert.alert('동아리 신청이 완료되었습니다.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={mainScreenStyles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={mainScreenStyles.contentContainer}>
        <Text style={mainScreenStyles.title}>동아리 신청서</Text>

        {/* 이름/생년월일 */}
        <RowTextQuestions
          question1={questions[0]}
          question2={questions[1]}
          value1={answers['name'] || ''}
          value2={answers['birthDate'] || ''}
          onChange={handleInputChange}
        />

        {/* 학교/학과 */}
        <RowTextQuestions
          question1={questions[2]}
          question2={questions[3]}
          value1={answers['school'] || ''}
          value2={answers['department'] || ''}
          onChange={handleInputChange}
        />

        {/* 학년/연락처 */}
        <RowTextQuestions
          question1={questions[4]}
          question2={questions[5]}
          value1={answers['year'] || ''}
          value2={answers['contact'] || ''}
          onChange={handleInputChange}
        />

        {/* 거주지 칸 (한 줄로 길게) */}
        <SingleTextQuestion
          question={questions[6]}
          value={answers['address'] || ''}
          onChange={handleInputChange}
        />

        {/* 제출 버튼 */}
        <TouchableOpacity style={mainScreenStyles.submitButton} onPress={handleSubmit}>
          <Icon name="checkcircle" size={24} color="#fff" />
          <Text style={mainScreenStyles.submitButtonText}>신청하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * 메인 스타일 정의
 */
const mainScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    alignSelf: 'center',
    marginVertical: 20,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    borderRadius: 30,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

/**
 * 두 개의 텍스트 질문이 같은 줄에 배치되는 스타일 정의
 */
const rowTextStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#ecf0f1',
    textAlignVertical: 'center',
  },
});

/**
 * 단일 텍스트 질문 스타일 정의 (거주지 입력용)
 */
const singleTextStyles = StyleSheet.create({
  container: {
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#ecf0f1',
    textAlignVertical: 'center',
  },
});

export default SchoolClubSignScreen;
