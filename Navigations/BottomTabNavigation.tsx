import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

import {MainPageStackNavigator} from './StackNavigation';
import {CommunityStackNavigator} from './StackNavigation';
import {EventStackNavigator} from './StackNavigation';
import {AttendanceStackNavigator} from './StackNavigation';
import {TimetableStackNavigator} from './StackNavigation';


import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/Fontisto';
import IconC from 'react-native-vector-icons/FontAwesome6';
import IconD from 'react-native-vector-icons/AntDesign';
import BabelConfig from '../babel.config';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BackButton = () => {
  const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
        <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
    </TouchableOpacity>
  );
}

  function BottomTabNavigationApp() {
    return (
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
            name="MainPageStackNavigator"
            component={MainPageStackNavigator}
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
            name="CoummunityStackNavigator" //navigator가 참고할 수 있는 이름이야 이 이름을 보고 해당 페이지를 찾는다.
            component={CommunityStackNavigator} //실제로 이 이름을 가진 screen이 무엇인지를 정의하고있는 부분이야.
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
            name="EventStackNavigator"
            component={EventStackNavigator}
            options={{
              title: '이벤트',
              headerStyle: {
                backgroundColor: '#F27405',
              },
              headerLeft: () => (
                <BackButton/>
              ),
              tabBarIcon: ({ color, size }) => (
                <IconB name="ticket" size={30} color={color} /> // 홈 아이콘
              ),
              tabBarLabel: () => (
                <Text style={{ fontSize: 13, marginBottom: 5 }}>이벤트</Text>
              )
            }}
          />
          <Tab.Screen
            name="AttendanceStackNavigator"
            component={AttendanceStackNavigator}
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
            name="TimetableStackNavigator"
            component={TimetableStackNavigator}
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
    );
  };

export default BottomTabNavigationApp;
