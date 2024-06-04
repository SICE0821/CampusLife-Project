import React, { useState } from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, TouchableOpacity, Clipboard, ToastAndroid, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

const width = Dimensions.get("window").width;
const friendsinvitepng = require('../../assets/friend3.png');
const mycode = 'ASDFG'
const registerFriend = 3

const FriendCodeEventScreen = () => {
  const [friendCode, setFriendCode] = useState('');

  const copyToClipboard = () => {
    Clipboard.setString(mycode);
    ToastAndroid.show('친구 코드가 클립보드에 복사되었습니다.', ToastAndroid.SHORT);
  }

  const pasteFromClipboard = async () => {
    const clipboardContent = await Clipboard.getString();
    setFriendCode(clipboardContent);
  }

  const registerFriendCode = async () => {

  }

  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.circleArea}>
          <View style={styles.imageArea}>
            <Image style={styles.image} source={friendsinvitepng} />
          </View>
          <Text style={styles.circleText}>초대 된 친구</Text>
          <Text style={styles.circleNum}>{registerFriend}</Text>
        </View>
        <TouchableOpacity onPress={copyToClipboard}>
          <View style={styles.mycodeArea}>
            <Text style={styles.mycodeText}>초대코드 </Text>
            <Text style={styles.mycode}>[ {mycode} ]</Text>
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
  mycode:{
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
