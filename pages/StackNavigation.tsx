import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainPage from './MainPage';
import CoummunityPage from './CommunityPage';
import EventPage from './EventPage';
import AttendancePage from './AttendancePage';
import TimetablePage from './TimetablePage';
import CoummunityDetailPage from './CommunityDetailPage';

import { RootStackParam } from './CommunityPage';


const MainPageStack = createStackNavigator();
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

export const CoummunityStackNavigator = () => {
    return(
        <CoummunityStack.Navigator>
            <CoummunityStack.Screen name = "CoummunityPage" component = {CoummunityPage}/>
            <CoummunityStack.Screen name = "CoummunityDetailPage" component = {CoummunityDetailPage}/>
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
