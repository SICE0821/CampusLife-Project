import React, { useState, useRef, useCallback, useEffect} from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl, Alert, Dimensions } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { PostDeatilData, UserData, CommentsWithRecomments } from '../../types/type'
import { Swipeable, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import config from '../../config';

type ReportUser = {
    reportId: number,
    report_name: string,
    post_id: number,
    user_id: number,
    title: string,
    contents: string,
    write_date: string,
    view: number,
    like: number,
    userStudentId: number,
    userTitle: string,
    post_writer: string,
    campusId: number,
    campusName: string,
    departmentId: number,
    writer_department: string
    writer_profile : string,
}

const width = Dimensions.get("window").width;

const ReportPostsScreen = ({ route, navigation }: any) => {
  const { userdata } = route.params;
  const ref = useRef(null);
  const [userReport, setUserReport] = useState<ReportUser[]>([]); //포스터에 대한 정보.
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await get_user_report();
    setTimeout(() => setRefreshing(false), 500); // 0.5초 후에 새로고침 완료
  };


  const get_user_report = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getUserReportInfo`, {
        method: 'POST', // POST 요청으로 유지
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // 응답이 올바른 JSON인지 확인합니다.
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUserReport(data);
      return data;
    } catch (error) {
      console.error('값 가져오기 실패:', error);
    }
  }


  useFocusEffect(
    React.useCallback(() => {
        get_user_report();
    }, [])
);
  
  const renderEmptyItem = () => {

    return (
        <View style={{ height: 85 }}>
        </View>
    )
}

  const renderItem = ({ item, index }: { item: ReportUser, index: number }) => (
    <GestureHandlerRootView style={{ flex: 1 }}>
            <TouchableWithoutFeedback onPress={async () => {
                    navigation.navigate("PostDetailScreen", { item , userData:userdata })}}>
                <View style={styles.writeboxcontainer}>
                    <View style={styles.writetitle}>
                        <View style={styles.titlebox}>
                            <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                        </View>
                        <View style={styles.eyesnum}>
                            <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                            <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                        </View>
                    </View>
                    <View style={styles.wirterandtime}>
                        <View style={styles.writerbox}>
                        <Text
                                style={{
                                    fontSize: 13,
                                    marginLeft: 10,
                                    color:
                                        item.userTitle === "학교" ? 'red' :
                                        item.userTitle === "반장" ? 'green' :
                                        item.userTitle === "학우회장" ? 'blue' :
                                        'black'
                                }}
                            >
                                {item.post_writer}
                            </Text>
                            <Text style={{color:'black'}}> | {item.write_date}</Text>
                            <Text style={{color : 'black', fontSize: 13, paddingLeft : 20}}>신고자 : {item.report_name}</Text>
                        </View>
                        <View style={styles.likenum}>
                            <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                            <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
    </GestureHandlerRootView>
);


return (
    <View style={styles.container} ref={ref}>
        <View style = {{backgroundColor : 'white'}}></View>
        <FlatList
            style={styles.flatliststyle}
            data={userReport}
            renderItem={renderItem}
            ListFooterComponent={renderEmptyItem}
            refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
        //keyExtractor={(item) => item.id}
        />
    </View>
);
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'white',
  },
  topnavigationborder: {
      flex: 1,
      //backgroundColor : "blue",
      borderWidth: 2,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      marginTop: 57,
  },

  flatlisttopline: {
      //backgroundColor : 'red',
      //right : 118,
      height: 60,
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC'
  },

  flatliststyle: {
      //marginTop : 40,
      //backgroundColor : 'blue',
  },

  writeboxcontainer: {
      //padding: 50, 
      borderBottomWidth: 1,
      borderBottomColor: '#CCCCCC',
      //backgroundColor: 'red',
      height: 70,
  },

  writetitle: {
      flex: 0.6,
      flexDirection: 'row',
      marginTop: 5,
      //backgroundColor : 'yellow'
  },

  wirterandtime: {
      flex: 0.4,
      flexDirection: 'row'
      //backgroundColor : 'yellow'
  },

  titlebox: {
      flex: 0.85,
      //backgroundColor : 'green'
  },
  eyesnum: {
      flex: 0.15,
      flexDirection: 'row',
      // backgroundColor : 'red',
      alignItems: 'center',
      justifyContent: 'center',
  },
  writerbox: {
      flex: 0.85,
      flexDirection: 'row',
      //backgroundColor : 'yellow',
  },
  likenum: {
      flex: 0.15,
      flexDirection: 'row',
      //backgroundColor : 'red',
      alignItems: 'center',
      justifyContent: 'center',
  },
  delete: {
      width: 20,
      height: 20,
      backgroundColor: 'red',
  }
});

export default ReportPostsScreen;
