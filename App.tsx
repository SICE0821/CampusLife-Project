/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './Navigations/BottomTabNavigation';
import {CommunityTopNavigation} from './Navigations/TopNavigation'
import React from 'react';
import { StyleSheet, View,} from 'react-native';
import {RootStackNavigator} from './Navigations/StackNavigation'

function App(): React.JSX.Element {
  return (
      <NavigationContainer>
        <RootStackNavigator/>
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