import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, RefreshControl, TouchableHighlight, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import config from '../../config';
import { UserData, aramData, EventData } from '../../types/type'

const bellpng = require('../../assets/bell.png'); // 기본 알람 이미지
const announcementpng = require('../../assets/announcement.png'); // 공지사항 알람 이미지
const commentpng = require('../../assets/comment.png'); // 댓글 알람 이미지
const eventpng = require('../../assets/event.png'); // 이벤트 알람 이미지

import IconB from 'react-native-vector-icons/AntDesign';
import IconA from 'react-native-vector-icons/Fontisto';
import IconC from 'react-native-vector-icons/Ionicons';
import IconD from 'react-native-vector-icons/Entypo';
import IconE from 'react-native-vector-icons/FontAwesome5';
import IconF from 'react-native-vector-icons/MaterialCommunityIcons';


const AlarmDialogScreen = ({ route, navigation }: any) => {
  const { userdata } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [aramList, setAaramList] = useState<aramData[]>([]);

  useFocusEffect(
    React.useCallback(() => {
        const fetchData = async () => {
            try {
              setUserData(userdata);
              await get_aram_data();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [])
);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);


  const Get_One_Event_Data = async (event_id: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/Get_One_Event_Data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event_id,
        }),
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      const eventData = await response.json();
      const eventImage = await GetEditEventImage(eventData.event_id);
      const eventWithImage = {
        ...eventData,
        event_photo: eventImage
      };

      return (eventWithImage);
      //console.log(JSON.stringify(eventWithImage, null, 2));
    } catch (error) {
      return null;
      console.error(error);
    }
  };

  //이벤트 이미지 가져오기
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

  const get_aram_data = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_aram_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk
        })
      })
      const get_aram_data = await response.json();
      //console.log(get_aram_data);
      setAaramList(get_aram_data);
    } catch (error) {
      console.error('알람 정보 가져오기 실패:', error);
    }
  }

  const go_post_detail = async (post_id: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/go_post_detail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_id
        })
      })
      const get_post_detail = await response.json();
      return get_post_detail;
    } catch (error) {
      console.error('알람 정보 가져오기 실패:', error);
    }
  }

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

  const delete_aram_data = (aram_id: number) => {
    Alert.alert(
      "알람 삭제",
      "알람을 정말로 삭제하시겠습니까??",
      [
        {
          text: "취소",
          onPress: () => console.log("취소 클릭"),
          style: "cancel"
        },
        {
          text: "확인", onPress: async () => {
            //console.log(aram_id);
            await deleteMyaram(aram_id);
            delete_aram()
          }
        }
      ]
    );
  };

  const deleteMyaram = async (aram_id: number) => {
    try {
      const response = await fetch(`${config.serverUrl}/deleteMyaram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          aram_id: aram_id
        }),
      })
      const postsdata = await response.json();
      await get_aram_data();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const delete_aram = () => {
    Alert.alert(
      "알람 삭제 성공!",
      "알람 성공적으로 삭제 하였습니다!",
      [
        { text: "확인" }
      ]
    );
  };

  /*
    const handleLongPress = (index : any) => {
      Alert.alert(
        '알림 삭제',
        '이 알림을 삭제하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          { text: '삭제', onPress: () => deleteItem(index) },
  
        ],
        { cancelable: true }
      );
    };
    */

  /*
  const deleteItem = (index :any) => {
    setAram(prevAram => prevAram.filter((_, i) => i !== index));
  };
  */
  const go_detail_screen1 = (postList: any) => {
    const item = postList[0];
    navigation.navigate("PostDetailScreen", { item, userData });
  }
  const go_detail_screen2 = (postList: any) => {
    const item = postList[0];
    navigation.navigate("PostDetailScreen", { item, userData });
  }
  const go_detail_screen3 = (postList: any) => {
    const item = postList[0];
    navigation.navigate("NoticePostDetailScreen", { item, userData });
  }
  const go_detail_screen4 = (postList: any) => {
    const item = postList[0];
    navigation.navigate("NoticePostDetailScreen", { item, userData });
  }
  const go_detail_screen5 = (postList: any) => {
    const item = postList[0];
    navigation.navigate("PostDetailScreen", { item, userData });
  }
  const go_detail_screen6 = (postList: any) => {
    const item = postList[0];
    //console.log(item);
    navigation.navigate("PostDetailScreen", { item, userData });
  }
  const go_detail_screen7 = (postList: any) => {
    const item = postList[0];
    //console.log(item);
    navigation.navigate("PostDetailScreen", { item, userData });
  }

  const NavigationPage = async (item2: aramData) => {
    switch (item2.target_type) {
      case 'my_post_comment':  // 내 게시물 댓글
        const postList1 = await go_post_detail(item2.post_comment_id);
        await view_count_up(item2.post_comment_id);
        go_detail_screen1(postList1);
        break;
      case 'hot_post': // 핫 게시물
        const postList2 = await go_post_detail(item2.hot_post_id);
        await view_count_up(item2.hot_post_id);
        go_detail_screen2(postList2);
        break;
      case 'school_notice': // 학교 공지사항
        const postList3 = await go_post_detail(item2.school_notice_id);
        await view_count_up(item2.school_notice_id);
        //console.log(postList3)
        go_detail_screen3(postList3);
      case 'department_notice': // 학과 공지사항
        const postList4 = await go_post_detail(item2.department_notice_id);
        await view_count_up(item2.department_notice_id);
        go_detail_screen4(postList4);
        break;
      case 'my_post_like': // 내 게시물 좋아요
        const postList5 = await go_post_detail(item2.my_post_like_id);
        await view_count_up(item2.my_post_like_id);
        go_detail_screen5(postList5);
        break;
      case 'new_event': // 새 이벤트
        const eventData: EventData | null = await Get_One_Event_Data(item2.new_event_id);
        if (eventData) {
          navigation.navigate("DeadlineEventScreen", { userdata: userData, eventdata: eventData });
        } else {
          Alert.alert("이벤트 마감 및 삭제",
            `해당 이벤트는 마감되었거나 삭제되었습니다! 
다음 이벤트를 노려주세요.`);
        }
        break;
      case 'report_post': // 신고
        const postList6 = await go_post_detail(item2.report_post_id);
        //console.log(postList6);
        //console.log(postList6.report_comment_title);
        go_detail_screen6(postList6);
        break;
      case 'report_comment': // 신고 댓글
        const postList7 = await go_post_detail(item2.report_comment_id);
        //console.log(postList7.report_comment_title);
        go_detail_screen7(postList7);
        break;
      default:
        //console.log("이동 드가자");
    }
  };

  const renderTargetContent = (item: aramData) => {
    switch (item.target_type) {
      case 'my_post_comment':
        return <Text style={styles.content}>{item.post_comment_title}</Text>
      case 'hot_post':
        return <Text style={styles.content}>{item.hot_post_title}</Text>
      case 'school_notice':
        return <Text style={styles.content}>{item.school_notice_title}</Text>
      case 'department_notice':
        return <Text style={styles.content}>{item.department_notice_title}</Text>
      case 'my_post_like':
        return <Text style={styles.content}>{item.my_post_like_title}</Text>
      case 'new_event':
        return <Text style={styles.content}>{item.new_event_name}</Text>
      case 'friend_code':
        return <Text style={styles.content}>{item.friend_code_my_name}님이 코드를 입력했습니다</Text>
      case 'report_post':
        return <Text style={styles.content}>{item.report_post_title}</Text>
      case 'report_comment':
        return <Text style={styles.content}>{item.report_comment_title}</Text>
      case 'good_event':
        return <Text style={styles.content}>{item.good_event_name}</Text>
      default:
        return null;
    }
  }

  const renderTargetIcon = (item: aramData) => {
    switch (item.target_type) {
      case 'my_post_comment':
        return <Text style={{ color: '#F29F05' }}><IconD name={"chat"} size={30} /></Text>
      case 'hot_post':
        return <Text style={{ color: 'red' }}><IconA name={"fire"} size={30} /></Text>
      case 'school_notice':
        return <Text style={{ color: '#F29F05' }}><IconD name={"megaphone"} size={30} /></Text>
      case 'department_notice':
        return <Text style={{ color: '#F29F05' }}><IconD name={"megaphone"} size={30} /></Text>
      case 'my_post_like':
        return <Text style={{ color: '#F29F05' }}><IconB name={"like1"} size={30} /></Text>
      case 'new_event':
        return <Text style={{ color: '#F29F05' }}><IconD name={"mail"} size={30} /></Text>
      case 'friend_code':
        return <Text style={{ color: '#F29F05' }}><IconE name={"user-friends"} size={30} /></Text>
      case 'report_post':
        return <Text style={{ color: '#F29F05' }}><IconE name={"exclamation"} size={30} /></Text>
      case 'report_comment':
        return <Text style={{ color: '#F29F05' }}><IconE name={"exclamation"} size={30} /></Text>
      case 'good_event':
        return <Text style={{ color: '#F29F05' }}><IconF name={"emoticon-happy"} size={30} /></Text>
      default:

        return null;
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.view}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {aramList.map((item, index) => (
          <View key={index} style={{ alignItems: 'center' }}>
            <TouchableHighlight style={{ width: '90%' }}
              underlayColor="#BBBBBB"
              onPress={() => NavigationPage(item)}
              onLongPress={() => delete_aram_data(item.aram_id)}>
              <View style={styles.box}>
                <View style={styles.imagearea}>
                  {renderTargetIcon(item)}
                </View>
                <View style={styles.textArea}>
                  <Text style={styles.theme}>{item.title}</Text>
                  {renderTargetContent(item)}
                  <Text style={styles.time}>{item.time}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  box: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  imagearea: {
    width: 60,
    height: 60,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#FFDECF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    //elevation : 5,
  },
  image: {
    flex: 0.8,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textArea: {
    marginLeft: 10,
  },
  theme: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 16,
    color: 'dimgray',
  },
  time: {
    fontSize: 15,
    color: 'grey',
  },
  bottomarea: {
    width: '100%',
    height: 90,
  }
});

export default AlarmDialogScreen;
