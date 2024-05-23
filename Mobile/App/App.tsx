import React, {useState} from 'react';
import { StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {RootStackNavigator} from './navigation/StackNavigator.tsx';
import {HomeScreenStack} from '../MyTest/StackNavigation.tsx'


function App(): React.JSX.Element {

  return (
     <NavigationContainer>
        <RootStackNavigator></RootStackNavigator>
     </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : 'white',
  },
});

export default App;