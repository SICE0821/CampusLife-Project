import React, { useLayoutEffect, useState } from 'react';
import { Text, Touchable, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import MainScreen from '../screens/MainScreen';
import { EventTopTabNavigator } from './TopTabNavigator'
import AttendanceScreen from '../screens/AttendanceScreens/AttendanceScreen';
import TimetableScreen from '../screens/TimetableScreen';
import WritePostScreen from '../screens/CommunityScreens/WritePostScreen';
import LoginScreen from '../screens/LoginScreens/LoginScreen';
import RegisterScreen from '../screens/LoginScreens/RegisterScreen';
import SearchScreen from '../screens/LoginScreens/SearchScreen';
import { RootStackParam } from '../types/type';
import EventShopScreen from '../screens/EventScreens/EventShopScreen'
import EventHaveCouponScreen from '../screens/EventScreens/EventHaveCouponScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import PostDetailScreen from '../screens/CommunityScreens/PostDetailScreen';
import SearchPostScreen from '../screens/CommunityScreens/SerchPostScreen';
import FullScreenCamera from '../screens/AttendanceScreens/FullScreenCamera'
import DailyEventScreen from '../screens/EventScreens/DailyEventScreen';
import ReqularEventScreen from '../screens/EventScreens/RegularEventScreen';
import StudentInfoScreen from '../screens/CardScreens/StudentInfoScreen';
import AcademicInfoScreen from '../screens/CardScreens/AcademicInfoScreen';
import SchoolInfoScreen from '../screens/CardScreens/SchoolInfoScreen';
import StudyRoomScreen from '../screens/CardScreens/StudyRoomScreen'
import AlarmDialogScreen from '../screens/CardScreens/AlarmDialogScreen';
import AdminMainScreen from '../admin_screen/AdminMainScreen';


import { MainTabNavigator } from './BottomTabNavigator'
import { AdminTabNavigator } from './BottomTabNavigator';
import { TopbTabNavigator } from './TopTabNavigator'
import ItemRegistration from '../admin_screen/ItemRegistration.tsx/ItemRegistration'

import IconD from 'react-native-vector-icons/AntDesign';
import IconG from 'react-native-vector-icons/FontAwesome6';
import IconF from 'react-native-vector-icons/FontAwesome';

const RootStack = createStackNavigator();
const LoginStack = createStackNavigator();
const MainStack = createStackNavigator();
const CoummunityStack = createStackNavigator<RootStackParam>();
const EventStack = createStackNavigator();
const AttendanceStack = createStackNavigator();
const TimetableStack = createStackNavigator();
const EventShopStack = createStackNavigator();
const ReqularEventScreenStack = createStackNavigator();
const AdminStack = createStackNavigator();

//모든 네비게이터 객체의 최상위 네비게이터
export const RootStackNavigator = () => {
    const navigation: any = useNavigation();
    const [dataFromScreen1, setDataFromScreen1] = useState<any>();

    return (
        <RootStack.Navigator initialRouteName="LoginScreenStackNavigator">
            <RootStack.Screen name="LoginScreenStackNavigator" component={LoginScreenStackNavigator} />
            <RootStack.Screen name="AdminTabNavigator" component={AdminTabNavigator} options={{ headerShown: false }} />
            <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} options={{ headerShown: false }} />
            <RootStack.Screen
                name="WritePostScreen"
                component={WritePostScreen}
                options={({ navigation }: any) => ({
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("CommunityScreenStackNavigator")}>
                            <IconD style={{ marginLeft: 10 }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '커뮤니티',
                })}
            />
            <RootStack.Screen
                name="PostDetailScreen"
                component={PostDetailScreen}
                options={({ navigation }: any) => ({
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("CommunityScreenStackNavigator")}>
                            <IconD style={{ marginLeft: 10 }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '커뮤니티',
                })}
            />
            <RootStack.Screen name="SearchPostScreen"
                component={SearchPostScreen}
                options={{ headerShown: false }}>
            </RootStack.Screen>
            <AttendanceStack.Screen name="FullScreenCamera" component={FullScreenCamera} options={{ headerShown: false }} />
        </RootStack.Navigator>
    )
}

//로그인 관련 스택 네비게이터
export const LoginScreenStackNavigator = () => {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
            <LoginStack.Screen name="RegisterScreen" component={RegisterScreen} options={{ headerShown: false }} />
            <LoginStack.Screen name="SearchScreen" component={SearchScreen} options={{ headerShown: false }} />
        </LoginStack.Navigator>
    )
}

