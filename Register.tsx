import React, { useState } from 'react';
import { StyleSheet, View, Image, Text, TextInput, TouchableOpacity, Alert} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import firestore from '@react-native-firebase/firestore'
import {signIn, signUp} from './lib/auth'
import {createUser} from './lib/user'

const Register = () => {
  const navigation = useNavigation(); 
  const [username, setUsername] = useState('');
  const [usernickname, setUsernickname] = useState('');
  const [userpass, setUserpass] = useState('');
  const [userconfirmpass, setUserconfirmpass] = useState('');

  const SignSuccess = async () => {
    try{
      await createUser({
        username,
        userpass,
        usernickname,
      })
      Alert.alert('회원가입 성공');
      navigation.navigate('로그인');
    }catch(error){
      Alert.alert('회원가입 실패');
    }
}

  
  return (
    <View style={styles.container}>
      <Image style={styles.Img} source={require('./assets/logoImg.png')}/>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="닉네임"
        value={usernickname}
        onChangeText={(text) => setUsernickname(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={userpass}
        onChangeText={(text) => setUserpass(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 확인"
        secureTextEntry={true}
        value={userconfirmpass}
        onChangeText={(text) => setUserconfirmpass(text)}
      />

      <TouchableOpacity style={styles.signBtn} onPress={SignSuccess}>
        <Text>회원가입</Text>
      </TouchableOpacity>
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDECF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding : 30,
  },

  Img :{
    width : 80,
    height : 56,
    margin: 100,
    marginBottom : 30,
  },

  ContainerBox:{
    flexDirection: 'row',
    width : 31,
    paddingBottom : 20,
  },    

  Checkbox:{
    paddingLeft : 25,
  },
  input :{
    width : 300,
    height : 45,
    margin : 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius : 5,
    paddingLeft : 10,
  },
  signBtn:{
    width: 300,
    height : 40,
    backgroundColor : '#3498db',
    borderWidth:1,
    borderRadius:5,
    borderColor:'gray',
    alignItems : 'center',
    paddingTop: 8,
    fontWeight : 'bold',
    margin: 20, 
  }
});

export default Register;
