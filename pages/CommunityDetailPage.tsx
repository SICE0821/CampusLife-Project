import React from 'react';
import { useNavigation, RouteProp, useRoute  } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParam } from './CommunityPage';


import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Button,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParam } from './CommunityPage'

type CommunityDetailPageProps = {
    route: RouteProp<RootStackParam, 'CoummunityDetailPage'>;
  };
  

const CoummunityDetailPage : React.FC<CommunityDetailPageProps> = ({route}) => {
    const { name, age } = route.params;
    return (
        <View>
            <Text>Name: {name}</Text>
            <Text>Age: {age}</Text>
        </View>
    );
};

export default CoummunityDetailPage;
