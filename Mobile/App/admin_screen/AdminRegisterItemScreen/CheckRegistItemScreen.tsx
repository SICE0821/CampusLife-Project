import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Image, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import IconC from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { UserData, UserHaveCouponData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const CheckRegistItemScreen = ({ navigation, route }: any) => {
  const { userdata } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata);
  const [AdminRegisterItem, setAdminRegisterItem] = useState<UserHaveCouponData[]>([]);
  //console.log(userdata);

  useFocusEffect(
    React.useCallback(() => {
      setUserData(userdata);
      getItems();
    }, [])
  );

  //관리자에서 Item 목록 가져오기.
  const getItems = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/admin_get_items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk
        })
      })
      const items = await response.json();
      setAdminRegisterItem(items);

    } catch (error) {
      console.error(error);
    }
  }

  //랜더링 할 아이템들
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.itemcontainer}
      onPress={() => console.log("등록된 아이템 선택")}>
      <View style={{
        height: 150, width: '95%', borderWidth: 2, borderColor: "#F27405", flexDirection: 'row',
        alignItems: 'center'
      }}>
        <View style={{ width: '30%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: '100%', height: '100%' }}>
            <Image style={{ flex: 1, width: '100%', resizeMode: 'contain' }} source={{ uri: `${config.photoUrl}/${item.image_num}.png` }} />
          </View>
        </View>
        <View style={{ height: '100%', width: '50%', padding: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '50%' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black', marginTop: 20 }}>[ {item.name} ]</Text>
            </View>
            <View>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ED9E2B', marginTop: 20 }}>[ {item.price}P ]</Text>
            </View>
          </View>
          <Text style={{ marginTop: 5, fontSize: 16, color: 'black' }}>{item.explain}</Text>
          <Text style={{ marginTop: 5, fontSize: 16, color: 'black' }}>{item.using_time}</Text>
        </View>
        <View style={{ width: '20%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '90%', height: '95%', backgroundColor: '#F7B02E', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white' }}> <IconC name="mail-forward" size={40} /></Text>
            <Text style={{ fontSize: 18, color: 'white' }}>수정하기</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={AdminRegisterItem}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemcontainer: {
    width: '100%',
    height: 150,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default CheckRegistItemScreen;
