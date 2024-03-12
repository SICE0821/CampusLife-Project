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

const CommunityDetailPage: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParam>>();
    const route = useRoute<RootStackParam>();
    const { name, age } = route.params;
    return (
        <View>
            <Button title = "이동 가자" onPress = {() => navigation.navigate("CommunityPage")}/>
        </View>
    );
};

export default CommunityDetailPage;
