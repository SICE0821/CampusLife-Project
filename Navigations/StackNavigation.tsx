import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from '../pages/MainPage';
import CommunityPage from '../pages/CommunityPage';
import EventPage from '../pages/EventPage';
import AttendancePage from '../pages/AttendancePage';
import TimetablePage from '../pages/TimetablePage';
import CommunityDetailPage from '../pages/CommunityDetailPage';
import { RootStackParam } from '../types/type';


const MainPageStack = createStackNavigator();
//CommunityPage를 이동하기위해 StackNavigation객체를 만드는 부분이다.
//type을 Generic으로 정의함으로써 이 CommunityStack이 관리하는 페이지들의 파라미터 적용시켜준다.
const CoummunityStack = createStackNavigator<RootStackParam>();
const EventStack = createStackNavigator();
const AttendanceStack = createStackNavigator();
const TimetableStack = createStackNavigator();

export const MainPageStackNavigator = () => {
    return(
        <MainPageStack.Navigator>
            <MainPageStack.Screen name = "MainPage" component = {MainPage}/>
        </MainPageStack.Navigator>
    );
};

export const CommunityStackNavigator = () => {
    return(
        <CoummunityStack.Navigator>
            <CoummunityStack.Screen name = "CommunityPage" component = {CommunityPage}/>
            <CoummunityStack.Screen name = "CommunityDetailPage" component = {CommunityDetailPage}/>
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
