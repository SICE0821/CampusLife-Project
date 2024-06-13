import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Text, Touchable, TouchableOpacity, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import EventRegistrationScreen from "../AdminEventScreens/EventRegistrationScreen"
import CheckEventScreen from '../AdminEventScreens/CheckEventScreen';
import SendUserEventScreen from '../AdminEventScreens/SendUserEventScreen';
import SendUserEventDetailScreen from '../AdminEventScreens/SendUserEventDetailScreen';
import ReportPostsScreen from '../AdminReportPostScreens/ReportPostsScreen';
import CheckRegistItemScreen from '../AdminRegisterItemScreen/CheckRegistItemScreen';
import RegisterItemScreen from '../AdminRegisterItemScreen/RegisterItemScreen';
import EditItemScreen from '../AdminRegisterItemScreen/EditItemScreen';
import IconD from 'react-native-vector-icons/AntDesign';
import ManagementUserScreen from '../managementUserScreen';


const AdminEventStack = createStackNavigator();
const ReportPostStack = createStackNavigator();
const RegisterItemStack = createStackNavigator();

//관리자 이벤트 스택 네비게이터
export const AdminEventStackNavigator = ({ navigation, route }: any) => {
    return (
        <AdminEventStack.Navigator>
            <AdminEventStack.Screen name="CheckEventScreen"
                component={CheckEventScreen}
                options={{
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
                    title: '이벤트',
                }} />

            <AdminEventStack.Screen name="SendUserEventDetailScreen"
                component={SendUserEventDetailScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("SendUserEventScreen")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />

            <AdminEventStack.Screen name="SendUserEventScreen"
                component={SendUserEventScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CheckEventScreen")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />

            <AdminEventStack.Screen name="EventRegistrationScreen"
                component={EventRegistrationScreen}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CheckEventScreen")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '이벤트',
                }} />
        </AdminEventStack.Navigator>
    );
};

//관리자 신고관리 스택 네비게이터
export const ReportStackNavigator = ({ navigation, route }: any) => {
    return (
        <ReportPostStack.Navigator>
            <ReportPostStack.Screen name="ReportPostsScreen"
                component={ReportPostsScreen}
                options={{
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
                    title: '게시글 신고 관리',
                }} />
        </ReportPostStack.Navigator>
    );
};

//관리자 아이템 등록 및 수정
export const RegisterItemStackNavigator = ({ navigation, route }: any) => {
    const { userdata } = route.params;
    return (
        <RegisterItemStack.Navigator>
            <RegisterItemStack.Screen name="CheckRegistItemScreen"
                component={CheckRegistItemScreen}
                initialParams={{ userdata }}
                options={{
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
                
            <RegisterItemStack.Screen name="RegisterItemScreen"
                component={RegisterItemScreen}
                initialParams={{ userdata }}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CheckRegistItemScreen")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '물품 등록',
                }} />

            <RegisterItemStack.Screen name="EditItemScreen"
                component={EditItemScreen}
                initialParams={{ userdata }}
                options={{
                    headerStyle: {
                        backgroundColor: '#F27405',
                    },
                    headerLeft: () => (
                        <TouchableOpacity
                            onPress={() => navigation.navigate("CheckRegistItemScreen")}>
                            <IconD style={{ marginLeft: 10, }} name="back" size={30} color="white" />
                        </TouchableOpacity>
                    ),
                    headerTintColor: 'white',
                    headerTitleAlign: 'center',
                    title: '물품 편집',
                }} />
        </RegisterItemStack.Navigator>
    );
};