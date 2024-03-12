import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import CommunityDetailPage from './CommunityDetailPage';


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

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  }
})

export default CommunityPage;