import GeneralPostsScreen from '../screens/CommunityScreens/GeneralPostsScreen'
import BookmarkScreen from '../screens/CommunityScreens/BookmarkScreen'
import HotPostsScreen from '../screens/CommunityScreens/HotPostsScreen'
import ReqularEventScreen from '../screens/EventScreens/RegularEventScreen';
import DeadlineEventScreen from '../screens/EventScreens/RegularEventScreen';
import DepartmentPostsScreen from '../screens/CommunityScreens/DepartmentPostsScreen'
import {EventShopScreenStackNavigator} from '../navigation/StackNavigator'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import React, { useState, useLayoutEffect } from 'react';
const CommunityTopTab = createBottomTabNavigator();
const CommunityTopBottomTab = createBottomTabNavigator();
const EventTopTab = createMaterialTopTabNavigator();

export const TopBottomTabNavigator = () => {
    
    //전체, HOT게시글, 책갈피 상단 탭 네비게이션
    return (
        <CommunityTopBottomTab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 60,
                    position: 'absolute',
                    height: 40,
                    left : -3,
                    marginRight : 120,
                    marginLeft : 10,               
                    elevation : 0,
                    borderWidth : 0,
                    borderTopWidth: 0, 
                    //backgroundColor : 'blue',
                
                },
                tabBarLabelStyle: { 
                    fontSize : 20,
                    alignItems: 'center',
                    marginBottom : 10,
                    marginTop : 5,
                    fontWeight: 'bold',
                    },
                tabBarActiveTintColor : 'black'
            
        }}>
            <CommunityTopBottomTab.Screen name = '전체' component={GeneralPostsScreen} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}>
            </CommunityTopBottomTab.Screen>

            <CommunityTopBottomTab.Screen name = 'HOT게시글' component={HotPostsScreen} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,

                            }} >
            </CommunityTopBottomTab.Screen>

            <CommunityTopBottomTab.Screen name = '책갈피' component={BookmarkScreen} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }} >
            </CommunityTopBottomTab.Screen>
        </CommunityTopBottomTab.Navigator>

    )
}

//커뮤니티 전체, 학과 게시판 상단 탭 네비게이션
export const TopbTabNavigator = () => {
    return (
        <CommunityTopTab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 10,
                    position: 'absolute',
                    height: 40,
                    marginLeft : 12,
                    marginRight : 150,
                    //borderWidth : 2,
                    elevation : 0,
                    //backgroundColor : 'blue',
                
                },
                tabBarLabelStyle: { 
                    fontSize : 23,
                    alignItems: 'center',
                    marginBottom : 14,
                    fontWeight: 'bold',
                    },
                tabBarActiveTintColor : 'black'
                
            }}>
            <CommunityTopTab.Screen name="전체 게시판"
                        component={TopBottomTabNavigator}
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
            <CommunityTopTab.Screen name="학과 게시판" 
                        component={TopBottomTabNavigator} 
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
        </CommunityTopTab.Navigator>
    );
}

export const EventTopTabNavigator = ({navigation, route} : any) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if(routeName === "이벤트 상점") {
            console.log(routeName);
            navigation.setOptions({tabBarStyle: {display: 'none'}});
        }
    }, [navigation, route])
    return(
        <EventTopTab.Navigator>
            <EventTopTab.Screen name = "정기 이벤트" 
                                component={ ReqularEventScreen }
                                options = {{
                                    //headerShown : false,
                                    //tabBarIcon: () => null,
                                    }}
                                />
            <EventTopTab.Screen name = "한정 이벤트" 
                                component = {DeadlineEventScreen}
                                options = {{
                                    
                                    }}/>
            <EventTopTab.Screen name = "이벤트 상점" 
                                component = {EventShopScreenStackNavigator}
                                options = {{
                                //headerShown : false,
                                //tabBarIcon: () => null,
                                }}/>
        </EventTopTab.Navigator>
    );
}