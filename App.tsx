/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import BottomNavigation from './pages/BottomTabNavigation';
import React from 'react';
import { StyleSheet, View,} from 'react-native';

function App(): React.JSX.Element {
  return (
    <View style = {styles.container}>
        <BottomNavigation/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    backgroundColor : 'white',
  },
});

export default App;