import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
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
