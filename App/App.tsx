import React from 'react';
import { StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {RootStackNavigator} from './navigation/StackNavigator.tsx';
import {HomeScreenStack} from '../MyTest/StackNavigation.tsx'

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