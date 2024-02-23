import React, { useState } from 'react';
import { StyleSheet, 
Image, 
Text, 
View, 
TextInput, 
TouchableOpacity, 
StatusBar, 
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from './Register.tsx'
import 'react-native-gesture-handler';
import CheckBox from 'react-native-check-box';

const Stack = createStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
          screenOptions={{headerShown: false,}}>
        <Stack.Screen name="로그인" component={LoginScreen}/>
        <Stack.Screen name="회원가입" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoginScreen({ navigation}: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedAutoLogin, setIsCheckedAutoLogin] = useState(false);

  const handleLogin = () => {
    // 여기에서 로그인 로직을 구현하거나 다른 작업을 수행합니다.
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('IsChecked:', isChecked);
  };


  const navigateToRegister = () => {
    navigation.navigate('회원가입');
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('./assets/logo.png')} />

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

    <CheckBox
      isChecked={isChecked}
      onClick={() => setIsChecked(!isChecked)}
      rightText="아이디 저장"
      rightTextStyle={{fontSize : 19, color : 'black' , fontWeight : 'bold'}}
    />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={styles.loginlinkText}>아이디, 비밀번호 찾기</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToRegister}>
        <Text style={styles.loginlinkText}>앱을 처음 이 용하시나요? 클릭하세요!</Text>
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

  checkboxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // 간격 조절을 위한 스타일
    width: 300,
    marginTop: 15,
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

export default App;
