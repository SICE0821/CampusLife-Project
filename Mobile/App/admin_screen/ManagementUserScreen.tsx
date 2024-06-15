import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconSetting from 'react-native-vector-icons/Entypo';

const width = Dimensions.get("window").width;

const admin_check = ['관리자', '일반유저', '학과대표', '학과조교'];
const departments = ['컴퓨터소프트웨어학과', '기계공학과', '전자공학과']; // 필요에 따라 학과를 추가하세요

const userData = [
  { userId: 1, image: require('../assets/event1.jpg'), name: '홍길동', id: 'Hong01', department: '컴퓨터소프트웨어학과', report: 1, admin: 1, point: 2000 },
  { userId: 2, image: require('../assets/event1.jpg'), name: '김철수', id: 'Kim01', department: '기계공학과', report: 4, admin: 0, point: 1500 },
  { userId: 3, image: require('../assets/event1.jpg'), name: '이영희', id: 'Lee01', department: '전자공학과', report: 2, admin: 2, point: 1800 },
  { userId: 4, image: require('../assets/event1.jpg'), name: '홍길동', id: 'Hong01', department: '컴퓨터소프트웨어학과', report: 1, admin: 1, point: 2000 },
  { userId: 5, image: require('../assets/event1.jpg'), name: '김철수', id: 'Kim01', department: '기계공학과', report: 4, admin: 0, point: 1500 },
  { userId: 6, image: require('../assets/event1.jpg'), name: '이영희', id: 'Lee01', department: '전자공학과', report: 2, admin: 2, point: 1800 },
  { userId: 7, image: require('../assets/event1.jpg'), name: '홍길동', id: 'Hong01', department: '컴퓨터소프트웨어학과', report: 1, admin: 1, point: 2000 },
  { userId: 8, image: require('../assets/event1.jpg'), name: '김철수', id: 'Kim01', department: '기계공학과', report: 4, admin: 0, point: 1500 },
  { userId: 9, image: require('../assets/event1.jpg'), name: '이영희', id: 'Lee01', department: '전자공학과', report: 2, admin: 2, point: 1800 },

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
  const [selectedUser, setSelectedUser] = useState<any>(null); // 선택된 사용자 상태

  // 사용자 데이터를 필터링하여 선택된 학과와 관리자 유형에 따라 필터링합니다.
  const filteredUserData = userData.filter((user) => {
    return (
      (selectedDepartment === '' || user.department === selectedDepartment) &&
      (selectedAdmin === '' || admin_check[user.admin] === selectedAdmin)
    );
  });

  // 각 사용자의 설정 아이콘을 클릭하여 선택된 사용자 상태를 업데이트합니다.
  const setSettingUser = (user: any) => {
    setSelectedUser(user);
  };

  // 신고 확인 기능
  const handleReportCheck = () => {
    if (selectedUser) {
      console.log(`선택된 유저의 신고 누적 횟수: ${selectedUser.report}`);
      // 여기에 신고 확인 기능을 구현할 수 있습니다.
    }
  };

  // 권한 변경 기능
  const handleChangeRole = () => {
    if (selectedUser) {
      console.log(`선택된 유저의 현재 권한: ${admin_check[selectedUser.admin]}`);
      // 여기에 권한 변경 기능을 구현할 수 있습니다.
    }
  };

  // 포인트 수정 기능
  const handleModifyPoints = () => {
    if (selectedUser) {
      console.log(`선택된 유저의 현재 포인트: ${selectedUser.point}`);
      // 여기에 포인트 수정 기능을 구현할 수 있습니다.
    }
  };

  return (
    <View style={styles.container}>
      {/* 학과 및 관리자 유형 선택 피커 */}
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

      {/* 사용자 목록 스크롤 뷰 */}
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
              {/* 설정 아이콘 버튼 */}
              <TouchableOpacity
                style={styles.userSettingBtn}
                onPress={() => setSettingUser(user)}
              >
                <IconSetting style={styles.userSettingIcon} name='dots-three-vertical' />
              </TouchableOpacity>

              
            </View>
            {/* 선택된 사용자에 대한 드롭다운 메뉴 */}
            {selectedUser && selectedUser.userId === user.userId && (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={handleReportCheck}>
                    <Text style={styles.dropdownText}>신고확인</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={handleChangeRole}>
                    <Text style={styles.dropdownText}>권한 변경</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.dropdownItem} onPress={handleModifyPoints}>
                    <Text style={styles.dropdownText}>포인트 수정</Text>
                  </TouchableOpacity>
                </View>
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
    backgroundColor: 'white',
    elevation: 3,
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 40,
  },
  userSettingBtn: {
    paddingVertical: 10,
  },
  userSettingIcon: {
    color: 'black',
    fontSize: 24,
  },
  dropdown: {
    width: 110,
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  dropdownItem: {
    paddingVertical: 5,
  },
  dropdownText: {
    color: 'black',
    fontSize: 18
  }
});

export default ManagementUserScreen;
