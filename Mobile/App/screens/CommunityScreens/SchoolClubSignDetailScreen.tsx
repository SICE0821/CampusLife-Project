import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';

const SchoolClubSignDetailScreen = ({ route }: any) => {
  const { post_id, applicant } = route.params; // 전달받은 post_id 및 applicant
  const [loading, setLoading] = useState(true); // 데이터 로딩 상태

  // 데이터를 불러오거나 준비가 완료되면 로딩 상태를 false로 변경
  useEffect(() => {
    if (applicant) {
      // 데이터를 받으면 로딩 상태를 false로 변경
      setLoading(false);
    }
  }, [applicant]);

  const applicationData = [
    { label: '자기소개', value: applicant?.Introduce },
    { label: '지원 동기', value: applicant?.Application },
  ];

  if (loading) {
    return <ActivityIndicator size="large" color="#6C5CE7" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 부분 */}
      <View style={styles.header}>
        <Text style={styles.title}>{applicant?.Name}님의 신청서</Text>
      </View>

      {/* 사용자 정보 섹션 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사용자 정보</Text>
        <View style={styles.infoContainer}>
          {[
            { label: '이름', value: applicant?.Name },
            { label: '생년월일', value: applicant?.Birth },
            { label: '학교', value: applicant?.University },
            { label: '학과', value: applicant?.Department },
            { label: '학년', value: applicant?.Grade },
            { label: '전화번호', value: applicant?.Phone },
            { label: '성별', value: applicant?.Sex },
            { label: '거주지', value: applicant?.Residence },
          ].map((info, index) => (
            <View key={index} style={styles.infoItem}>
              <Text style={styles.label}>{info.label}</Text>
              <Text style={styles.value}>{info.value}</Text>
            </View>
          ))}
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
    backgroundColor: '#FAFAFA',
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
    color: 'black',
    lineHeight: 24,
  },
});

export default SchoolClubSignDetailScreen;
