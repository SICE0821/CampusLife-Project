import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import CommunityDetailPage from './CommunityDetailPage';


<<<<<<< HEAD
//type 개발자가. 특정한 커스텀 타입을 생성한다. 이유 : 프로그램이 커지면 타입관련해서 오류가 많이 발생하게 되는데
//그 오류를 방지하기 위해서 타입을 설정하게 된다. 그치만 type의 길이가 길어지게 된다면 개발자는 커스텀 type을 이용하여
//프로그램의 가독성을 높이게 된다.
export type RootStackParam = {
  CommunityPage : undefined;
  //undefined : 변수가 값을 가질수도있고 안가질 수도 있다.
  CommunityDetailPage : {
    name : string,
    age : string,
  }
}

//const navigation = useNavigation();

//CoummunityPage, CoummunityDeatilPage : 이 타입의 프로퍼티다.
//프로퍼티란 객체가 가지고 있는 속성이다. 자세히 이야기하면, 두 이름은 해당 타입의 key라고 할수있다.

const CommunityPage : React.FC= () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParam>>();
  const navigation_ex = navigation.getState();

  return (
    <View style = {styles.container}>
      <Button title = "페이지 이동" onPress = {() => navigation.navigate("CommunityDetailPage")}/>
    </View> 
  );
};
//StackNavigationProp는 타입이 object여야만 해.
=======

export type RootStackParam = {
  CoummunityPage : undefined;
  CoummunityDetailPage : {
    name : string;
    age : number;
  };
}

type ScreenProp = {
  navigation: StackNavigationProp<RootStackParam, 'CoummunityPage'>
}


//여기에 인자로 무슨 값을 주게되면 이건 컴포넌트가 아니라 함수로 받아들인다.
//그럼 함수와 컴포넌트를 구분하는 부분은 뭘까
const CommunityPage: React.FC<ScreenProp> = ({navigation}) => {
  //const navigation = useNavigation<StackNavigationProp<RootStackParam>>();
  
  //현제 화면의 네비게이션 객체를 반환하는 것이 useNavigation() 함수
  const value = "정유환"
  return (
    <View style = {styles.container}>
      <Button title="클릭하세요" onPress={() => navigation.navigate('CoummunityDetailPage', {name : 'John', age : 30})} />
      <Text>안녕</Text>
    </View> 
  );
};
>>>>>>> 0cb33d84c2095f16c1f6521ee5e48c805114f8b8

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  }
})

export default CommunityPage;