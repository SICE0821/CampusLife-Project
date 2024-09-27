import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl, Button } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import config from '../../config';
  
const SchoolClubSignStateScreen = ({ route, navigation }: any) => {
    console.log("you are in SchoolClubSignStateScreen");
    const { item, userData } = route.params;
    return (
        <View style={styles.container}>
            <Text>동아리 신청 현황 스크린</Text>
            <View style = {{height : 20}}></View>
            <Button
                title="해당 신청문 상세보기"
                onPress={() => {
                    navigation.navigate("SchoolClubSignDetailScreen", { item , userData})
                    console.log("해당 신청문 상세보기");
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

export default SchoolClubSignStateScreen;