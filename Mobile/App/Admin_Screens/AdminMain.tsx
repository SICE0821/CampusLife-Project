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

import IconB from 'react-native-vector-icons/AntDesign';
import IconD from 'react-native-vector-icons/Feather';
import IconE from 'react-native-vector-icons/Ionicons';
import IconF from 'react-native-vector-icons/Fontisto';
import IconG from 'react-native-vector-icons/MaterialCommunityIcons';
import IconH from 'react-native-vector-icons/Foundation';
import IconI from 'react-native-vector-icons/FontAwesome5';

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

const AdminMain = ({ navigation, route }: any) => {
  const { userdata, LectureData } = route.params;
  const [schoolpostdata, setschollpostdata] = useState<PostData[]>([]);
  const [departmentpostdata, setdepartmentpostdata] = useState<PostData[]>([]);
  const [hotpostdata, sethotpostdata] = useState<PostData[]>([]);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [eventData, setEventData] = useState<EventData[]>([]);
  const [Userdepartment, setUserDepartment] = useState();
  const fileUri = `${config.serverUrl}/${userData.profile_photo}.png`;

  /** 기본 이벤트 정보 */
  const initialEvents = [
    {
      screen: "AttendanceCheckEventScreen",
      imageSource: "1718551969957-1718551969312_12",
      label: "출석체크 이벤트!",
      info: "앱을 정기적으로 출석할 시에 포인트를 제공해 드립니다!",
      params: {}
    },
    {
      screen: "FriendCodeEventScreen",
      imageSource: "1718551983124-1718551982503_12",
      label: "친구코드 이벤트!",
      info: "친구에게 나의 코드를 보낼시에 포인트를 제공해 드립니다!",
      params: {}
    },
  ];

  /** eventData 배열을 풀어서 기존 이벤트 배열에 추가 */
  const allEvents = [
    ...initialEvents,
    ...eventData.map(event => ({
      screen: "DeadlineEventScreen",
      label: event.name,
      info: event.simple_info,
      imageSource: event.event_photo[0].event_photo,
      params: { userdata: userData, eventdata: event }
    })),
  ];

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
      //console.log("포스트 View 올리기 성공!")
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
      //console.log(formData);
      //uploadImages(formData);
    });
  };

  const uploadImages = async (formData: FormData) => {
    try {
      const response = await fetch(`${config.serverUrl}/upload`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        //console.log('Images uploaded successfully');
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
      const response = await fetch(`${config.serverUrl}/MainPageSchoolPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
        })
      })
      const data = await response.json();
      setschollpostdata(data);
    } catch (error) {
      console.error('유저 학과 이름 가져오기 실패:', error);
    }
  }

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
  const settingUserData = () => {
    setUserData(userdata);
  }


  const fetchhotpostData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/MainPagehotPost`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
        })
      })
      const data = await response.json();
      sethotpostdata(data);
    } catch (error) {
      console.error('유저 학과 이름 가져오기 실패:', error);
    }
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
  /** 이벤트 이미지 가져오기 */
  const GetEditEventImage = async (event_id: number) => {
    try {
      const response = await fetch(`${config.serverUrl}/GetEditEventImage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event_id
        }),
      })
      const data = await response.json();
      //console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    } finally {
    }
  }


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
      const eventData = await response.json();
      const eventsWithImages = await Promise.all(eventData.map(async (event: any) => {
        const eventImage = await GetEditEventImage(event.event_id);
        return {
          ...event,
          event_photo: eventImage
        };
      }));
      setEventData(eventsWithImages);
      //console.log(JSON.stringify(eventsWithImages, null, 2));
    } catch (error) {
      console.error(error);
    }
  };



  const StudentInfo = async () => {
    //console.log(userData);
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
                  <Text style={styles.userInfo}>관리자/{userData.name}</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileBoxBottom}>
              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("ManagementUserScreen")}>
                <IconI style={styles.tabIcon} name="users" size={30} />
                <Text style={styles.tabText}>유저 관리</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("AdminStackNavigator")}>
                <IconD style={styles.tabIcon} name="shopping-cart" size={28} />
                <Text style={styles.tabText}>물품 등록</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("AlarmDialogScreen")}>
                <IconD style={styles.tabIcon} name="bell" size={30} />
                <Text style={styles.tabText}>알림</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={() => navigation.navigate("SchoolInfoScreen")}>
                <IconE style={styles.tabIcon} name="information-circle-outline" size={30} />
                <Text style={styles.tabText}>학교정보</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.tabButton} onPress={StudentInfo}>
                <IconB style={styles.tabIcon} name="idcard" size={30} />
                <Text style={styles.tabText}>정보변경</Text>
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
              {allEvents.map((event, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    navigation.navigate(event.screen, event.params)
                    //console.log(event.params)
                  }
                  }
                  style={styles.eventBox}>
                  <View style={styles.eventImageArea}>
                    <Image
                      style={styles.eventImage}
                      source={{ uri: `${config.photoUrl}/${event.imageSource}.png` }}
                    />
                  </View>
                  <View style={styles.eventTextArea}>
                    <Text style={styles.eventLabelText}>{event.label}</Text>
                    <Text style={styles.eventInfoText}>{event.info}</Text>
                  </View>
                </TouchableOpacity>
              ))}
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{schoolpostdata[0]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{schoolpostdata[1]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{schoolpostdata[2]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{schoolpostdata[3]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{schoolpostdata[4]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{departmentpostdata[0]?.title}</Text>
                  <IconH style={styles.postLabelIcon} name="burst-new" size={40} />
                </View>
                <View style={styles.postViewArea}>
                  <Text style={styles.postViewText}>{departmentpostdata[0]?.view}</Text>
                  <IconB style={styles.postViewIcon} name="eyeo" size={30} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.postLabelArea} onPress={async () => {
                await view_count_up(departmentpostdata[1].post_id);
                navigation.navigate("NoticePostDetailScreen", { item: departmentpostdata[1], userData })
              }}>
                <View style={styles.postLabelTextArea}>
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{departmentpostdata[1]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{departmentpostdata[2]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{departmentpostdata[3]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{departmentpostdata[4]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{hotpostdata[0]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{hotpostdata[1]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{hotpostdata[2]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{hotpostdata[3]?.title}</Text>
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
                  <Text style={styles.postLabelText}
                    numberOfLines={1}
                    ellipsizeMode="tail">{hotpostdata[4]?.title}</Text>
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

export default AdminMain;
