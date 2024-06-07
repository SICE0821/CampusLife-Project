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
} from 'react-native';
import Swiper from 'react-native-swiper';
import { UserData, EventData } from '../types/type'
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
const volunteerpng = require('../assets/MainPhoto_Event.png');

const width = Dimensions.get('window').width;

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
  const [eventData, setEventData] = useState<EventData>();
  const [Userdepartment, setUserDepartment] = useState();
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
      const response = await fetch(`${config.serverUrl}/MainPagedepartmentPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department_id: userData.department_pk
        }),
      })
      const data = await response.json();
      setdepartmentpostdata(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

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

  /*
  const Get_Event_Data = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/Get_Event_Data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
        })
      })
      const Event_Data = await response.json();
      console.log(Event_Data);
      setEventData(Event_Data);
    } catch (error) {
      console.error(error);
    }
  }
  */

  const Get_Event_Data = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/Get_Event_Data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
        }),
      });
  
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
  
      const eventData: EventData = await response.json();
  
      // photo_list 데이터를 가져오기 위한 추가 작업
      const photoResponse = await fetch(`${config.serverUrl}/Get_Photos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventData.event_id,
        }),
      });
  
      if (!photoResponse.ok) {
        throw new Error('사진 데이터 가져오기 실패');
      }
  
      const photoList = await photoResponse.json();
  
      const eventDataWithPhotos = {
        ...eventData,
        photo_list: photoList
      };
  
      console.log(eventDataWithPhotos);
      setEventData(eventDataWithPhotos);
    } catch (error) {
      console.error(error);
    }
  };



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
    Get_Event_Data();
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

            <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("StudyRoomStackNavigator")}>
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
              onPress={() => navigation.navigate("DeadlineEventScreen", {userdata : userData, eventdata : eventData})}
              style={styles.eventBox}>
              <View style={styles.eventImageArea}>
                <Image source={{ uri: `http://10.0.2.2:3000/${eventData?.event_photo}.png` }} style={styles.eventImage} />
              </View>
              <View style={styles.eventTextArea}>
                <Text style={styles.eventLabelText}>{eventData?.name}</Text>
                <Text style={styles.eventInfoText}>{eventData?.simple_info}</Text>
              </View>
            </TouchableOpacity>
          </Swiper>
        </View>
      </View>

      <View style={styles.postArea}>
        <View style={styles.postHeadArea}>
          <View style={styles.postHeadTextIconArea}>
            <Text style={styles.postHeadText}>학교 공지사항</Text>
            <IconG style={styles.postHeadIcon} name="file-document-multiple" size={28} />
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate('NoticeScreenStackNavigator', {
              screen: 'NoticePostTopTabNavigator',
              params: { screen: '학교 공지사항' }
            });
          }}
            style={styles.postDetailArea}>
            <Text style={styles.postDetailText}>더보기</Text>
            <IconB style={styles.postDetailIcon} name={"caretright"} size={17} />
          </TouchableOpacity>
        </View>
        <View style={styles.postBoxArea}>
          <View style={styles.postBox}>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(schoolpostdata[0].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[0], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{schoolpostdata[0]?.title}</Text>
                <IconH style={styles.postLabelIcon} name="burst-new" size={40} />
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[0]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(schoolpostdata[1].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[1], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{schoolpostdata[1]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[1]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(schoolpostdata[2].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[2], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{schoolpostdata[2]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[2]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(schoolpostdata[3].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[3], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{schoolpostdata[3]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[3]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(schoolpostdata[4].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: schoolpostdata[4], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{schoolpostdata[4]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[4]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.postArea}>
        <View style={styles.postHeadArea}>
          <View style={styles.postHeadTextIconArea}>
            <Text style={styles.postHeadText}>학사 공지사항</Text>
            <IconG style={styles.postHeadIcon} name="file-document-multiple" size={28} />
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate('NoticeScreenStackNavigator', {
              screen: 'NoticePostTopTabNavigator',
              params: { screen: '학과 공지사항' }
            });
          }}
            style={styles.postDetailArea}>
            <Text style={styles.postDetailText}>더보기</Text>
            <IconB style={styles.postDetailIcon} name={"caretright"} size={17} />
          </TouchableOpacity>
        </View>
        <View style={styles.postBoxArea}>
          <View style={styles.postBox}>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(departmentpostdata[0].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[0], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{departmentpostdata[0]?.title}</Text>
                <IconH style={styles.postLabelIcon} name="burst-new" size={40} />
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{schoolpostdata[0]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(departmentpostdata[1].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[1], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{departmentpostdata[1]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{departmentpostdata[1]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(departmentpostdata[2].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[2], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{departmentpostdata[2]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{departmentpostdata[2]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(departmentpostdata[3].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[3], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{departmentpostdata[3]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{departmentpostdata[3]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(departmentpostdata[4].post_id);
              navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[4], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{departmentpostdata[4]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{departmentpostdata[4]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.postArea}>
        <View style={styles.postHeadArea}>
          <View style={styles.postHeadTextIconArea}>
            <Text style={styles.postHeadText}>인기글</Text>
            <IconF style={styles.postHeadIcon} name="fire" size={27} />
          </View>
          <TouchableOpacity onPress={() => {
            navigation.navigate('CommunityScreenStackNavigator', {
              screen: 'PostTopTabNavigator',
              params: { screen: '전체 게시판', params: { screen: 'HOT' } }
            });
          }}
            style={styles.postDetailArea}>
            <Text style={styles.postDetailText}>더보기</Text>
            <IconB style={styles.postDetailIcon} name={"caretright"} size={17} />
          </TouchableOpacity>
        </View>
        <View style={styles.postBoxArea}>
          <View style={styles.postBox}>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(hotpostdata[0].post_id);
              navigation.navigate("PostDetailScreen", { item: hotpostdata[0], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{hotpostdata[0]?.title}</Text>
                <IconH style={styles.postLabelIcon} name="burst-new" size={40} />
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{hotpostdata[0]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(hotpostdata[1].post_id);
              navigation.navigate("PostDetailScreen", { item: hotpostdata[1], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{hotpostdata[1]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{hotpostdata[1]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(hotpostdata[2].post_id);
              navigation.navigate("PostDetailScreen", { item: hotpostdata[2], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{hotpostdata[2]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{hotpostdata[2]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(hotpostdata[3].post_id);
              navigation.navigate("PostDetailScreen", { item: hotpostdata[3], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{hotpostdata[3]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{hotpostdata[3]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
              await view_count_up(hotpostdata[4].post_id);
              navigation.navigate("PostDetailScreen", { item: hotpostdata[4], userData })
            }}>
              <View style={styles.postLabelTextArea}>
                <Text style={styles.postLabelText}>{hotpostdata[4]?.title}</Text>
              </View>
              <View style={styles.postViewArea}>
                <Text style={styles.postViewText}>{hotpostdata[4]?.view}</Text>
                <IconB style={styles.postViewIcon} name="eyeo" size={30} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ height: 100, backgroundColor: 'white', }}></View>
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
  height: 190, // 상단 프로필 박스 영역
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
  height: '65%', // 상단 영역
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
  height: '35%', // 하단 영역
  borderBottomStartRadius: 20,
  borderBottomEndRadius: 20,
  flexDirection: 'row',
},
tabButton: { // 버튼
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
},
eventHead: {
  width: width * 0.85,
  alignSelf: 'center',
  alignItems: 'center',
  justifyContent: 'flex-start',
  flexDirection: 'row',
  marginVertical: 5
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
  height: 320, // 이벤트 스와이프 영역
},
eventBox: {
  backgroundColor: 'white',
  width: width * 0.9,
  height: '85%', // 이벤트 박스 영역
  alignSelf: 'center',
  borderRadius: 20,
  elevation: 5,
},
eventImageArea: {
  width: '100%',
  height: '70%', // 이벤트 사진 영역
},
eventImage: {
  flex: 1,
  width: '100%',
  resizeMode: 'contain',
},
eventTextArea: {
  width: '100%',
  height: '30%', // 이벤트 텍스트 영역
  padding: 15
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
  width: width,
  alignItems: 'center',
  marginVertical: 10
},
postHeadArea: {
  width: width * 0.85,
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginVertical: 5
},
postHeadTextIconArea: {
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
postDetailArea: {
  flexDirection: 'row',
  alignItems: 'center'
},
postDetailText: {
  color: 'black',
  fontSize: 17,
  marginHorizontal: 5
},
postDetailIcon: {
  color: 'black'
},
postBoxArea: {
  width: width * 0.9,
  height: 300 // 계시물 박스 영역
},
postBox: {
  backgroundColor: 'white',
  width: '100%',
  height: '100%',
  borderRadius: 20,
  elevation: 5
},
postLabelArea: {
  width: '100%',
  height: '20%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between'
},
postLabelTextArea: {
  flexDirection: 'row',
  alignItems: 'center',
  maxWidth: '80%'
},
postLabelText: {
  color: 'black',
  fontSize: 19,
  marginHorizontal: 15
},
postLabelIcon: {
  color: 'red',
  marginLeft: -5
},
postViewArea: {
  flexDirection: 'row-reverse',
  alignItems: 'center',
  maxWidth: '20%'
},
postViewIcon: {
  color: '#F29F05',
},
postViewText: {
  color: 'black',
  fontSize: 17,
  marginHorizontal: 5
},
});

export default MainPage;

