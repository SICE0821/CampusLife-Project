import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import Swiper from 'react-native-swiper';
import { UserData, Lecture } from '../types/type'
import ImageCropPicker from 'react-native-image-crop-picker';
import config from '../config';

import IconA from 'react-native-vector-icons/MaterialIcons';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconD from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Fontisto';
import IconG from 'react-native-vector-icons/MaterialCommunityIcons';
import IconH from 'react-native-vector-icons/Foundation';
import IconI from 'react-native-vector-icons/FontAwesome5';

const attendancepng = require('../assets/handup.jpg');
const friendsinvitepng = require('../assets/friend3.jpg');
const volunteerpng = require('../assets/animation.gif');


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

type mainpagepostdata = {
  post_id: number,
  title: string,
  view: number,
}

type mainpagehptdata = {
  post_id: number,
  title: string,
  view: number,
  like: number,
}

type PostData = {
  post_id: number,
  title: string,
  contents: string,
  date: string,
  view: number,
  like: number,
  name: string,
  admin_check: boolean
}

const MainPage = ({ navigation, route }: any) => {
  const { userdata, LectureData } = route.params;
  const [schoolpostdata, setschollpostdata] = useState<PostData[]>([]);
  const [departmentpostdata, setdepartmentpostdata] = useState<PostData[]>([]);
  const [hotpostdata, sethotpostdata] = useState<PostData[]>([]);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [Userdepartment, setUserDepartment] = useState();
  const [imagepath, setimagepath] = useState<string>();
  const fileUri = `http://10.0.2.2:3000/${userData.profile_photo}`;



  const view_count_up = async (post_id: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/view_count_up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_id
        })
      })
      const result = await response.json();
      console.log("포스트 View 올리기 성공!")
    } catch (error) {
      console.error('포스트 View 올리기 누르기 실패', error);
    }
  }


  const getPhotos = async () => {
    ImageCropPicker.openPicker({
      multiple: true,
      mediaType: 'photo',
      includeBase64: true,
      includeExif: true,
    }).then(res => {
      const formData = new FormData();
      res.forEach(image => {
        formData.append('images', {
          uri: image.path,
          type: 'image/jpeg',
          name: `${Date.now()}_${image.filename || userData.user_pk}.png`,
        });
      });
      uploadImages(formData);
    });
  };

  const uploadImages = async (formData: FormData) => {
    try {
      const response = await fetch(`${config.serverUrl}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Images uploaded successfully');
      } else {
        console.error('Error uploading images');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const get_user_department = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_department_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_name: userData.department_pk,
        })
      })
      const userdepartment = await response.json();
      const userDepartment = userdepartment.userdepartment; //키값을 치면 값을 json에서 추출할 수 있다.
      setUserDepartment(userDepartment);
    } catch (error) {
      console.error('유저 학과 이름 가져오기 실패:', error);
    }
  }


  const fetchschoolpostData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/MainPageSchoolPost`);
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      setschollpostdata(data);
      //console.log("데이터 받음:", data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchdepartmentpostData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/MainPagedepartmentPost`);
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      setdepartmentpostdata(data);
      //console.log("데이터 받음:", data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchhotpostData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/MainPagehotPost`);
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      sethotpostdata(data);
      //console.log("데이터 받음:", data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };
  const settingUserData = () => {
    setUserData(userdata);

  }

  const get_user_point = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_user_point`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk
        })
      })
      const userPoint = await response.json();
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  }

  const StudentInfo = async () => {
    console.log(userData);
    navigation.navigate('StudentInfoNavigator', { userData, Userdepartment });
  }

  const AcademicInfo = async () => {
    navigation.navigate('AcademicInfoNavigator', { userData, LectureData });
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchschoolpostData();
      fetchdepartmentpostData();
      fetchhotpostData();
      settingUserData();
      get_user_department();
      get_user_point();
      if (navigation.getState().routes[navigation.getState().index].params?.updatedUserData) {
        const updatedUserData = navigation.getState().routes[navigation.getState().index].params.updatedUserData;
        setUserData(updatedUserData);
      }
    }, [navigation])
  )
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileArea}>
          <View style={styles.profileBox}>
            <View style={styles.profileBoxTop}>
              <TouchableOpacity onPress={() => getPhotos()} style={styles.profileImageArea}>
                {userData.profile_photo ? (
                  <Image source={{ uri: fileUri }} style={styles.profileImage} /> 
                ) : (
                  <IconI name="user" size={40} color="black" />
                )}
              </TouchableOpacity>
              <View style={styles.userInfoNPointArea}>
                <View style={styles.userInfoArea}>
                  <Text style={styles.userName}>{userData.name}</Text>
                  <Text style={styles.userInfo}>{Userdepartment}/{userData.grade}학년</Text>
                </View>
                <View style={styles.pointArea}>
                  <IconA style={styles.pointIcon} name="payments" size={36} />
                  <Text style={styles.userPoint}>{userData.point}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EventScreenStackNavigator")}>
                    <IconB name={"caretright"} size={22} style={styles.pointNavigationIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.profileBoxBottom}>
              <TouchableOpacity style={styles.tabButton} onPress={StudentInfo}>
                <IconB style={styles.tabIcon} name="idcard" size={30} />
                <Text style={styles.tabText}>정보변경</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={AcademicInfo}>
                <IconC style={styles.tabIcon} name="calendar-check-o" size={30} />
                <Text style={styles.tabText}>학적확인</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("AlarmDialogScreen")}>
                <IconD style={styles.tabIcon} name="bell" size={30} />
                <Text style={styles.tabText}>알림</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("SchoolInfoScreen")}>
                <IconE style={styles.tabIcon} name="information-circle-outline" size={30} />
                <Text style={styles.tabText}>학교정보</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("StudyRoomScreen")}>
                <IconF style={styles.tabIcon} name="prescription" size={30} />
                <Text style={styles.tabText}>스터디룸</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.eventArea}>
          <View style={styles.eventHead}>
            <Text style={styles.eventHeadText}>이벤트</Text>
            <IconF style={styles.eventHeadIcon} name="ticket" size={27} />
          </View>
          <View style={styles.eventSwipeArea}>
          <Swiper loop={true} removeClippedSubviews={false}>
            <TouchableOpacity
              onPress={() => navigation.navigate("AttendanceCheckEventScreen")}
              style={styles.eventBox}>
              <View style={styles.eventImageArea}>
                <Image style={styles.eventImage} source={attendancepng} />
              </View>
              <View style={styles.eventTextArea}>
                <Text style={styles.eventLabelText}>출석체크 이벤트!</Text>
                <Text style={styles.eventInfoText}>앱을 정기적으로 출석할 시에 포인트를 제공해 드립니다!</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.eventBox}
              onPress={() => navigation.navigate("FriendCodeEventScreen")}>
              <View style={styles.eventImageArea}>
                <Image style={styles.eventImage} source={friendsinvitepng} />
              </View>
              <View style={styles.eventTextArea}>
                <Text style={styles.eventLabelText}>친구코드 이벤트!</Text>
                <Text style={styles.eventInfoText}>친구에게 나의 코드를 보낼시에 포인트를 제공해 드립니다!</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("DeadlineEventScreen")}
              style={styles.eventBox}>
              <View style={styles.eventImageArea}>
                <Image style={styles.eventImage} source={volunteerpng} />
              </View>
              <View style={styles.eventTextArea}>
                <Text style={styles.eventLabelText}>봉사활동 이벤트!</Text>
                <Text style={styles.eventInfoText}>봉사활동을 하고 인증해주시면 포인트를 제공해 드립니다!</Text>
              </View>
            </TouchableOpacity>
            </Swiper>
          </View>
        </View>

        <View style={styles.postArea}>
          <View style={styles.postHeadArea}>
            <Text style={styles.postHeadText}>학교 공지사항</Text>
            <IconG style={styles.postHeadIcon} name="file-document-multiple" size={28}/>
          </View>

          <View style={styles.postBoxArea}>
            <View style={styles.postBox}>

            </View>
          </View>
        </View>

        <View style={styles.noticecontainer}>
          <View style={styles.noticeheader}>
            <Text style={styles.postHeadText}>학교 공지사항</Text>
            <IconG style={styles.postHeadIcon} name="file-document-multiple" size={28} />
            <TouchableOpacity onPress={() => {
              navigation.navigate('NoticeScreenStackNavigator', {
                screen: 'NoticePostTopTabNavigator',
                params: {
                  screen: '학교 공지사항'
                }
              });
            }}
              style={{ flexDirection: 'row', }}>
              <Text style={{ marginLeft: 130, fontSize: 17 }}>더보기</Text>
              <IconB name={"caretright"} size={17} style={{ top: 4 }} />
            </TouchableOpacity>
          </View>
          <View style={styles.noticetextcontainer}>
            <View style={styles.textborder}>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(schoolpostdata[0].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[0], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{schoolpostdata[0]?.title}</Text>
                  <Text style={{ marginLeft: 8, color: 'red' }}><IconH name="burst-new" size={40} /></Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{schoolpostdata[0]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(schoolpostdata[1].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[1], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{schoolpostdata[1]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{schoolpostdata[1]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(schoolpostdata[2].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[2], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{schoolpostdata[2]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{schoolpostdata[2]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(schoolpostdata[3].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[3], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{schoolpostdata[3]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{schoolpostdata[3]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(schoolpostdata[4].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[4], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{schoolpostdata[4]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{schoolpostdata[4]?.view}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.noticecontainer}>
          <View style={styles.noticeheader}>
            <Text style={styles.noticeheadertext}>학사 공지사항</Text>
            <Text style={{ marginTop: 15, marginLeft: 5, color: "#FFC700" }}><IconG name="file-document-multiple" size={28} /></Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('NoticeScreenStackNavigator', {
                screen: 'NoticePostTopTabNavigator',
                params: {
                  screen: '학과 공지사항'
                }
              });
            }}
              style={{ flexDirection: 'row' }}>
              <Text style={{ marginLeft: 130, marginTop: 25, fontSize: 17, }}>더보기</Text>
              <Text style={{ marginTop: 26 }}><IconB name={"caretright"} size={17} /></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noticetextcontainer}>
            <View style={styles.textborder}>
              <TouchableOpacity
                style={styles.onebox}
                onPress={async () => {
                  await view_count_up(departmentpostdata[0].post_id);
                  navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[0], userData })
                }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{departmentpostdata[0]?.title}</Text>
                  <Text style={{ marginLeft: 8, color: 'red' }}><IconH name="burst-new" size={40} /></Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{departmentpostdata[0]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(departmentpostdata[1].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[1], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{departmentpostdata[1]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{departmentpostdata[1]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(departmentpostdata[2].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[2], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{departmentpostdata[2]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{departmentpostdata[2]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(departmentpostdata[3].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[3], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{departmentpostdata[3]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{departmentpostdata[3]?.view}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(departmentpostdata[4].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[4], userData })
              }}>
                <View style={styles.oneboxtext}>
                  <Text style={styles.M}>{departmentpostdata[4]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -12 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{departmentpostdata[4]?.view}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.noticecontainer}>
          <View style={styles.noticeheader}>
            <Text style={styles.noticeheadertext}>인기글</Text>
            <Text style={{ marginTop: 15, marginLeft: 5, color: "red" }}><IconF name="fire" size={27} /></Text>
            <TouchableOpacity onPress={() => {
              navigation.navigate('CommunityScreenStackNavigator', {
                screen: 'PostTopTabNavigator',
                params: {
                  screen: '전체 게시판',
                  params: {
                    screen: 'HOT'
                  }
                }
              });
            }}
              style={{ flexDirection: 'row' }}>
              <Text style={{ marginLeft: 205, marginTop: 25, fontSize: 17, }}>더보기</Text>
              <Text style={{ marginTop: 26 }}><IconB name={"caretright"} size={17} /></Text>
            </TouchableOpacity>
          </View>
          <View style={styles.noticetextcontainer}>
            <View style={styles.textborder}>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(hotpostdata[0].post_id);
                navigation.navigate("PostDetailScreen", { item: hotpostdata[0], userData })
              }}>
                <View style={styles.fireoneboxtext}>
                  <Text style={styles.M}>{hotpostdata[0]?.title}</Text>
                  <Text style={{ marginLeft: 8, color: 'red' }}><IconH name="burst-new" size={40} /></Text>
                </View>
                <View style={styles.fireoneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -13 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[0]?.view} /</Text>
                  <Text style={{ color: '#F29F05' }}> <IconB name="like1" size={25} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[0]?.like} </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(hotpostdata[1].post_id);
                navigation.navigate("PostDetailScreen", { item: hotpostdata[1], userData })
              }}>
                <View style={styles.fireoneboxtext}>
                  <Text style={styles.M}>{hotpostdata[1]?.title}</Text>
                </View>
                <View style={styles.fireoneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -13 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[1]?.view} /</Text>
                  <Text style={{ color: '#F29F05' }}> <IconB name="like1" size={25} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[1]?.like} </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(hotpostdata[2].post_id);
                navigation.navigate("PostDetailScreen", { item: hotpostdata[2], userData })
              }}>
                <View style={styles.fireoneboxtext}>
                  <Text style={styles.M}>{hotpostdata[2]?.title}</Text>
                </View>
                <View style={styles.fireoneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -13 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[2]?.view} /</Text>
                  <Text style={{ color: '#F29F05' }}> <IconB name="like1" size={25} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[2]?.like} </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(hotpostdata[3].post_id);
                navigation.navigate("PostDetailScreen", { item: hotpostdata[3], userData })
              }}>
                <View style={styles.fireoneboxtext}>
                  <Text style={styles.M}>{hotpostdata[3]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -13 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[3]?.view} /</Text>
                  <Text style={{ color: '#F29F05' }}> <IconB name="like1" size={25} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[3]?.like} </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.onebox} onPress={async () => {
                await view_count_up(hotpostdata[4].post_id);
                navigation.navigate("PostDetailScreen", { item: hotpostdata[4], userData })
              }}>
                <View style={styles.fireoneboxtext}>
                  <Text style={styles.M}>{hotpostdata[4]?.title}</Text>
                </View>
                <View style={styles.oneboxeye}>
                  <Text style={{ color: '#F29F05', marginLeft: -13 }}> <IconB name="eyeo" size={30} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black' }}>{hotpostdata[4]?.view} /</Text>
                  <Text style={{ color: '#F29F05', fontSize: 17 }}> <IconB name="like1" size={25} /></Text>
                  <Text style={{ marginLeft: 2, color: 'black', fontSize: 17 }}>{hotpostdata[4]?.like} </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={{ height: 50, backgroundColor: 'white', }}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  profileArea: {
    alignSelf: 'center',
    width: width * 0.9,
    height: 190,
    marginVertical: 20
  },
  profileBox: {
    flex: 1,
    borderRadius: 20,
    elevation: 5,
  },
  profileBoxTop: {
    backgroundColor: '#FFFADD',
    width: '100%',
    height: '65%',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    borderBottomWidth: 1,
    borderColor: 'gray',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  profileImageArea: {
    width: 85,
    height: 85,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'lightgray',
    marginLeft: 35,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 85,
    height: 85,
    borderRadius: 50,
  },
  userInfoNPointArea: {
    flexDirection: 'column',
    marginLeft: 40
  },
  userInfoArea: {
    flexDirection: 'column',
    maxWidth: width * 0.5
  },
  userName: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
  userInfo: {
    color: 'black',
    fontSize: 15,
  },
  pointArea: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  pointIcon: {
    color: 'black',
  },
  userPoint: {
    color: 'black',
    fontSize: 24,
    marginHorizontal: 5
  },
  pointNavigationIcon: {
    color: 'black'
  },
  profileBoxBottom: {
    backgroundColor: 'white',
    height: '35%',
    borderBottomStartRadius: 20,
    borderBottomEndRadius: 20,
    flexDirection: 'row',
  },
  tabButton: {
    //backgroundColor: 'red',
    width: '20%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  tabIcon: {
    color: 'black',
    marginVertical: 2
  },
  tabText: {
    color: 'black',
    fontSize: 15
  },
  eventArea: {
    width: width,
    alignSelf: 'center',
    marginVertical: 5
  },
  eventHead: {
    width: width*0.85,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginVertical: 10
  },
  eventHeadText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  eventHeadIcon: {
    color: '#FFC700',
    marginHorizontal: 5
  },
  eventSwipeArea: {
    width: '100%',
    height: 440,
  },
  eventBox: {
    backgroundColor: 'white',
    width: width*0.9,
    height: '90%',
    alignSelf: 'center',
    borderRadius: 20,
    elevation: 5,
  },
  eventImageArea: {
    width: '100%',
    height: '75%',
  },
  eventImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'contain',
  },
  eventTextArea: {
    width: '100%',
    height: '25%',
    padding:  15
  },
  eventLabelText: {
    color: 'black',
    fontSize: 20, 
    fontWeight: 'bold',
  },
  eventInfoText: {
    color: 'black',
    fontSize: 14,
    marginVertical: 5
  },
  postArea: {
    backgroundColor: 'red',
    width: width,
    alignItems: 'center',
    marginHorizontal: 10
  },
  postHeadArea: {
    backgroundColor: 'yellow',
    width: width*0.9,
    flexDirection: 'row'
  },
  postHeadText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  postHeadIcon: {
    color: "#FFC700",
    marginHorizontal: 10
  },


  postBoxArea: {
    backgroundColor: 'green',
    width: width*0.9,
    height: 400
  },
  postBox: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    elevation: 5
  },

  cardView: {
    height: 230,
    //backgroundColor : '#EDA332',
  },

  card: {
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 20,
    //borderWidth: 2,
    borderColor: 'black',
    //backgroundColor : 'blue',
    elevation: 5,

  },

  cardtop: {
    flex: 0.6,
    flexDirection: "row",
    //backgroundColor : '#FF9C63',
    backgroundColor: '#FFFADD',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomWidth: 0.5,
    borderColor: 'F0EEEE',
  },

  cardbottom: {
    flex: 0.4,
    flexDirection: 'row',
    //backgroundColor : '#FFDECF',
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },
  profile: {
    flex: 0.35,
    //backgroundColor : '#FF9C63',
    backgroundColor: '#FFFADD',
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',

  },

  profilePicture: {
    width: 85,
    height: 85,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',

  },

  info: {
    flex: 0.65,
    borderTopRightRadius: 20,
  },

  name: {
    flex: 0.4,
    justifyContent: 'center',
  },

  department: {
    flex: 0.2,
    justifyContent: 'center',
  },

  point: {
    flexDirection: 'row',
    flex: 0.4,
    alignItems: 'center',
    //backgroundColor : 'red'
  },

  cardchoice: {
    margin: 5,
    flex: 0.2, borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },


  noticecontainer: {
    height: 450,
    //marginTop: -50,
    //marginBottom : 15,
    //backgroundColor : 'green',
    marginLeft: 15,
    marginRight: 15,
  },

  noticeheader: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  noticeheadertext: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold'
  },

  noticetextcontainer: {
    //justifyContent : 'center',
    //alignItems : 'center',
    height: 350,
    backgroundColor: "blue"
  },

  textborder: {
    flex: 1,
    marginTop: 1,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 5,
    //borderWidth : 2,
  },

  onebox: {
    //backgroundColor : 'yellow',
    flex: 0.2,
    flexDirection: 'row',
    alignItems: 'center',

  },

  oneboxtext: {
    flex: 0.86,
    //backgroundColor : 'blue',
    flexDirection: 'row',
    alignItems: 'center',
  },

  oneboxeye: {
    flex: 0.14,
    //backgroundColor : 'green',
    flexDirection: 'row',
    alignItems: 'center',
  },

  fireoneboxtext: {
    flex: 0.73,
    //backgroundColor : 'blue',
    flexDirection: 'row',
    alignItems: 'center',
  },

  fireoneboxeye: {
    flex: 0.27,
    //backgroundColor : 'green',
    flexDirection: 'row',
    alignItems: 'center',
  },

  M: {
    marginLeft: 15,
    fontSize: 19,
    color: 'black',
  },

  eventcontainer: {
    height: 420,
    backgroundColor : 'green',
  },

  eventheadertext: {
    fontSize: 20,
    marginLeft: 23,
    color: 'black',
    fontWeight: 'bold'
  },

  eventbox: {
    flex: 1,
    //backgroundColor : 'red',
    margin: 20,
    marginTop: 4,
    borderRadius: 20,
    //borderWidth : 2,
    elevation: 5,
  },

  eventpicture: {
    flex: 0.75,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //borderBottomWidth : 2,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    //elevation: 5, 
  },

  eventtext: {
    backgroundColor: 'white',
    flex: 0.25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,

  },

  eventhearder: {
    flex: 0.08,
    //backgroundColor : 'red',
    flexDirection: 'row',
  }

});

export default MainPage;

