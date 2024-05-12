import React from 'react';
import {Text, View, StyleSheet,} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconA from 'react-native-vector-icons/FontAwesome5';

const StudyRoomScreen = () => {
    return (
        <View style = {styles.container}>
            <Text>스터디룸 페이지</Text>
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

export default StudyRoomScreen;
