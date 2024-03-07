/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import BottomNavigation from './pages/BottomTabNavigation';
import React from 'react';
import { StyleSheet, View,} from 'react-native';

function App(): React.JSX.Element {
  return (
      <NavigationContainer>
        <BottomNavigation/>
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