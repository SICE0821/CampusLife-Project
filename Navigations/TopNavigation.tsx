import AllBoardsPage from '../pages/Community/AllBoardsPage'
import DepartmentBoardPage from '../pages/Community/DepartmentBoardPage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Tab = createBottomTabNavigator();

export const CommunityTopNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 0,
                    position: 'absolute',
                    height: 60,
                    marginLeft : 12,
                    marginRight : 150,
                    borderWidth : 0,
                    elevation : 0,
                
                },
                tabBarLabelStyle: { 
                    fontSize : 23,
                    alignItems: 'center',
                    marginBottom : 14,
                    fontWeight: 'bold',
                    },
                tabBarActiveTintColor : 'black'
                
            }}>
            <Tab.Screen name="전체 게시판"
                        component={AllBoardsPage}
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
            <Tab.Screen name="학과 게시판" 
                        component={DepartmentBoardPage} 
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
        </Tab.Navigator>
    );
}