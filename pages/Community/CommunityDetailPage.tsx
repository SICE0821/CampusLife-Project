import React from 'react';
import { useNavigation, RouteProp, useRoute  } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParam} from '../../types/type';

import {Text, View, Button,} from 'react-native';


type CommunityDetailPageProps = {
    navigation : StackNavigationProp<RootStackParam, 'CommunityDetailPage'>
    route: RouteProp<RootStackParam, 'CommunityDetailPage'>;
  };


const F1 = ({jungyouhwan} : any) => {
    return (
        <View>
            <Text>{jungyouhwan}</Text>
        </View>
    )
}

const CoummunityDetailPage : React.FC<CommunityDetailPageProps> = ({route, navigation}) => {
    const { name, age } = route.params;
    return (
        <View>
            <Text>Name: {name}</Text>
            <Text>Age: {age}</Text>
            <Button title='이동 하자~' onPress={() => navigation.navigate("CommunityPage")}/>
            <F1 jungyouhwan = "정유환"/>
        </View>
    );
};

export default CoummunityDetailPage;
