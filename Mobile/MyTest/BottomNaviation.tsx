import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreenStack } from './StackNavigation';
import HomeScreen from './HomeScreen'
import { Text, TouchableOpacity, View } from 'react-native';
import IconD from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import CommunityScreen from './CommunityScreen';
import { useEffect } from 'react';

const Tab = createBottomTabNavigator();

export const BottomNavigation = ({route} : any) => {
  const navigation : any = useNavigation();
  const { userpk } = route.params;
  console.log(userpk);
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
                                 <TouchableOpacity onPress={() => navigation.navigate("DetailScreen", {userpk : userpk})}>
                                    <IconD style = {{marginRight : 10}} name="form" size = {30} color="white" />
                                  </TouchableOpacity>
                              </View>
                            ),        
                          }}
                          initialParams={{ userpk: userpk }}/>
            <Tab.Screen name = "CommunityScreen" 
                        component = {CommunityScreen}
                        initialParams={{ userpk: userpk }}/>
        </Tab.Navigator>
    );
};