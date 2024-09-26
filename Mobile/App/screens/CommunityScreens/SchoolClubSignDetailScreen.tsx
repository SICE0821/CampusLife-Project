import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';

const SchoolClubSignDetailScreen = () => {
  const userInfo = {
    name: '김철수',
    department: '컴퓨터공학과',
    studentId: '2021123456',
  };
  const applicationData = [
    { label: '자기소개', value: '열정적인 개발자 지망생입니다.' },
    { label: '지원 동기', value: '새로운 경험을 쌓고 싶어서 지원했습니다.' },
    // 추가 신청서 항목을 여기에 추가할 수 있습니다.
  ];

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 부분 */}
      <View style={styles.header}>
        <Text style={styles.title}>{userInfo.name}님의 신청서</Text>
      </View>

      {/* 사용자 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용자 정보</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>이름</Text>
            <Text style={styles.value}>{userInfo.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>학과</Text>
            <Text style={styles.value}>{userInfo.department}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>학번</Text>
            <Text style={styles.value}>{userInfo.studentId}</Text>
          </View>
        </View>
      </View>

      {/* 신청서 데이터 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>신청서 내용</Text>
        {applicationData.map((detail, index) => (
          <View key={index} style={styles.detailContainer}>
            <Text style={styles.label}>{detail.label}</Text>
            <Text style={styles.value}>{detail.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // 아빠파파
  },
  header: {
    backgroundColor: '#6C5CE7',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 10,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3436',
    marginBottom: 20,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    paddingBottom: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  infoItem: {
    marginBottom: 15,
  },
  detailContainer: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 18,
    color: '#34495E',
    fontWeight: '700',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#7F8C8D',
    lineHeight: 24,
  },
});

export default SchoolClubSignDetailScreen;
