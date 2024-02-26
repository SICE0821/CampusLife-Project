/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from 'react-native';

function App(): React.JSX.Element {
  return (
    <View style = {{flex : 1}}>
      <View style = {{flex : 1}}>
        <View style = {{flex : 1, backgroundColor : 'yellow'} }></View>
        <View style = {{flex : 1, backgroundColor : 'red'} }></View>
        <View style = {{flex : 1, backgroundColor : 'green'} }></View>
      </View>
      <View style = {{flex : 1}}>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : 'green',
  },
});

export default App;