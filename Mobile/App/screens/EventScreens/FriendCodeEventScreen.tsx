import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData, UserHaveCouponData } from '../../types/type'
import config from '../../config';
import Clipboard from '@react-native-clipboard/clipboard'; 

const width = Dimensions.get("window").width;
const friendsinvitepng = require('../../assets/friend3.png');
const registerFriend = 3

const FriendCodeEventScreen = ({ route }: any) => {
  const { userdata } = route.params;
  const [friendCode, setFriendCode] = useState('');
  const [userData, setUserData] = useState<UserData>(userdata);
  const [userInviteNum, setuserInviteNum]: any = useState([]);
  const [aram_user_pk, set_aram_user_pk]: any = useState();
  const [last_friendcode_Info, set_friendcode_Info]: any = useState();

  useFocusEffect(
    React.useCallback(() => {
      setUserData(userdata);
      get_invite_num();
    }, [])
  );

  const duplication = () => {
    Alert.alert(
      "친구코드 입력 실패",
      "해당 친구를 이미 등록하셨습니다!",
      [
        { text: "확인" }
      ]
    );
  };

  const ismycode = () => {
    Alert.alert(
      "친구코드 입력 실패",
      "자기 자신을 입력 할 수 없습니다!",
      [
        { text: "확인" }
      ]
    );
  };

  const success = () => {
    Alert.alert(
      "친구코드 입력 성공",
      "성공적으로 친구코드를 등록 하셨습니다!                  100포인트 적립!!",
      [
        {
          text: "확인",
          onPress: () => {

          }
        }
      ]
    );
  };

  const no_code = () => {
    Alert.alert(
      "친구코드 입력 실패",
      "해당 친구코드가 존재하지 않습니다!",
      [
        { text: "확인" }
      ]
    );
  };

  const get_invite_num = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_invite_num`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_code: userData.friend_code
        }),
      })
      const invite = await response.json();

      setuserInviteNum(invite);
      //console.log(invite);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const last_friendCode_Info = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5초 후에 요청 중단
  
      const response = await fetch(`${config.serverUrl}/last_friendCode_Info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_pk: userData.user_pk
        }),
        signal: controller.signal, // signal 옵션 추가
      });
  
      clearTimeout(timeoutId); // 요청이 완료되면 타임아웃 클리어
  
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
  
      const aram_data = await response.json();
      console.log(aram_data.friend_code);
      console.log(aram_data.friend_code_id);
      console.log(aram_data.my_name);
      
      await addFriendCodeAram(aram_data.friend_code, aram_data.friend_code_id, aram_data.my_name);
    } catch (error : any) {
      if (error.name === 'AbortError') {
        //console.error('요청이 타임아웃되었습니다');
      } else {
        console.error(error);
      }
    }
  };

  const user_update_point = async () => {

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${config.serverUrl}/user_update_point_3`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          point: 100
        })
      })
      console.log("포인트 올리기 성공")
      clearTimeout(timeoutId);
    } catch (error) {
      console.error('포인트 올리기 실패', error);
    }
  }

  const addFriendCodeAram = async (friend_code : any, friend_code_id : any, my_name : any) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2초 후에 요청 중단
  
      const response = await fetch(`${config.serverUrl}/addFriendCodeAram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          friend_code: friend_code,
          friend_code_id: friend_code_id,
          my_name: my_name,
        }),
        signal: controller.signal, // signal 옵션 추가
      });
  
      clearTimeout(timeoutId); // 요청이 완료되면 타임아웃 클리어
      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }
      console.log("알림전송!");
    } catch (error : any) {
      if (error.name === 'AbortError') {
        //console.error('요청이 타임아웃되었습니다');
      } else {
        console.error('알람 전송 실패', error);
      }
    }
  };

  const check_end_send = async () => {
    let result = ""
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${config.serverUrl}/check_end_send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          friend_code: friendCode,
          user_name: userData.name
        }),
      })
      const check_end_send = await response.json();
      if (check_end_send.success == "중복코드") {
        return result = "중복"
      } else if (check_end_send.success == "성공") {
        last_friendCode_Info();
        user_update_point();
        userData.point = userData.point + 100
        return result = "성공"
      } else if (check_end_send.success == "코드없음") {
        return result = "코드X"
      }
      clearTimeout(timeoutId);
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  const copyToClipboard = () => {
    Clipboard.setString(userData.friend_code);
    ToastAndroid.show('친구 코드가 클립보드에 복사되었습니다.', ToastAndroid.SHORT);
  }

  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setFriendCode(clipboardContent);
  }

  const registerFriendCode = async () => {
    if (userData.friend_code == friendCode) {
      ismycode();
    } else {
      const result = await check_end_send();
      if (result == '중복') {
        duplication();
      } else if (result == '성공') {
        success();
      } else if (result == '코드X') {
        no_code();
      } else {
        console.log("???????????")
      }
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.circleArea}>
          <View style={styles.imageArea}>
            <Image style={styles.image} source={friendsinvitepng} />
          </View>
          <Text style={styles.circleText}>초대 된 친구</Text>
          <Text style={styles.circleNum}>{userInviteNum.length}</Text>
        </View>
        <TouchableOpacity onPress={copyToClipboard}>
          <View style={styles.mycodeArea}>
            <Text style={styles.mycodeText}>초대코드 </Text>
            <Text style={styles.mycode}>[ {userData.friend_code} ]</Text>
            <Text style={styles.mycodeText}> 복사하기</Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.inputcode}>
        <TextInput
          style={styles.input}
          onChangeText={setFriendCode}
          value={friendCode}
          placeholder="친구 코드 입력"
          placeholderTextColor={'gray'}
        />
        <TouchableOpacity onPress={pasteFromClipboard}>
          <Icon name="paste" size={36} color={'black'} />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={registerFriendCode}>
        <View style={styles.register}>
          <Text style={styles.registerText}>등록하기</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  topArea: {
    borderBottomWidth: 1,
    marginVertical: 60
  },
  circleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: 350,
    height: 350,
    backgroundColor: 'lightpink',
    borderRadius: 180,
    elevation: 5,
  },
  imageArea: {
    alignSelf: 'center',
    width: 300,
    height: 180,
    //backgroundColor: 'red',
    position: 'absolute',
    top: -80
  },
  image: {
    flex: 1,
    width: 300,
    overflow: 'hidden',
    resizeMode: 'cover',
  },
  circleText: {
    color: 'white',
    fontSize: 34,
    fontWeight: 'bold',
    top: 40,
    textShadowRadius: 1
  },
  circleNum: {
    color: 'white',
    fontSize: 90,
    fontWeight: 'bold',
    top: 30,
    textShadowRadius: 1
  },
  mycodeArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: 'pink',
    marginHorizontal: 20,
    marginVertical: 20
  },
  mycodeText: {
    color: 'black',
    fontSize: 22,
  },
  mycode: {
    color: 'pink',
    fontSize: 22,
  },
  inputcode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  input: {
    height: 40,
    width: width * 0.6,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: -5,
    color: 'black',
    paddingHorizontal: 10,
    padding: -5,
    marginHorizontal: 10,
    fontSize: 18
  },
  register: {
    padding: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'lightblue'
  },
  registerText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default FriendCodeEventScreen;
