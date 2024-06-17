import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, RefreshControl, Dimensions } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import { UserData } from '../../types/type'
import config from '../../config';

type ReportUser = {
  reportId: number,
  report_name: string,
  post_id: number,
  department_check: boolean,
  user_id: number,
  title: string,
  contents: string,
  write_date: string,
  view: number,
  like: number,
  userStudentId: number,
  userTitle: string,
  post_writer: string,
  campusId: number,
  campusName: string,
  departmentId: number,
  writer_department: string,
  writer_profile: string,
};

type commentReport = {
  report_comment_id: number,
  comment_id: number,
  report_comment_name: string,
  contents: string,
  comment_date: string,
  comment_like: number,
  post_id: number,
  department_check: boolean,
  user_id: number,
  student_id: number,
  student_name: string,
  department_id: number,
  department_name: string
}

const width = Dimensions.get("window").width;

const ReportPostsScreen = ({ route, navigation }: any) => {
  const { userdata } = route.params;
  const ref = useRef(null);
  const [userReport, setUserReport] = useState<ReportUser[]>([]);
  const [userCommentReport, setUserCommentReport] = useState<commentReport[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [selectedCategory, setSelectedCategory] = useState('전체 게시판');
  const [selectedDepartment, setSelectedDepartment] = useState('컴퓨터소프트웨어과');
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState('게시글'); // New state for the new Picker

  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedType === '게시글') {
      await get_user_report();
    } else if (selectedType === '댓글') {
      await get_user_comment_report();
    }
    setTimeout(() => setRefreshing(false), 500);
  };

  const get_user_report = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getUserReportInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let data = await response.json();

      // Sort data in descending order based on write_date
      data.sort((a: ReportUser, b: ReportUser) => {
        return new Date(b.write_date).getTime() - new Date(a.write_date).getTime();
      });

      setUserReport(data);
      return data;
    } catch (error) {
      console.error('값 가져오기 실패:', error);
    }
  };

  const get_user_comment_report = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getUserCommentReportInfo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(`Network response was not ok: ${response.status} - ${errorDetails.message}`);
      }
  
      let data = await response.json();
      setUserCommentReport(data);
      return data;
    } catch (error) {
      console.error('값 가져오기 실패:', error);
    }
  };
  const get_department = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_department`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk
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


  useFocusEffect(
    useCallback(() => {
      get_user_report();
      get_department();
      get_user_comment_report();
    }, [])
  );

  console.log(userCommentReport);
  useEffect(() => {
    if (selectedCategory === '학과 게시판' && !selectedDepartment) {
      setSelectedDepartment(departments[0]);
    }
  }, [selectedCategory]);

  const renderEmptyItem = () => (
    <View style={{ height: 85 }} />
  );

  const renderItem = ({ item, index }: { item: ReportUser | commentReport, index: number }) => {
    if (selectedType === '게시글') {
      if ('title' in item) { // Check if item is of type ReportUser
        if (selectedCategory === '전체 게시판' && !item.department_check) {
          return (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("PostDetailScreen", { item, userData: userdata });
              }}>
                <View style={styles.writeboxcontainer}>
                  <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                      <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                      <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                      <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                    </View>
                  </View>
                  <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                      <Text
                        style={{
                          fontSize: 13,
                          marginLeft: 10,
                          color:
                            item.userTitle === "학교" ? 'red' :
                            item.userTitle === "반장" ? 'green' :
                            item.userTitle === "학우회장" ? 'blue' :
                            'black'
                        }}
                      >
                        {item.post_writer}
                      </Text>
                      <Text style={{ color: 'black' }}> | {item.write_date}</Text>
                      <Text style={{ color: 'black', fontSize: 13, paddingLeft: 20 }}>신고자 : {item.report_name}</Text>
                    </View>
                    <View style={styles.likenum}>
                      <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                      <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </GestureHandlerRootView>
          );
        } else if (selectedCategory === '학과 게시판' && item.department_check && item.writer_department === selectedDepartment) {
          return (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("PostDetailScreen", { item, userData: userdata });
              }}>
                <View style={styles.writeboxcontainer}>
                  <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                      <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                      <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                      <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                    </View>
                  </View>
                  <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                      <Text
                        style={{
                          fontSize: 13,
                          marginLeft: 10,
                          color:
                            item.userTitle === "학교" ? 'red' :
                            item.userTitle === "반장" ? 'green' :
                            item.userTitle === "학우회장" ? 'blue' :
                            'black'
                        }}
                      >
                        {item.post_writer}
                      </Text>
                      <Text style={{ color: 'black' }}> | {item.write_date}</Text>
                      <Text style={{ color: 'black', fontSize: 13, paddingLeft: 20 }}>신고자 : {item.report_name}</Text>
                    </View>
                    <View style={styles.likenum}>
                      <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                      <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </GestureHandlerRootView>
          );
        } else {
          return null; // Return null explicitly
        }
      }
    } else if (selectedType === '댓글') {
      if ('comment_id' in item) { // Check if item is of type commentReport
        if (selectedCategory === '전체 게시판' && !item.department_check) {
          return (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("PostDetailScreen", { item, userData: userdata });
              }}>
                <View style={styles.writeboxcontainer}>
                  <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                      <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.contents}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                      <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                      <Text style={{ color: 'black', marginLeft: 3 }}>{item.comment_like}</Text>
                    </View>
                  </View>
                  <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                      <Text style={{ fontSize: 13, marginLeft: 10, color: 'black' }}>
                        {item.student_name}
                      </Text>
                      <Text style={{ color: 'black' }}> | {item.comment_date}</Text>
                      <Text style={{ color: 'black', fontSize: 13, paddingLeft: 20 }}>신고자 : {item.report_comment_name}</Text>
                    </View>
                    <View style={styles.likenum}>
                      <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                      <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.comment_like}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </GestureHandlerRootView>
          );
        } else if (selectedCategory === '학과 게시판' && item.department_check && item.department_name === selectedDepartment) {
          return (
            <GestureHandlerRootView style={{ flex: 1 }}>
              <TouchableWithoutFeedback onPress={() => {
                navigation.navigate("PostDetailScreen", { item, userData: userdata });
              }}>
                <View style={styles.writeboxcontainer}>
                  <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                      <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.contents}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                      <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                      <Text style={{ color: 'black', marginLeft: 3 }}>{item.comment_like}</Text>
                    </View>
                  </View>
                  <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                      <Text style={{ fontSize: 13, marginLeft: 10, color: 'black' }}>
                        {item.student_name}
                      </Text>
                      <Text style={{ color: 'black' }}> | {item.comment_date}</Text>
                      <Text style={{ color: 'black', fontSize: 13, paddingLeft: 20 }}>신고자 : {item.report_comment_name}</Text>
                    </View>
                    <View style={styles.likenum}>
                      <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                      <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.comment_like}</Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </GestureHandlerRootView>
          );
        } else {
          return null; // Return null explicitly
        }
      }
    }
    return null; // Return null explicitly
  };
  
  return (
    <View style={styles.container} ref={ref}>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedType(itemValue)}
        >
          <Picker.Item label="게시글" value="게시글" />
          <Picker.Item label="댓글" value="댓글" />
        </Picker>
        <Picker
          selectedValue={selectedCategory}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSelectedCategory(itemValue);
            if (itemValue === '학과 게시판') {
              setSelectedDepartment(departments[0]);
            }
          }}
        >
          <Picker.Item label="전체 게시판" value="전체 게시판" />
          <Picker.Item label="학과 게시판" value="학과 게시판" />
        </Picker>
        {selectedCategory === '학과 게시판' && (
          <Picker
            selectedValue={selectedDepartment}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
          >
            {departments.map((department, index) => (
              <Picker.Item key={index} label={department} value={department} />
            ))}
          </Picker>
        )}
      </View>
      <FlatList
        style={styles.flatliststyle}
        data={selectedType === '게시글' ? userReport : userCommentReport}
        renderItem={renderItem}
        ListFooterComponent={renderEmptyItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'white',
  },
  picker: {
    flex: 1,
  },
  flatliststyle: {
    // marginTop: 40,
  },
  writeboxcontainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    height: 70,
  },
  writetitle: {
    flex: 0.6,
    flexDirection: 'row',
    marginTop: 5,
  },
  wirterandtime: {
    flex: 0.4,
    flexDirection: 'row',
  },
  titlebox: {
    flex: 0.85,
  },
  eyesnum: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  writerbox: {
    flex: 0.85,
    flexDirection: 'row',
  },
  likenum: {
    flex: 0.15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
  },
});

export default ReportPostsScreen;
