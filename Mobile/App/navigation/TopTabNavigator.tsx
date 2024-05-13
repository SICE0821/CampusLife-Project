import GeneralPostsScreen from '../screens/CommunityScreens/GeneralPostsScreen'
import BookmarkScreen from '../screens/CommunityScreens/BookmarkScreen'
import HotPostsScreen from '../screens/CommunityScreens/HotPostsScreen'
import ReqularEventScreen from '../screens/EventScreens/RegularEventScreen';
import DeadlineEventScreen from '../screens/EventScreens/DeadlineEventScreen';
import EventShopScreen from '../screens/EventScreens/EventShopScreen';
import DepartmentPostsScreen from '../screens/CommunityScreens/DepartmentPostsScreen'
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import AcademicInfoScreen from '../screens/CardScreens/AcademicScreens/AcademicInfoScreen';
import AcademicRecord from '../screens/CardScreens/AcademicScreens/AcademicRecordScreen';
import { EventShopScreenStackNavigator, ReqularEventScreenNavigator } from '../navigation/StackNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useState, useLayoutEffect } from 'react';
const CommunityTopTab = createBottomTabNavigator();
const CommunityTopBottomTab = createBottomTabNavigator();
const EventTopTab = createMaterialTopTabNavigator();
const PostTopTab = createMaterialTopTabNavigator();
const PostDetailTopTab = createMaterialTopTabNavigator();
const AcademicTopTab = createMaterialTopTabNavigator();

import { UserData } from '../types/type';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export const AcademicTopTabNavigator = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <AcademicTopTab.Navigator
                screenOptions={({ }) => ({
                    tabBarStyle: {
                        shadowOffset: {
                            width: 0,
                            height: 0, // for iOS
                        },
                        elevation: 0,
                        backgroundColor: 'white',
                        height: 55,
                        width: 300,
                        //borderBottomWidth : 1,
                        zIndex: 0,

                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#9A9EFF',
                        //orderWidth : 5,
                        //width: 70,
                        //left: 43,
                    },
                    tabBarLabelStyle: {
                        //width : 70,
                        //backgroundColor : 'red',
                        fontSize: 20,
                        fontWeight: 'bold'
                    },
                    gestureEnabled: false,
                    swipeEnabled: false,
                    animationEnabled: false,
                })}>
                <AcademicTopTab.Screen
                    name="학적"
                    component={AcademicInfoScreen} />
                <AcademicTopTab.Screen
                    name="수강신청이력"
                    component={AcademicRecord} />
            </AcademicTopTab.Navigator>
        </View>
    )
}


export const PostTopTabNavigator = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <PostTopTab.Navigator
                screenOptions={({ }) => ({
                    tabBarStyle: {
                        shadowOffset: {
                            width: 0,
                            height: 0, // for iOS
                        },
                        elevation: 0,
                        backgroundColor: 'white',
                        height: 55,
                        //width: 300,
                        //borderBottomWidth : 1,
                        zIndex: 0,

                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#9A9EFF',
                        //orderWidth : 5,
                        //width: 70,
                        //left: 43,
                    },
                    tabBarLabelStyle: {
                        //width : 70,
                        //backgroundColor : 'red',
                        fontSize: 20,
                        fontWeight: 'bold'
                    },
                    gestureEnabled: false,
                    swipeEnabled: false,
                    animationEnabled: false,
                })}>
                <PostTopTab.Screen
                    name="전체 게시판"
                    component={PostDetailTopTabNavigator} />
                <PostTopTab.Screen
                    name="학과 게시판"
                    component={PostDetailTopTabNavigator} />
            </PostTopTab.Navigator>
        </View>
    )
}

export const PostDetailTopTabNavigator = () => {
    return (
        <View style = {{flex : 1, backgroundColor : 'white'}}>
            <PostDetailTopTab.Navigator
                screenOptions={({ }) => ({
                    tabBarStyle: {
                        shadowOffset: {
                            width: 0,
                            height: 0, // for iOS
                        },
                        elevation: 0,
                        zIndex: 0,
                        //borderWidth: 1,
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        backgroundColor: 'white',
                        //width : 400
        
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: '#9A9EFF'
                    },
                    tabBarLabelStyle: {
                        fontSize: 18,
                        fontWeight: 'bold'
                    },
                    gestureEnabled: false,
                    swipeEnabled: false,
                    animationEnabled: false
                })}>
                <PostDetailTopTab.Screen
                    name="전체"
                    component={GeneralPostsScreen} />
                <PostDetailTopTab.Screen
                    name="HOT게시글"
                    component={HotPostsScreen} />
                <PostDetailTopTab.Screen
                    name="책갈피"
                    component={BookmarkScreen} />
            </PostDetailTopTab.Navigator>
        </View>

    )
}

