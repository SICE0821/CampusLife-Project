import AllBoardsPage from '../pages/community/AllBoardsPage'
import AllBoardersPageDetail from '../pages/community/AllBoardsPageDetail'
import BookmarkPageDetail from '../pages/community/BookmarkPageDetail'
import HotBoardsPage from '../pages/community/HotBoardsPage'
import DepartmentBoardPage from '../pages/community/DepartmentBoardPage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TopTab = createBottomTabNavigator();
const BottomTab = createBottomTabNavigator();

export const CommunityBottomNavigation = () => {
    return (
        <BottomTab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 60,
                    position: 'absolute',
                    height: 60,
                    //marginLeft : 12,
                    //marginRight : 150,
                    borderWidth : 0,
                    elevation : 0,
                    backgroundColor : 'blue',
                
                },
                tabBarLabelStyle: { 
                    fontSize : 10,
                    alignItems: 'center',
                    marginBottom : 14,
                    fontWeight: 'bold',
                    },
                tabBarActiveTintColor : 'black'
            
        }}>
            <BottomTab.Screen name = '전체' component={AllBoardersPageDetail} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}>
            </BottomTab.Screen>

            <BottomTab.Screen name = 'HOT게시글' component={BookmarkPageDetail} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,

                            }} >
            </BottomTab.Screen>

            <BottomTab.Screen name = '책갈피' component={HotBoardsPage} options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }} >
            </BottomTab.Screen>
        </BottomTab.Navigator>

    )
}

export const CommunityTopNavigation = () => {
    return (
        <TopTab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 0,
                    position: 'absolute',
                    height: 60,
                    marginLeft : 12,
                    marginRight : 150,
                    borderWidth : 0,
                    elevation : 0,
                    backgroundColor : 'blue',
                
                },
                tabBarLabelStyle: { 
                    fontSize : 23,
                    alignItems: 'center',
                    marginBottom : 14,
                    fontWeight: 'bold',
                    },
                tabBarActiveTintColor : 'black'
                
            }}>
            <TopTab.Screen name="전체 게시판"
                        component={CommunityBottomNavigation}
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
            <TopTab.Screen name="학과 게시판" 
                        component={DepartmentBoardPage} 
                        options = {{
                            headerShown : false,
                            tabBarIcon: () => null,
                            }}/>
        </TopTab.Navigator>
    );
}