import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

export type RootStackParam = {
  CoummunityPage : undefined;
  CoummunityDetailPage : undefined;
}

const CommunityPage = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParam>>();
  return (
    <View style = {styles.container}>
      <Button title="클릭하세요" onPress={() => navigation.navigate('CoummunityDetailPage')} />
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