import React from 'react';
import { useNavigation, RouteProp, useRoute  } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParam} from '../../types/type';

import {Text, View, Button,StyleSheet} from 'react-native';

const DepartmentBoardPage:React.FC = () => {
    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationspace}>

            </View>
            <Text>전체 게시판입니다.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
    },
    topnavigationspace : {
        flex : 0.09,
        //backgroundColor : 'yellow',
    }

    }
)

export default DepartmentBoardPage;
