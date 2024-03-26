import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import IconA from 'react-native-vector-icons/AntDesign';

const App = () => {
  const [notificationEnabled1, setNotificationEnabled1] = useState(true); {/* 학교 공지 알림 */}
  const [notificationEnabled2, setNotificationEnabled2] = useState(false); {/* 학과 공지 알림 */}
  const [notificationEnabled3, setNotificationEnabled3] = useState(true); {/* 이벤트 알림 */}
  const [notificationEnabled4, setNotificationEnabled4] = useState(false); {/* 자유게시판 게시물 알림 */}
  const [notificationEnabled5, setNotificationEnabled5] = useState(false); {/* 학과게시판 게시물 알림 */}
  const [notificationEnabled6, setNotificationEnabled6] = useState(true); {/* 내 게시물 댓글 알림 */}
  const [notificationEnabled7, setNotificationEnabled7] = useState(true); {/* 내 댓글 대댓글 알림 */}
  const [notificationEnabled8, setNotificationEnabled8] = useState(true); {/* 오늘의 강의 알림 */}
  const [notificationEnabled9, setNotificationEnabled9] = useState(true); {/* 강의 알림 */}

  const aram1 = () => {
    setNotificationEnabled1(previousState => !previousState);
  };
  const aram2 = () => {
    setNotificationEnabled2(previousState => !previousState);
  };
  const aram3 = () => {
    setNotificationEnabled3(previousState => !previousState);
  }
  const aram4 = () => {
    setNotificationEnabled4(previousState => !previousState);
  };
  const aram5 = () => {
    setNotificationEnabled5(previousState => !previousState);
  };
  const aram6 = () => {
    setNotificationEnabled6(previousState => !previousState);
  }
  const aram7 = () => {
    setNotificationEnabled7(previousState => !previousState);
  };
  const aram8 = () => {
    setNotificationEnabled8(previousState => !previousState);
  };
  const aram9 = () => {
    setNotificationEnabled9(previousState => !previousState);
  }

  return (
    <View>
      {/* 탑 네비게이션 바 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {console.log("뒤로 가기 누름")}}>
          <IconA style = {{backgroundColor: 'red'}} name="back" size = {44} color="black" />
        </TouchableOpacity>
        <View style={styles.rectangle}>
          <Text style={styles.topLabel}>알림설정</Text>
        </View>
      </View>

      {/* 첫번째 영역 */}
      <View style={styles.aramArea}>
        <Text style={styles.subTitle}>공지 알림</Text>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>학교 공지 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled1}
              onValueChange={aram1}
            />
          </View>
        </View>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>학과 공지 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled2}
              onValueChange={aram2}
            />
          </View>
        </View>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>이벤트 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled3}
              onValueChange={aram3}
            />
          </View>
        </View>
      </View>
      <View style={styles.horizontalLine} />

      {/* 두번째 영역 */}
      <View style={styles.aramArea}>
        <Text style={styles.subTitle}>게시물 알림</Text> 
        <View style={styles.aramGroup}> 
          <Text style={styles.label}>자유게시판 게시물 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled4}
              onValueChange={aram4}
            />
          </View>
        </View>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>학과게시판 게시물 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled5}
              onValueChange={aram5}
            />
          </View>
        </View>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>내 게시물 댓글 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled6}
              onValueChange={aram6}
            />
          </View>
        </View>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>내 댓글 대댓글 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled7}
              onValueChange={aram7}
            />
          </View>
        </View>
      </View>
      <View style={styles.horizontalLine} />

      {/* 세번째 영역 */}
      <View style={styles.aramArea}>
        <Text style={styles.subTitle}>시간표 알림</Text> 
        <View style={styles.aramGroup}> 
          <Text style={styles.label}>오늘의 강의 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled8}
              onValueChange={aram8}
            />
          </View>
        </View>
        <Text style={styles.smallText}>(매일 9시에 오늘 있는 강의를 알림으로 알려줍니다.)</Text>
        <View style={styles.aramGroup}>
          <Text style={styles.label}>강의 알림</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Switch
              value={notificationEnabled9}
              onValueChange={aram9}
            />
          </View>
        </View>
        <Text style={styles.smallText}>(강의 10분 전 강의명과 강의실을 알림으로 받습니다.)</Text>
      </View>
      <View style={styles.horizontalLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  rectangle: {
    flex: 1,
    height: 44,
    backgroundColor: 'orange',
    justifyContent: 'center'
  },
  label: {
    fontSize: 18,
    textAlign: 'left',
    marginLeft: 5,
    marginBottom: 8
  },
  topLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'white'
  },
  aramArea: {
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 10
  },
  subTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10
  },
  aramGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  horizontalLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
    margin: 15,
  },
  smallText: {
    fontSize: 10,
    color: 'gray',
    marginTop: -12,
    marginLeft: 5
  },
});

export default App;
