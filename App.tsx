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
import React, { useState } from 'react';
import { StyleSheet, 
Image, 
Text, 
View, 
TextInput, 
TouchableOpacity, 
StatusBar,
Alert,
} from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Register from './Register.tsx'
import Search from './Search.tsx'
import 'react-native-gesture-handler';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import LoginPage from "./LoginPage.tsx"

const Stack = createStackNavigator();

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
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false,}}>
        <Stack.Screen name="로그인" component={LoginPage}/>
        <Stack.Screen name="회원가입" component={Register} />
        <Stack.Screen name="찾기" component={Search} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;