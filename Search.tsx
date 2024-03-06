import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const Search = () => {
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [id, setId] = useState('');
  const [isIdButtonPressed, setIsIdButtonPressed] = useState(true);
  const [isPassButtonPressed, setIsPassButtonPressed] = useState(false);
  const [isIdconfirmPressed, setIsIdconfirmPressed] = useState(false);
  const [isPassconfirmPressed, setIsPassconfirmPressed] = useState(false);

  const handleIdButtonClick = () => {
      setIsIdButtonPressed(true);
      setIsPassButtonPressed(false);
      setIsIdconfirmPressed(false); // 이 부분 추가
      setIsPassconfirmPressed(false); // 이 부분 추가
  };

  const handlePasswordButtonClick = () => {
      setIsIdButtonPressed(false);
      setIsPassButtonPressed(true);
      setIsIdconfirmPressed(false); // 이 부분 추가
      setIsPassconfirmPressed(false); // 이 부분 추가
  };

  const handleIdconfirmButtonClick = () => {
    setIsIdconfirmPressed(true);
    setIsPassconfirmPressed(false);
  };

  const handlePassconfirmButtonClick = () => {
    setIsPassconfirmPressed(true);
    setIsIdconfirmPressed(false);
  };

  return(
      <View style={styles.container}>
          <View style={styles.containerText}>
              <TouchableOpacity onPress={handleIdButtonClick}>
                  <Text style={[styles.SearchText1, { color: isIdButtonPressed ? '#9966ff' : 'black', borderBottomColor: isIdButtonPressed ? '#9966ff' : 'black' }]}>아이디 찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePasswordButtonClick}>
                  <Text style={[styles.SearchText2, { color: isPassButtonPressed ? '#9966ff' : 'black', borderBottomColor: isPassButtonPressed ? '#9966ff' : 'black' }]}>비밀번호 찾기</Text>
              </TouchableOpacity>
          </View>

          {isIdButtonPressed && !isIdconfirmPressed ? (
              <View>
                  <TextInput
                      style={styles.cssText}
                      placeholder="이메일"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                  />
                  <TextInput
                      style={styles.cssText}
                      placeholder="이름"
                      value={id}
                      onChangeText={(text) => setId(text)}
                  />
                  <TextInput
                      style={styles.cssText}
                      placeholder="학번"
                      value={studentId}
                      onChangeText={(text) => setStudentId(text)}
                  />
                  <TouchableOpacity style={styles.confirmBtn} onPress={handleIdconfirmButtonClick}>
                    <Text style={styles.SearchText3}>아이디 찾기</Text>
                  </TouchableOpacity>
              </View>
          ) : null}

          {isPassButtonPressed && !isPassconfirmPressed ? (
              <View>
                  <TextInput
                      style={styles.cssText}
                      placeholder="아이디"
                      value={id}
                      onChangeText={(text) => setId(text)}
                  />
                  <TextInput
                      style={styles.cssText}
                      placeholder="이름"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                  />
                  <TextInput
                      style={styles.cssText}
                      placeholder="학번"
                      value={studentId}
                      onChangeText={(text) => setStudentId(text)}
                  />
                  <TouchableOpacity style={styles.confirmBtn} onPress={handlePassconfirmButtonClick}>
                    <Text style={styles.SearchText3}>비밀번호 찾기</Text>
                  </TouchableOpacity>
              </View>
          ) : null}

          {isIdconfirmPressed && (
              <Text style={styles.SearchText3}>아이디를 찾았습니다.</Text>
          )}

          {isPassconfirmPressed && (
              <Text style={styles.SearchText3}>비밀번호를 찾았습니다.</Text>
          )}
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFDECF',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    
  },

  containerText:{
    width : 415,
    flexDirection : 'row',
    alignItems: 'center',
    margin: 80,
    marginBottom : 50,
    padding : 5,
  },

  SearchText1:{
    width: 200,
    fontSize : 18,
    fontWeight : 'bold',
    paddingLeft : 60,
    paddingBottom : 5,
    borderBottomWidth : 4,
  },

  SearchText2:{
    width : 205,
    fontSize : 18,
    paddingLeft : 45,
    paddingBottom : 5,
    borderBottomWidth : 4,
  },

  cssText:{
    height: 45,
    width: 300,
    backgroundColor:'white',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius : 5,
    marginBottom : 20,
    paddingLeft: 10,
  },

  confirmBtn:{
    height: 45,
    width: 300,
    backgroundColor: '#9966ff',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderColor:'gray',
    borderWidth:1,
    marginTop:25  ,
    marginBottom : 40,
  },

  SearchText3:{
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  }
})

export default Search;
