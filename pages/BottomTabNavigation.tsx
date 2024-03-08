import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import MainPage from './MainPage';
import CoummunityPage from './CommunityPage';
import EventPage from './EventPage';
import AttendancePage from './AttendancePage';
import TimetablePage from './TimetablePage';

import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/Fontisto';
import IconC from 'react-native-vector-icons/FontAwesome6';
import IconD from 'react-native-vector-icons/AntDesign';
import BabelConfig from '../babel.config';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity style={{ backgroundColor: 'blue' }} onPress={() => navigation.goBack}>
        <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
    </TouchableOpacity>
  );
}

  function BottomTabNavigationApp() {

    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: {
              height: 65,
              position: 'absolute',
              bottom: 16,
              right: 10,
              left: 10,
              borderRadius: 20,
              backgroundColor: 'white',
            },
            tabBarActiveTintColor: 'black',
          }}>
          <Tab.Screen
            name="MainPage"
            component={MainPage}
            options={{
              title: '홈',
              headerShown: false,

              tabBarIcon: ({ color, size }) => (
                <IconC name="house" size={size} color={color} /> // 홈 아이콘
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>홈</Text>
              )
            }}
          />
          <Tab.Screen
            name="CoummunityPage"
            component={CoummunityPage}
            options={{
              headerStyle: {
                backgroundColor: '#F27405',
              },
              headerLeft: () => (
                <BackButton/>
              ),
              headerTintColor: 'white',
              headerTitleAlign: 'center',
              title: '커뮤니티',
              tabBarIcon: ({ color, size }) => (
                <IconA name="chat" size={30} color={color} />
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>커뮤니티</Text>
              )

            }}
          />
          <Tab.Screen
            name="EventPage"
            component={EventPage}
            options={{
              title: '이벤트',
              tabBarIcon: ({ color, size }) => (
                <IconB name="ticket" size={30} color={color} /> // 홈 아이콘
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>이벤트</Text>
              )
            }}
          />
          <Tab.Screen
            name="AttendancePage"
            component={AttendancePage}
            options={{
              title: '출석',
              tabBarIcon: ({ color, size }) => (
                <IconA name="check" size={37} color={color} /> // 홈 아이콘
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>출석</Text>
              )
            }}
          />

          <Tab.Screen
            name="TimetablePage"
            component={TimetablePage}
            options={{
              title: '시간표',
              tabBarIcon: ({ color, size }) => (
                <IconC name="calendar-days" size={30} color={color} /> // 홈 아이콘
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>시간표</Text>
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };

export default BottomTabNavigationApp;
