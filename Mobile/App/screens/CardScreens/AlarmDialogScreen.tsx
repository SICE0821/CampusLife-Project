import React, { useState, useCallback } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, RefreshControl, TouchableHighlight, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const bellpng = require('../../assets/bell.png'); // 기본 알람 이미지
const announcementpng = require('../../assets/announcement.png'); // 공지사항 알람 이미지
const commentpng = require('../../assets/comment.png'); // 댓글 알람 이미지
const eventpng = require('../../assets/event.png'); // 이벤트 알람 이미지

const image = [bellpng, announcementpng, commentpng, eventpng];
const theme = ['알람', '공지사항', '새로운 댓글이 생겼습니다.', '이벤트 알람'];

const initialAram = [
  [2, '(댓글 생긴 게시물 제목)', '01/23 13:48', 'DeadlineEventScreen'],
  [0, '이벤트를 참여해 포인트를 모아보세요!', '01/23 13:48', 'EventScreen'],
  [1, '컴퓨터 소프트웨어과 수강신청 안내', '01/23 13:48', 'AnnouncementScreen'],
  [3, '대학 촬영 대회 이벤트 시작!', '01/23 13:48', 'PhotoEventScreen'],
  // Add more items as needed
];

const AlarmDialogScreen = () => {
  const [aram, setAram] = useState(initialAram);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const handleLongPress = (index) => {
    Alert.alert(
      '알림 삭제',
      '이 알림을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { text: '삭제', onPress: () => deleteItem(index) },
      ],
      { cancelable: true }
    );
  };

  const deleteItem = (index) => {
    setAram(prevAram => prevAram.filter((_, i) => i !== index));
  };

  const handlePress = (item) => {
    console.log(item[3])
    navigation.navigate(item[3], { item });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.view}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {aram.map((item, index) => (
          <View key={index} style={{ alignItems: 'center' }}>
            <TouchableHighlight style={{ width: '90%' }}
              underlayColor="#BBBBBB"
              onPress={() => handlePress(item)}
              onLongPress={() => handleLongPress(index)}>
              <View style={styles.box}>
                <View style={styles.imagearea}>
                  <Image style={styles.image} source={image[item[0]]} />
                </View>
                <View style={styles.textArea}>
                  <Text style={styles.theme}>{theme[item[0]]}</Text>
                  <Text style={styles.content}>{item[1]}</Text>
                  <Text style={styles.time}>{item[2]}</Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomarea}>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  view: {
    marginTop: 5,
    width: '100%',
    alignSelf: 'center',
  },
  box: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  imagearea: {
    width: 70,
    height: 70,
    backgroundColor: '#FFDECF',
    borderRadius: 40,
    justifyContent: 'center'
  },
  image: {
    flex: 0.8,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textArea: {
    marginLeft: 10,
  },
  theme: {
    fontSize: 22,
    color: 'black',
    fontWeight: 'bold',
  },
  content: {
    fontSize: 17,
    color: 'black',
  },
  time: {
    fontSize: 15,
    color: 'black',
  },
  bottomarea: {
    width: '100%',
    height: 90,
  }
});

export default AlarmDialogScreen;
