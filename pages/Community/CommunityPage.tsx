import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {RootStackParam} from '../../types/type';
//import CommunityTopNavigation from '../../Navigations/MaterialNavigation'
import { NavigationContainer } from '@react-navigation/native';


//type을 하나 생성해준다.
//이 type은 navigation의 type을 Generic(2개)을 이용하여 설정하게된다. => StackNavigationProp을 이용한다.
//첫번째 제네릭 타입은 RootStackParam(이건 유저가 각각의 페이지가 받아야하는 prop을 정의해놓은 타입이다.)
//두번째 제네릭 타입은 현제 페이지이다.
//즉 이의미는 현재 이 페이지에 대한 네비게이션 prop을 설정해준것이다.
type CommunityNavigationProp = {
  navigation: StackNavigationProp<RootStackParam, 'CommunityPage'>
}

type data = {
  name : string;
  age : number
}

//여기서 위에 정의해놓은(navigation prop을 설정한) type을 제네릭으로 적용시키게 된다.
//: 는 타입을 설정한다는 의미이고,
//React.FC는 이 함수가 컴포넌트함수(Functional Component)라는 의미이고,
//<CoummunityNavigationProp> 은 Generic을 이용하여 이 함수의 타입을 정의한다.
//함수안의 {navigation} 은 이 navigation prop을 정의해놓은 타입을 정의해놓음으로써 사용할 수 있게 되고, navigation을 이용하여 앞으로의 이동을 관리한다.
const CommunityPage: React.FC<CommunityNavigationProp> = ({navigation}) => {
  let data :data;
  data = {name : "유환", age :23}
  return (
    <View style = {styles.container}>
      {/*이 버튼을 누르면, 페이지 이동을 하게 된다.*/}
      {/* navgation.nvigatie는 두가지 매개변수를 받게되는데 */}
      {/* 첫번째 메개변수는 이동할려는 페이지이고, */}
      {/* 두번째 메개변수는 그 페이지가 전달할 데이터이다. */}
      {/* 중괄호로 묶여있는 이유는, 이 데이터들이 객체 형태이기 때문이다. */}
      <Button title = "페이지 이동" onPress = {() => navigation.navigate("CommunityDetailPage", data)}/>
    </View> 
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  }
})

export default CommunityPage;