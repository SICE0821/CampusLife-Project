import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreenStack } from './StackNavigation';
import HomeScreen from './HomeScreen'
import { Text, TouchableOpacity, View } from 'react-native';
import IconD from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import CommunityScreen from './CommunityScreen';

const Tab = createBottomTabNavigator();

export const BottomNavigation = () => {
    const navigation : any = useNavigation();
    return(
        <Tab.Navigator>
            <Tab.Screen name = "HomeScreen" 
                        component = {HomeScreen}
                        options={{
                            headerStyle: {
                              backgroundColor: '#F27405',
                            },
                            headerRight: () => (
                              <View style = {{flexDirection : 'row'}}>
                                 <TouchableOpacity onPress={() => navigation.navigate("DetailScreen")}>
                                    <IconD style = {{marginRight : 10}} name="form" size = {30} color="white" />
                                  </TouchableOpacity>
                              </View>
                            ),        
                          }}/>
            <Tab.Screen name = "CommunityScreen" component = {CommunityScreen}/>
        </Tab.Navigator>
    );
};