//메인 페이지 관련 스택 네비게이터
export const MainScreenStackNavigator = ({ route }: any) => {
    const navigation: any = useNavigation();
    const { userdata } = route.params;
    return (
        <MainStack.Navigator>
            <MainStack.Screen name="MainScreen" component={MainScreen} initialParams={{ userdata }}/>
            <MainStack.Screen 
                name="StudentInfoNavigator" 
                component={StudentInfoScreen} 
                options={({ navigation }) => ({
                    headerStyle: {
                      backgroundColor: '#F27405',
                    },
                    headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                        <IconF style={{ marginRight: 10 }} name="check" size={30} color="white" />
                      </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '정보변경',
                  })}
                />
                <MainStack.Screen 
                name="AcademicInfoNavigator"
                component={AcademicInfoScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                            <IconF style={{ marginRight: 10 }} name="check" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '학적확인',
                }}
            />
            <MainStack.Screen 
                name="AlarmDialogScreen"
                component={AlarmDialogScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                            <IconF style={{ marginRight: 10 }} name="check" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '알람 확인',
                }}
            />
            <MainStack.Screen 
                name="SchoolInfoScreen"
                component={SchoolInfoScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                            <IconF style={{ marginRight: 10 }} name="check" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '학교 정보',
                }}
            />
            <MainStack.Screen 
                name="StudyRoomScreen"
                component={StudyRoomScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate("MainScreen")}>
                            <IconF style={{ marginRight: 10 }} name="check" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '스터디룸',
                }}
            />
        </MainStack.Navigator>
    );
};

export const AdminMainScreenStackNavigator = ({ route, navigation }: any) => {
    const { userdata } = route.params;
    return (
        <AdminStack.Navigator>
            <AdminStack.Screen name="AdminScreen" component={AdminMainScreen} initialParams={{ userdata }} />
            <AdminStack.Screen name="ItemRegistration" component={ItemRegistration} initialParams={{ userdata }} options={{
                headerStyle: {
                    backgroundColor: '#F27405',
                },
                headerLeft: () => (
                    <TouchableOpacity
                        onPress={() => navigation.navigate("AdminScreen")}>
                        <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                    </TouchableOpacity>
                ),
                headerTintColor: 'white',
                headerTitleAlign: 'center',
                title: '물품 등록 현황',
            }} />
        </AdminStack.Navigator>
    );
};

//커뮤니티 페이지 관련 스택 네비게이터
export const CommunityScreenStackNavigator = () => {
    const navigation: any = useNavigation();
    return (
        <CoummunityStack.Navigator>
            <CoummunityStack.Screen
                name="CommunityTopNavigation"
                component={TopbTabNavigator}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("WritePostScreen")}>
                                <IconD style={{ marginRight: 10 }} name="form" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("SearchPostScreen")}>
                                <IconD style={{ marginRight: 10 }} name="search1" size={30} color="white" />
                            </TouchableOpacity>
                        </View>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '커뮤니티',
                }} />
        </CoummunityStack.Navigator>

    );
};

//이벤트 페이지 관련 스택 네비게이터
export const EventScreenStackNavigator = ({ navigation, route }: any) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "EventHaveCouponScreen") {
            console.log(routeName);
            //navigation.setOptions({tabBarStyle: {display: 'none'}});
        }
    }, [navigation, route])
    return (
        <EventStack.Navigator>
            <EventStack.Screen name="EventTopTabNavigator"
                component={EventTopTabNavigator}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("EventHaveCouponScreen")}>
                            <Text style={{ color: 'black', marginRight: 10, }}><IconG name="ticket" size={30} /></Text>
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />
            <EventShopStack.Screen name="EventHaveCouponScreen"
                component={EventHaveCouponScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("EventTopTabNavigator")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />
            <EventShopStack.Screen
                name="DailyEventScreen"
                component={DailyEventScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("EventTopTabNavigator")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />
        </EventStack.Navigator>
    );
};

export const ReqularEventScreenNavigator = ({ navigation, route }: any) => {
    return (
        <ReqularEventScreenStack.Navigator>
            <ReqularEventScreenStack.Screen
                name="ReqularEventScreen"
                component={ReqularEventScreen}
                options={{
                    //headerShown : false,
                    //tabBarIcon: () => null,
                }}>
            </ReqularEventScreenStack.Screen>

            <ReqularEventScreenStack.Screen
                name="DailyEventScreen"
                component={DailyEventScreen}
                options={{
                    headerShown: false,
                    //tabBarIcon: () => null,
                }}>
            </ReqularEventScreenStack.Screen>

        </ReqularEventScreenStack.Navigator>
    );
};

//출석체크 페이지 관련 스택 네비게이터
export const AttendanceScreenStackNavigator = ({ navigation, route }: any) => {
    return (
        <AttendanceStack.Navigator>
            <AttendanceStack.Screen name="AttendanceScreen"
                component={AttendanceScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },


                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("MainPage")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '출석',
                }} />
        </AttendanceStack.Navigator>
    );
};

//시간표 페이지 관련 스택 네비게이터
export const TimetableScreenStackNavigator = () => {
    return (
        <TimetableStack.Navigator>
            <TimetableStack.Screen name="TimetableScreen" component={TimetableScreen} />
        </TimetableStack.Navigator>
    );
};

export const EventShopScreenStackNavigator = ({ navigation, route }: any) => {
    return (
        <EventShopStack.Navigator>
            <EventShopStack.Screen name="EventShopScreen" component={EventShopScreen} options={{
                headerShown: false
            }} />
        </EventShopStack.Navigator>
    )
}
