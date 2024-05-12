import React from 'react';
import {Text, View, StyleSheet,} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconA from 'react-native-vector-icons/FontAwesome5';

const AlarmDialogScreen = () => {
    return (
        <View style ={styles.container}>
            <Text>알림 확인 페이지</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center'
    },
    }
)

export default AlarmDialogScreen;
