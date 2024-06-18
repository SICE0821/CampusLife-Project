import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import IconSetting from 'react-native-vector-icons/Entypo';
import { UserData } from '../types/type';
import config from '../config';
import { useFocusEffect } from '@react-navigation/native';

type userInfo = {
  user_id: number,
  id: string,
  point: number,
  profilePhoto: string,
  title: string,
  report_confirm: number,
  student_name: string,
  student_id: number,
  department_id: number,
  department_name: string,
  campus_id: number
};

const width = Dimensions.get("window").width;


const getRoleColor = (role: string) => {
  switch (role) {
    case '반장':
      return 'red';
    case '학우회장':
      return 'green';
    case '일반학생':
      return 'black';
    case '학교':
      return 'blue';
    default:
      return 'black';
  }
};  

const ManagementUserScreen = ({route} : any) => {
  const { userdata } = route.params;
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedAdmin, setSelectedAdmin] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null); // 선택된 사용자 상태
  const [departments, setDepartments] = useState<string[]>([]);
  const [usergetData, setUserData] = useState<UserData>(userdata);
  const [userData, setUserDataState] = useState<userInfo[]>([]);
  const [admin_check, setAdminCheck] = useState<string[]>([]);

  const get_department = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: usergetData.campus_pk
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data); // API에서 받아온 데이터 확인

      // 데이터에서 학과 이름들을 추출하여 departments 배열에 저장
      const departmentNames = data.map((item: any) => item.department_name); // 예시로 department_name을 가져오는 코드

      setDepartments(departmentNames); // departments 배열 업데이트
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const get_user_Info = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_user_Info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: usergetData.campus_pk
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log(data); // API에서 받아온 데이터 확인
  
      // title이 '학교'인 데이터는 필터링하여 제외
      const filteredData = data.filter((item: any) => item.title !== '학교');
  
      // 필터링된 데이터에서 adminCheckNames 추출
      const adminCheckNames = filteredData.map((item: any) => item.title);
      const uniqueAdminCheckNames = Array.from(new Set(adminCheckNames)) as string[];
      setAdminCheck(uniqueAdminCheckNames);
  
      setUserDataState(filteredData);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };
  

  const filteredUserData = userData.filter((user) => {
    return (
      (selectedDepartment === '' || user.department_name === selectedDepartment) &&
      (selectedAdmin === '' || (user.title === selectedAdmin && user.title !== '학교'))
    );
  });

  // 각 사용자의 설정 아이콘을 클릭하여 선택된 사용자 상태를 업데이트합니다.
  const setSettingUser = (user: any) => {
    setSelectedUser(user);
  };

  // 신고 확인 기능
  const handleReportCheck = () => {
    if (selectedUser) {
      console.log(`선택된 유저의 신고 누적 횟수: ${selectedUser.report_confirm}`);
      // 여기에 신고 확인 기능을 구현할 수 있습니다.
    }
  };

  // 권한 변경 기능
  const handleChangeRole = () => {
    if (selectedUser) {
      console.log(`선택된 유저의 현재 권한: ${admin_check[selectedUser.report_confirm]}`);
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

  useFocusEffect(
    useCallback(() => {
      get_department();
      get_user_Info(); // 추가: 사용자 정보를 가져오는 함수 호출
    }, [])
  );

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
            role !== '학교' && <Picker.Item key={index} label={role} value={role} />
          ))}
        </Picker>
      </View>

      {/* 사용자 목록 스크롤 뷰 */}
      <ScrollView>
        {filteredUserData.map((user, index) => (
          <View key={index} style={styles.userInfoBox}>
            <View style={styles.imageArea}> 
              <Image style={styles.image} source={{ uri: `${config.serverUrl}/${user.profilePhoto}` }} />
            </View>
            <View style={styles.userInfoArea}>
              <View style={styles.userInfo}>
                <Text style={styles.name}>{user.student_name}</Text>
                <Text style={styles.id}>{user.id}</Text>
                <Text style={styles.department}>{user.department_name}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={[styles.report, user.report_confirm > 3 && { color: 'red' }]}>
                  신고누적횟수 : {user.report_confirm}회
                </Text>
                <Text style={[styles.admin, { color: getRoleColor(user.title) }]}>
                  {user.title}
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
            {selectedUser && selectedUser.user_id === user.user_id && (
                <View style={styles.dropdown}>
                  <TouchableOpacity style={styles.dropdownItem} onPress={handleReportCheck}>
                    <Text style={styles.dropdownText}>경고주기</Text>
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
