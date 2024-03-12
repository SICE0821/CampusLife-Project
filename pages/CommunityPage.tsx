import React from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';



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

const styles = StyleSheet.create({
  container : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
  }
})

export default CommunityPage;