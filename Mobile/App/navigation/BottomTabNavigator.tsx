import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

import { PostTopTabNavigator } from "../navigation/TopTabNavigator"
import { MainScreenStackNavigator } from './StackNavigator';
import { CommunityScreenStackNavigator, NoticeScreenStackNavigator } from './StackNavigator';
import { EventScreenStackNavigator } from './StackNavigator';
import { AttendanceScreenStackNavigator } from './StackNavigator';
import { TimetableScreenStackNavigator } from './StackNavigator';
import { AdminMainScreenStackNavigator } from './StackNavigator';

import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/Fontisto';
import IconC from 'react-native-vector-icons/FontAwesome6';
import IconD from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator();

//메인 바텀 탭 네비게이션
export const MainTabNavigator = ({ route }: any) => {
  const navigation: any = useNavigation();
  const { userdata, LectureData } = route.params;
  
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
        name="MainPage"
        component={MainScreenStackNavigator}
        options={{
          title: '홈',
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <IconC name="house" size={size} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5, color: 'gray' }}>홈</Text>
          )
        }}
        initialParams={{ userdata , LectureData}}
      />
      <Tab.Screen
        name="CommunityScreenStackNavigator"
        component={CommunityScreenStackNavigator}
        options={{
          headerShown: false,
          //tabBarStyle : {display : 'none'},
          tabBarIcon: ({ color, size }) => (
            <IconA name="chat" size={30} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5, color: 'gray' }}>커뮤니티</Text>
          )
        }}
        initialParams={{ userdata }}
      />
      
      <Tab.Screen
        name="NoticeScreenStackNavigator"
        component={NoticeScreenStackNavigator}
        options={{
          headerShown: false,
          //tabBarStyle : {display : 'none'},
          tabBarIcon: ({ color, size }) => (
            <IconA name="megaphone" size={30} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5, color: 'gray' }}>공지사항</Text>
          )
        }}
        initialParams={{ userdata }}
      />
      <Tab.Screen
        name="AttendanceStackNavigator"
        component={AttendanceScreenStackNavigator}
        options={{
          headerShown: false,
          title: '출석',
          headerStyle: {
            backgroundColor: '#F27405',
          },


          tabBarIcon: ({ color, size }) => (
            <IconA name="check" size={37} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5, color: 'gray' }}>출석</Text>
          )
        }}
        initialParams={{ userdata, LectureData}}
      />

      <Tab.Screen
        name="TimetableStackNavigator"
        component={TimetableScreenStackNavigator}
        options={{
          title: '시간표',
          tabBarIcon: ({ color, size }) => (
            <IconC name="calendar-days" size={30} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5, color: 'gray' }}>시간표</Text>
          )
        }}
        initialParams={{ userdata, LectureData }}
      />
    </Tab.Navigator>
  );
}


export const AdminTabNavigator = ({ route }: any) => {
  const navigation: any = useNavigation();
  const { userdata } = route.params;
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
        name="AdminMainPage"
        component={AdminMainScreenStackNavigator}
        options={{
          title: '홈',
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <IconC name="house" size={size} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5 }}>홈</Text>
          )
        }}
        initialParams={{ userdata }}
      />
      <Tab.Screen
        name="CommunityScreenStackNavigator"
        component={CommunityScreenStackNavigator}
        options={{
          headerShown: false,
          //tabBarStyle : {display : 'none'},
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
        component={EventScreenStackNavigator}
        options={{
          title: '이벤트',
          tabBarStyle: { display: 'none' },
          headerStyle: {
            backgroundColor: '#F27405',
          },
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <IconB name="ticket" size={30} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5 }}>이벤트</Text>
          )
        }}
      />
      <Tab.Screen
        name="AttendanceStackNavigator"
        component={AttendanceScreenStackNavigator}
        options={{
          headerShown: false,
          title: '출석',
          headerStyle: {
            backgroundColor: '#F27405',
          },
          tabBarIcon: ({ color, size }) => (
            <IconA name="check" size={37} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5 }}>출석</Text>
          )
        }}
      />

      <Tab.Screen
        name="TimetableStackNavigator"
        component={TimetableScreenStackNavigator}
        options={{
          title: '시간표',
          tabBarIcon: ({ color, size }) => (
            <IconC name="calendar-days" size={30} color={color} />
          ),
          tabBarLabel: () => (
            <Text style={{ fontSize: 13, marginBottom: 5 }}>시간표</Text>
          )
        }}
        initialParams={{ userdata }}
      />
    </Tab.Navigator>
  );
}