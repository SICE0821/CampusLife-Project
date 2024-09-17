import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import config from '../config';

export type UserPoint = {
  point : number,
}

const PointHistoryScreen = ({ route, navigation }: any) => {
  console.log("you are in PointHistoryScreen");
  const { userdata } = route.params;
  const [selectMenu, setselectMenu] = useState(1);
  const [historyData, setHistoryData]: any[] = useState();
  const [plusPointData, setPlusPointData] = useState();
  const [minusPointData, setMinusPointData] = useState();
  const [userPoint, setUserPoint] = useState<UserPoint>();

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          await getHistoryData();
          await get_user_point();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [])
  );

  const get_user_point = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/get_user_point`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userdata.user_pk
        })
      })
      const userPoint = await response.json();
      //console.log(userPoint);
      setUserPoint(userPoint);
    } catch (error) {
      console.error('유저 포인트 가져오기 실패:', error);
    }
  }


  //유저의 포인트 기록을 불러옴
  const getHistoryData = async () => {
    const PlusPointData: any = [];
    const MinusPointData: any = [];
    try {
      const response = await fetch(`${config.serverUrl}/getHistoryData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userdata.user_pk
        }),
      });
      const historyData: any[] = await response.json();
      historyData.forEach(item => {
        if (item.point_status === 1) {
          PlusPointData.push(item);
        } else {
          MinusPointData.push(item);
        }
      });
      setHistoryData(historyData);
      setPlusPointData(PlusPointData);
      setMinusPointData(MinusPointData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const FilterData = () => {
    if (selectMenu === 1) {
      return historyData
    } else if (selectMenu === 2) {
      return plusPointData
    } else if (selectMenu === 3) {
      return minusPointData
    }
  }


  const renderItem = ({ item, index }: { item: any, index: any }) => (
    <View style={styles.itemcontainer}>
      <View style={styles.itemDescriptioncontainer}>
        <Text style={styles.contentFont}>{item.content}</Text>
        <Text style={styles.timeFont}>{item.point_time}</Text>
      </View>
      <View style={styles.itempointcontainer}>
        <Text style={item.point_status === 1 ? styles.PostivepointFont : styles.NegativepointFont}>{item.point_status === 1 ? '+' : '-'}{item.point_num}P</Text>
        <Text style={styles.status}>{item.point_status === 1 ? '적립' : '사용'}</Text>

      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.PointSection}>
        <View style={styles.DescriptionBox}>
          <Text style={styles.DescriptionFont}>{userdata.name}님의 보유 포인트</Text>
        </View>
        <View style={styles.PointBox}>
          <Text style={styles.PointFont}>{userPoint?.point}</Text>
          <Text style={styles.PointPFont}>P</Text>
        </View>
      </View>
      <View style={styles.HistorySection}>
        <View style={styles.menuBox}>
          <View style={{ width: '5%' }}></View>
          <TouchableOpacity onPress={() => { setselectMenu(1) }} style={selectMenu === 1 ? styles.Selectmenu : styles.noSelectmenu}>
            <Text style={selectMenu === 1 ? styles.SelectmenuFont : styles.noSelectmenuFont}>
              전체
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setselectMenu(2) }} style={selectMenu === 2 ? styles.Selectmenu : styles.noSelectmenu}>
            <Text style={selectMenu === 2 ? styles.SelectmenuFont : styles.noSelectmenuFont}>
              적립
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setselectMenu(3) }} style={selectMenu === 3 ? styles.Selectmenu : styles.noSelectmenu}>
            <Text style={selectMenu === 3 ? styles.SelectmenuFont : styles.noSelectmenuFont}>
              사용
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.DescriptionBox2}>
          <Text style={styles.DescriptionFont2}>{userdata.name}님의 포인트 내역</Text>
        </View>
        <FlatList
          data={FilterData()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  PointSection: {
    height: '17%',
    //backgroundColor: 'red',
    paddingTop: 20
  },

  DescriptionBox: {
    //backgroundColor: 'blue',
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  DescriptionFont: {
    fontSize: 20,
    color: 'grey'
  },

  PointBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  PointFont: {
    fontSize: 60,
    fontWeight: '900',
    color: '#F27400'
  },

  PointPFont: {
    fontSize: 60,
    color: '#F27400',
    marginLeft: 5,
    fontWeight: 'bold'
  },

  HistorySection: {
    height: '100%',
    backgroundColor: '#F2F2F2',
  },

  menuBox: {
    height: '7%',
    //backgroundColor : 'red',
    flexDirection: 'row',
    alignItems: 'center'
  },

  noSelectmenu: {
    width: '15%',
    height: '60%',
    backgroundColor: 'white',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3
  },

  Selectmenu: {
    width: '15%',
    height: '60%',
    backgroundColor: 'black',
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 3
  },

  noSelectmenuFont: {
    fontSize: 20,
    color: '#404040'
  },

  SelectmenuFont: {
    fontSize: 20,
    color: 'white'
  },

  DescriptionBox2: {
    height: '5%',
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: 'darkgrey'
  },

  DescriptionFont2: {
    fontSize: 17,
    color: 'black',
    marginBottom: 20,
    marginLeft: 25
  },

  itemcontainer: {
    minHeight: 150,
    //backgroundColor : 'red',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: 'darkgrey'

  },

  itemDescriptioncontainer: {
    width: "60%",
    //backgroundColor : 'red',
    paddingTop: 25,
    paddingLeft: 25,
  },

  contentFont: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },

  timeFont: {
    fontSize: 15,
    color: 'black',
    marginTop: 10
  },
  itempointcontainer: {
    width: "40%",
    //backgroundColor : 'red',
    paddingTop: 25,
    paddingRight: 25,
  },
  PostivepointFont: {
    fontSize: 35,
    fontWeight: '900',
    color: "#F27400",
    textAlign: 'right'
  },

  NegativepointFont: {
    fontSize: 35,
    fontWeight: '900',
    color: "red",
    textAlign: 'right'
  },

  status: {
    fontSize: 17,
    color: 'black',
    textAlign: 'right',
    fontWeight: 'bold'
  }


});

export default PointHistoryScreen;
