import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    DimensionValue,
    Dimensions,
    useWindowDimensions,
  } from 'react-native';

const Tab = createBottomTabNavigator();

const Screen1 = () => {
    return (
      <View>
        <Text>Screen 1</Text>
      </View>
    );
  };
  
  const Screen2 = () => {
    return (
      <View>
        <Text>Screen 2</Text>
      </View>
    );
  };
  
  const Screen3 = () => {
    return (
      <View>
        <Text>Screen 3</Text>
      </View>
    );
  };
  
  const Screen4 = () => {
    return (
      <View>
        <Text>Screen 4</Text>
      </View>
    );
  };
  
  const Screen5 = () => {
    return (
      <View>
        <Text>Screen 5</Text>
      </View>
    );
  };
  
  const BottomTabs = () => {
      return (
          <Tab.Navigator>
              <Tab.Screen name="Screen1" component={Screen1} />
              <Tab.Screen name="Screen2" component={Screen2} />
              <Tab.Screen name="Screen3" component={Screen3} />
              <Tab.Screen name="Screen4" component={Screen4} />
              <Tab.Screen name="Screen5" component={Screen5} />
          </Tab.Navigator>
      );
  }

  export default BottomTabs;

