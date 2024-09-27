import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl, Button } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import config from '../../config';
  
const SchoolClubSignDetailScreen = ({ route, navigation }: any) => {
    console.log("you are in SchoolClubSignDetailScreen");
    const { item, userData } = route.params;
    return (
        <View style={styles.container}>
            <Text>유저 동아리 신청문 상세보기</Text>
            <View style = {{height : 20}}></View>
            <Button
                title="남도현씨는 우리와 함께 갑시다"
                onPress={() => {
                    console.log("남도현씨는 우리와 함께 갑시다");
                }}
            />
            <View style = {{height : 20}}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },

}
)

export default SchoolClubSignDetailScreen;