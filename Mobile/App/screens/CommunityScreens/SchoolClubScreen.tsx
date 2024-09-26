import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl, Button } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import config from '../../config';

//ex
const postObject = {
    "contents": "쿵짜라락 쿵짝 쿵짜라락 쿵짝\n\n사쿠라야??\n사쿠라네!!!!!!!!!!!!\nㅠ",
    "date": "2024-06-22",
    "like": 45,
    "name": "박용만",
    "post_id": 884,
    "title": "자 성적 확인 들어갑니다",
    "user_title": "일반학생",
    "view": 111
  };
  
const SchoolClubScreen = ({ route, navigation }: any) => {
    console.log("you are in SchoolClubScreen");
    const { userdata } = route.params;
    return (
        <View style={styles.container}>
            <Text>게시된 동아리 글을 확인할 수 있는 스크린</Text>
            <View style = {{height : 20}}></View>
            <Button
                title="동아리 상세페이지 들어가기."
                onPress={() => {
                    console.log("동아리 상세페이지 들어가기.");
                    navigation.navigate("SchoolClubDetailScreen", { item : postObject, userData : userdata })
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

export default SchoolClubScreen;