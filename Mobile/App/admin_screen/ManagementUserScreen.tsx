import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconSetting from 'react-native-vector-icons/Entypo';

const width = Dimensions.get("window").width;

const admin_check = ['관리자', '일반유저', '학과대표', '학과조교'];
const departments = ['컴퓨터소프트웨어학과', '기계공학과', '전자공학과']; // Add more departments as needed

const userData = [
  { image: require('../assets/event1.jpg'), name: '홍길동', id: 'Hong01', department: '컴퓨터소프트웨어학과', report: 1, admin: 1, point: 2000 },
  { image: require('../assets/event1.jpg'), name: '김철수', id: 'Kim01', department: '기계공학과', report: 4, admin: 0, point: 1500 },
  { image: require('../assets/event1.jpg'), name: '이영희', id: 'Lee01', department: '전자공학과', report: 2, admin: 2, point: 1800 },
  { image: require('../assets/event1.jpg'), name: '박지민', id: 'Park01', department: '컴퓨터소프트웨어학과', report: 3, admin: 3, point: 2200 },
];

const getRoleColor = (role: number) => {
  switch (role) {
    case 0:
      return 'red';
    case 1:
      return 'black';
    case 2:
      return 'green';
    case 3:
      return 'blue';
    default:
      return 'black';
  }
};

const ManagementUserScreen = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');

  const filteredUserData = userData.filter((user) => {
    return (
      (selectedDepartment === '' || user.department === selectedDepartment) &&
      (selectedAdmin === '' || admin_check[user.admin] === selectedAdmin)
    );
  });

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDepartment}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
        >
          <Picker.Item label="전체 학과" value="" />
          {departments.map((department, index) => (
            <Picker.Item key={index} label={department} value={department} />
          ))}
        </Picker>
        <Picker
          selectedValue={selectedAdmin}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedAdmin(itemValue)}
        >
          <Picker.Item label="전체 유저 타입" value="" />
          {admin_check.map((role, index) => (
            <Picker.Item key={index} label={role} value={role} />
          ))}
        </Picker>
      </View>
      <ScrollView>
        {filteredUserData.map((user, index) => (
          <View key={index} style={styles.userInfoBox}>
            <View style={styles.imageArea}>
              <Image style={styles.image} source={user.image} />
            </View>
            <View style={styles.userInfoArea}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.id}>{user.id}</Text>
                <Text style={styles.department}>{user.department}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.report, user.report > 3 && { color: 'red' }]}>
                  신고누적횟수 : {user.report}회
                </Text>
                <Text style={[styles.admin, { color: getRoleColor(user.admin) }]}>
                  {admin_check[user.admin]}
                </Text>
                <Text style={styles.point}>{user.point} P</Text>
              </View>
            </View>
            <View style={styles.userSettingArea}>
              <TouchableOpacity style={styles.userSettingBtn}>
                <IconSetting style={styles.userSettingIcon} name='dots-three-vertical' />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        <View style={{ height: 100 }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.95,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    width: width * 0.45,
  },
  userInfoBox: {
    backgroundColor: 'white',
    width: width * 0.95,
    height: 100,
    flexDirection: 'row',
    padding: 5,
    marginVertical: 10,
    borderRadius: 10,
    elevation: 5,
  },
  imageArea: {
    backgroundColor: '#666666',
    width: 90,
    height: 90,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#999999',
    overflow: 'hidden'
  },
  image: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
  userInfoArea: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'row',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'space-around',
  },
  name: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  id: {
    color: 'black',
    fontSize: 14,
  },
  department: {
    color: 'black',
    fontSize: 14,
  },
  report: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  admin: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  point: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userSettingArea: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  userSettingBtn: {
    padding: 5,
  },
  userSettingIcon: {
    color: 'black',
    fontSize: 24,
  },
});

export default ManagementUserScreen;
