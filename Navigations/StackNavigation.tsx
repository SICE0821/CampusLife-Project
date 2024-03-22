import React, {useEffect, useRef} from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from '../pages/MainPage';
import CommunityPage from '../pages/community/CommunityPage'
import {CommunityTopNavigation} from './TopNavigation'
import EventPage from '../pages/EventPage';
import AttendancePage from '../pages/AttendancePage';
import TimetablePage from '../pages/TimetablePage';
import WritePostPage from '../pages/Community/WritePostPage';
import { RootStackParam } from '../types/type';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import { TabActions } from '@react-navigation/native';
import BottomTabNavigator from './BottomTabNavigation'
import { StyleSheet, Text, TouchableOpacity, View,Button } from 'react-native';
import IconD from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';

const RootStack = createStackNavigator();


const MainPageStack = createStackNavigator();
//CommunityPage를 이동하기위해 StackNavigation객체를 만드는 부분이다.
//type을 Generic으로 정의함으로써 이 CommunityStack이 관리하는 페이지들의 파라미터 적용시켜준다.
const CoummunityStack = createStackNavigator<RootStackParam>();
const EventStack = createStackNavigator();
const AttendanceStack = createStackNavigator();
const TimetableStack = createStackNavigator();

const BackButton = () => {
    const navigation:any = useNavigation()
    return (
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
      </TouchableOpacity>
    );
  }

export const RootStackNavigator = () => {
    return (
        <RootStack.Navigator>
            <RootStack.Screen name = "BottomTabNavigator" component = {BottomTabNavigator} options = {{headerShown : false}}/>
            <RootStack.Screen name = "WritePostPage" 
                              component = {WritePostPage} 
                              options={{
                                headerStyle: {
                                  backgroundColor: '#F27405',
                                },
                                headerLeft: () => (
                                  <BackButton/>
                                ),
                                headerRight: () => (
                                    <TouchableOpacity onPress={() => console.log("완료버튼 누름")}>
                                         <View style = {{flexDirection : 'row', backgroundColor : '#B20000', justifyContent : 'center',
                                                 alignItems : 'center', width :65, height :35, borderRadius : 20, marginRight :10,}}>
                                            <Text style = {{color : 'white', fontSize : 17, fontWeight : "bold"}}>완료</Text>
                                        </View>
                                    </TouchableOpacity>
                                ),
                                headerTintColor: 'white',
                                headerTitleAlign: 'center',
                                title: '커뮤니티',
                              }}/>
        </RootStack.Navigator>
    )
}

export const MainPageStackNavigator = () => {
    return(
        <MainPageStack.Navigator>
            <MainPageStack.Screen name = "MainPage" component = {MainPage}/>
        </MainPageStack.Navigator>
    );
};

export const CommunityStackNavigator = ({navigation} : any) => {
    //navigation.setOptions({ tabBarStyle: { display: 'none' } });
    return(
        <CoummunityStack.Navigator>
            <CoummunityStack.Screen 
                name = "CommunityPage" 
                component = {CommunityTopNavigation}
                options = {{headerShown : false}}/>

            <CoummunityStack.Screen 
                name = "WritePostPage" 
                component = {WritePostPage}
                />
            <CoummunityStack.Screen 
                name = "TimetablePage" 
                component = {TimetablePage}
                />
        </CoummunityStack.Navigator>

    );
};

export const EventStackNavigator = () => {
    return(
        <EventStack.Navigator>
            <EventStack.Screen name = "EventPage" component = {EventPage}/>
        </EventStack.Navigator>
    );
};

export const AttendanceStackNavigator = () => {
    return(
        <AttendanceStack.Navigator>
            <AttendanceStack.Screen name = "AttendancePage" component = {AttendancePage}/>
        </AttendanceStack.Navigator>
    );
};

export const TimetableStackNavigator = () => {
    return(
        <TimetableStack.Navigator>
            <TimetableStack.Screen name = "TimetablePage" component = {TimetablePage}/>
        </TimetableStack.Navigator>
    );
};
