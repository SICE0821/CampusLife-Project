import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './MainPage';
import CommunityPage from './CommunityPage';
import EventPage from './EventPage';
import AttendancePage from './AttendancePage';
import TimetablePage from './TimetablePage';
import CommunityDetailPage from './CommunityDetailPage';


const MainPageStack = createStackNavigator();
const CommunityStack = createStackNavigator();
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
        <CommunityStack.Navigator>
            <CommunityStack.Screen name = "CommunityPage" component = {CommunityPage}/>
            <CommunityStack.Screen name = "CommunityDetailPage" component = {CommunityDetailPage}/>
        </CommunityStack.Navigator>
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
