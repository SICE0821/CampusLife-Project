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
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';

type Question = {
  id: string;
  type: 'text' | 'radio' | 'picker';
  label: string;
  options?: string[];
};

const SchoolClubSignScreen = ({ route, navigation }: any) => {
  console.log('you are in SchoolClubSignScreen');
  const { item, userData } = route.params;

  // 예시 질문 데이터
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

  // 각 질문에 대한 응답 상태 관리
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: value,
    }));
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <View key={question.id} style={styles.inputContainer}>
            <Text style={styles.label}>{question.label}</Text>
            <TextInput
              style={[
                styles.input,
                question.id === 'introduction' && styles.textArea,
              ]}
              placeholder={`${question.label}을 입력하세요`}
              value={answers[question.id] || ''}
              onChangeText={(text) => handleInputChange(question.id, text)}
              multiline={question.id === 'introduction'}
              numberOfLines={question.id === 'introduction' ? 5 : 1}
            />
          </View>
        );
      case 'radio':
        return (
          <View key={question.id} style={styles.inputContainer}>
            <Text style={styles.label}>{question.label}</Text>
            <View style={styles.radioGroup}>
              <RadioButton.Group
                onValueChange={(newValue) =>
                  handleInputChange(question.id, newValue)
                }
                value={answers[question.id] || ''}
              >
                {question.options?.map((option, index) => (
                  <View key={index} style={styles.radioItem}>
                    <RadioButton value={option} color="#3498db" />
                    <Text style={styles.radioLabel}>{option}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          </View>
        );
      case 'picker':
        return (
          <View key={question.id} style={styles.inputContainer}>
            <Text style={styles.label}>{question.label}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={answers[question.id] || question.options?.[0]}
                onValueChange={(itemValue) =>
                  handleInputChange(question.id, itemValue)
                }
                style={styles.picker}
              >
                {question.options?.map((option, index) => (
                  <Picker.Item key={index} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  const handleSubmit = () => {
    // 모든 질문에 대한 응답이 있는지 확인
    for (let question of questions) {
      if (!answers[question.id]) {
        Alert.alert('모든 입력란에 입력해주세요.');
        return;
      }
    }

    // applicant 객체 생성
    const applicant = {
      id: Date.now().toString(), // 임시 ID 생성
      answers,
      questions,
    };

    // 입력된 데이터 콘솔 출력
    console.log('동아리 신청서 제출:', applicant);

    // 필요한 경우, applicant 데이터를 서버로 전송하거나 상태를 업데이트합니다.

    Alert.alert('동아리 신청이 완료되었습니다.');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>동아리 신청서</Text>

        {questions.map((question) => renderQuestion(question))}

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="checkcircle" size={24} color="#fff" />
          <Text style={styles.submitButtonText}>신청하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
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
    textAlignVertical: 'top',
  },
  textArea: {
    height: 100,
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
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  radioGroup: {
    flexDirection: 'column',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: '#34495e',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ecf0f1',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});

export default SchoolClubSignScreen;
