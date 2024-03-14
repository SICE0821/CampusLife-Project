import AllBoardsPage from '../pages/Community/AllBoardsPage'
import DepartmentBoardPage from '../pages/Community/DepartmentBoardPage'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

export const CommunityTopNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle : {
                    top : 0,
                    position: 'absolute',
                    height: 60,
                    marginRight : 150,
                    borderWidth : 0,
                    elevation : 0,
                },
                tabBarLabelStyle: { 
                    fontSize : 23,
                    alignItems: 'center',
                    marginBottom : 14,
                    }
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