export const TopBottomTabNavigator = ({ navigation, route }: any) => {
    const { department_check, userdata } = route.params
    console.log(userdata);
    //전체, HOT게시글, 책갈피 상단 탭 네비게이션
    return (
        <CommunityTopBottomTab.Navigator
            screenOptions={{
                tabBarStyle: {
                    top: 68,
                    position: 'absolute',
                    height: 40,
                    left: -3,
                    marginRight: 80,
                    marginLeft: 10,
                    elevation: 0,
                    borderWidth: 0,
                    borderTopWidth: 0,
                    //backgroundColor : 'blue',

                },
                tabBarLabelStyle: {
                    fontSize: 20,
                    alignItems: 'center',
                    marginBottom: 10,
                    marginTop: 5,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: 'black'

            }}>
            <CommunityTopBottomTab.Screen name='전체'
                component={GeneralPostsScreen}
                initialParams={{ department_check: department_check, userdata: userdata }}
                options={{
                    headerShown: false,
                    tabBarIcon: () => null,
                }}>
            </CommunityTopBottomTab.Screen>

            <CommunityTopBottomTab.Screen name='HOT게시글'
                component={HotPostsScreen}
                initialParams={{ department_check: department_check }}
                options={{
                    headerShown: false,
                    tabBarIcon: () => null,
                }} >
            </CommunityTopBottomTab.Screen>

            <CommunityTopBottomTab.Screen name='책갈피'
                component={BookmarkScreen}
                initialParams={{ department_check: department_check }}
                options={{
                    headerShown: false,
                    tabBarIcon: () => null,
                }} >
            </CommunityTopBottomTab.Screen>
        </CommunityTopBottomTab.Navigator>

    )
}

//커뮤니티 전체, 학과 게시판 상단 탭 네비게이션
export const TopbTabNavigator = ({ route, navigation }: any) => {
    const { userdata } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    return (
        <CommunityTopTab.Navigator
            screenOptions={{
                tabBarStyle: {
                    top: 10,
                    position: 'absolute',
                    height: 45,
                    marginLeft: 12,
                    marginRight: 100,
                    //borderWidth : 2,
                    elevation: 0,
                    //backgroundColor : 'blue',

                },
                tabBarLabelStyle: {
                    fontSize: 25,
                    alignItems: 'center',
                    marginBottom: 14,
                    fontWeight: 'bold',
                },
                tabBarActiveTintColor: 'black'

            }}>
            <CommunityTopTab.Screen name="전체 게시판"
                initialParams={{ department_check: 0, userData }}
                component={TopBottomTabNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: () => null,
                }}
            />

            <CommunityTopTab.Screen name="학과 게시판"
                initialParams={{ department_check: 1, userData }}
                component={TopBottomTabNavigator}
                options={{
                    headerShown: false,
                    tabBarIcon: () => null,
                }} />
        </CommunityTopTab.Navigator>
    );
}

export const EventTopTabNavigator = ({ navigation, route }: any) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "이벤트 상점") {
            console.log(routeName);
            navigation.setOptions({ tabBarStyle: { display: 'none' } });
        }
    }, [navigation, route])
    return (
        <EventTopTab.Navigator screenOptions={{
            swipeEnabled: false,

            tabBarLabelStyle: {
                fontSize: 20,
                fontWeight: 'bold',
            },
        }}>
            <EventTopTab.Screen name="정기 이벤트"
                component={ReqularEventScreenNavigator}
                options={{
                    //headerShown : false,
                    //tabBarIcon: () => null,
                }}
            />
            <EventTopTab.Screen name="한정 이벤트"
                component={DeadlineEventScreen}
                options={{

                }} />
            <EventTopTab.Screen name="이벤트 상점"
                component={EventShopScreenStackNavigator}
                options={{
                    //headerShown : false,
                    //tabBarIcon: () => null,
                }} />
        </EventTopTab.Navigator>
    );
}