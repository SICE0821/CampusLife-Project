import React from 'react';
import { useNavigation, RouteProp, useRoute  } from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParam} from '../../types/type';

import {Text, View, Button,} from 'react-native';

const DepartmentBoardPage:React.FC = () => {
    return (
        <View>
            <Text>학과 게시판입니다.</Text>
            <Text>왜 탭이 안될까요?</Text>
        </View>
    );
};

export default DepartmentBoardPage;
