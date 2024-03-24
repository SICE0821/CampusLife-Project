import React, { useState } from 'react';
import { StyleSheet, 
Image, 
Text, 
View, 
TextInput, 
TouchableOpacity, 
StatusBar,
} from 'react-native';
import 'react-native-gesture-handler';
import BouncyCheckbox from "react-native-bouncy-checkbox";

function LoginScreen({ navigation}: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
  
    const handleLogin = async () => {
      navigation.navigate('MainTabNavigator');
    /*
      try {
        const response = await fetch('http://172.16.117.26:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });
        const data = await response.text();
        if (data === 'success') {
          Alert.alert('로그인 성공');
        } else {
          Alert.alert('아이디 또는 비밀번호가 일치하지 않습니다');
        }
      } catch (error) {
        console.error('로그인 오류:', error);
        Alert.alert('로그인 오류');
      }
    */
    };
    
  
  
    const navigateToRegister = () => {
      navigation.navigate('RegisterPage');
    };
  
    const navigateToSearch = () => {
      navigation.navigate('SearchPage')
    };
  
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../../assets/logo.png')} />
  
        <Text style={styles.appintroduce}>
          학교를 더 즐겁게! {"\n"} 
          다양한 활동과 소식을 손쉽게 확인하는 어플!
        </Text>
  
        <TextInput
          style={styles.input}
          placeholder="아이디"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
  
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
  
      <View style={styles.ContainerBox}>
        <BouncyCheckbox
          style={styles.Checkbox}
          size={25}
          fillColor="black"
          unfillColor="#FFFFFF"
          text="아이디 저장"
          iconStyle={{ borderColor: "black" }}
          textStyle={{ fontFamily: "JosefinSans-Regular", textDecorationLine: "none", }}
          onPress={(isChecked: boolean) => {}}
        />
  
        <BouncyCheckbox
          style={styles.Checkbox}
          size={25}
          fillColor="black"
          unfillColor="#FFFFFF"
          text="자동 로그인"
          iconStyle={{ borderColor: "black" }}
          textStyle={{ fontFamily: "JosefinSans-Regular", textDecorationLine: "none", }}
          onPress={(isCheckedAutoLogin: boolean) => {}}
        />
      </View>
      
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={navigateToSearch}>
          <Text style={styles.loginlinkText}>아이디, 비밀번호 찾기</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={navigateToRegister}>
          <Text style={styles.loginlinkText}>앱을 처음 이용하시나요? 클릭하세요!</Text>
        </TouchableOpacity>
  
        <StatusBar/>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFDECF',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
  
    logo: {
      width: 310,
      height: 135,
      margin: 110,
    },
  
    appintroduce: {
      justifyContent: 'center',
      textAlign: 'center',
      marginTop : -80,
      marginBottom: 15,
      fontSize: 14,
    },
  
    input: {
      height: 45,
      width: 300,
      backgroundColor:'white',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius : 5,
      margin: 8,
      paddingLeft: 10,
    },
  
    ContainerBox: {
      flexDirection: 'row',
      width : 317,
      marginTop: 15,
    },
  
    Checkbox:{
      paddingLeft: 25, 
    },
  
    loginButton: {
      height: 45,
      width: 300,
      backgroundColor: '#3498db',
      paddingVertical: 9,
      paddingHorizontal: 20,
      borderRadius: 5,
      borderColor:'gray',
      borderWidth:1,
      marginTop:25  ,
      marginBottom : 40,
    },
  
  
    loginButtonText: {
      color: '#000',
      textAlign: 'center',
      fontSize: 16,
      
    },
  
    loginlinkText:{
      color: 'gray',
      marginTop: 20,
      fontSize : 16,
      textDecorationLine: 'underline',
    },
  });

  export default LoginScreen;