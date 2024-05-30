import React, { useState, } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserData } from '../../types/type';
import IconB from 'react-native-vector-icons/AntDesign';
import ModalBox from 'react-native-modalbox';
import Swiper from 'react-native-swiper';

type EventItem = {
  objec_id: number,
  name: string,
  price: number,
  code_num: string,
  using_time: string,
  image_num: number,
  sell_check: boolean,
  explain: string,
  count: number,
}

const Item_Picture = {
  Item_num1: require(`../../assets/Item_num${1}.png`),
  Item_num2: require(`../../assets/Item_num${2}.png`),
  Item_num3: require(`../../assets/Item_num${3}.png`),
  Item_num4: require(`../../assets/Item_num${4}.png`),
  Item_num5: require(`../../assets/Item_num${5}.png`),
  Item_num6: require(`../../assets/Item_num${6}.png`),
  Item_num7: require(`../../assets/Item_num${7}.png`),
  Item_num8: require(`../../assets/Item_num${8}.png`),
};

const ItemRegistration: React.FC = ({ route, navigation }: any) => {
  const { userdata } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata);
  const [Item_data, setItem_data] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [ModalPicture, setModalPicture] = useState(1);
  const [itemname, setItemname]: any = useState();
  const [itemExplain, setItemExplain]: any = useState();
  const [deadline, setItemDeadline]: any = useState();
  const [point, setItemPoint]: any = useState();
  const [itemNum, setItemNum]: any = useState();
  const [maxBarcordNum, setMaxBarcordNum]: any = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedititem, Setselectedititem] = useState<EventItem>();
  const [editModalPicture, SeteditModalPicture] = useState(selectedititem?.image_num);


  const onRefresh = async () => {
    setRefreshing(true);
    await get_event_obj();
    setTimeout(() => setRefreshing(false), 2000); // 2초 후에 새로고침 완료
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  const openModal = () => {
    //navigation.setOptions({ tabBarVisible:false });
    setIsModalOpen(true);
  };

  const EditopenModal = (itemData : any) => {
    setIsEditModalOpen(true);
    Setselectedititem(itemData);
    SeteditModalPicture(selectedititem?.image_num)
  }

  const EditcloseModal = () => {
    setIsEditModalOpen(false);
  }

  const RegisterItem = require(`../../assets/RegisterItem.png`);

  const settingUserData = () => {
    setUserData(userdata);
  }

  const get_event_obj = async () => {
    try {
      const response = await fetch('http:// 172.16.108.2:3000/get_event_obj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
        })
      })
      const event_objs = await response.json();

      setItem_data(event_objs);
      //console.log(Item_data);
    } catch (error) {
      console.error('등록 상품 가져오기  실패:', error);
    }
  }

  const getItemImage = (itemNum: any) => {
    if (itemNum === 1) {
      return require(`../../assets/Item_num${1}.png`)
    } else if (itemNum === 2) {
      return require(`../../assets/Item_num${2}.png`);
    } else if (itemNum === 3) {
      return require(`../../assets/Item_num${3}.png`);
    } else if (itemNum === 4) {
      return require(`../../assets/Item_num${4}.png`);
    } else if (itemNum === 5) {
      return require(`../../assets/Item_num${5}.png`);
    } else if (itemNum === 6) {
      return require(`../../assets/Item_num${6}.png`);
    } else if (itemNum === 7) {
      return require(`../../assets/Item_num${7}.png`);
    } else if (itemNum === 8) {
      return require(`../../assets/Item_num${8}.png`);
    }
  };
  const getBarcordMaxNum = async () => {
    try {
      const response = await fetch('http:// 172.16.108.2:3000/getMaxBarcordNum');
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const MaxbarcordNum = await response.json();
      console.log(MaxbarcordNum.barcordMaxNum + 1);
      return MaxbarcordNum.barcordMaxNum + 1;

    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  }

  const PostItemObject = async () => {
    const maxbarcordnum = getBarcordMaxNum();
    try {
      const response = await fetch('http://192.168.35.194:3000/postItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
          name: itemname,
          price: parseInt(point),
          code_num: 5555,
          using_time: deadline,
          image_num: ModalPicture,
          sell_check: false,
          explain: itemExplain,
        })
      })
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  }

  const DeleteItemOject = async (itemData : any) => {
    try {
      const response = await fetch('http://192.168.35.194:3000/deleteItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: itemData?.name,
          deletenum : 1
        })
      })
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  }

  const UpdateItemOject = async () => {
    try {
      const response = await fetch('http://192.168.35.194:3000/updateItem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: selectedititem?.name,
          newname : itemname,
          price: parseInt(point),
          using_time: deadline,
          image_num: editModalPicture,
          sell_check: false,
          explain: itemExplain,
        })
      })
    } catch (error) {
      console.error('유저 정보 가져오기 실패:', error);
    }
  }

  const CountItemandPost = () => {
    for (let i = 0; i < itemNum; i++) {
      PostItemObject();
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      settingUserData();
      get_event_obj();
      getBarcordMaxNum();
    }, [])
  );

  const extraView = (
    <TouchableOpacity style={styles.addItemspace} onPress={() => openModal()}>
      <View style={styles.picturespace}>
        <View style={styles.addItem}>
          <Text style={{ color: "#FFC700" }}><IconB name="plussquareo" size={100} /></Text>
        </View>
      </View>
      <View style={styles.addItemText}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          상품을 등록해주세요!
        </Text>
        <Image style={{ width: 50, height: 50, marginLeft: 10, }} source={RegisterItem} />
      </View>
    </TouchableOpacity>
  );

  const EmptyView = (
    <View style={{ height: 100, backgroundColor: 'white' }}></View>
  );


  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
        {Item_data.map((Item_data, index) => (
          <View style={styles.itemspace} key={index}>
            <View style={styles.picturespace}>
              <View style={styles.picture}>
                <Image style={{ width: 100, height: 100 }} source={getItemImage(Item_data.image_num)} />
              </View>
            </View>
            <View style={styles.infospace}>
              <View style={styles.infospaceleft}>
                <Text style={styles.weightfont}>{Item_data.explain}</Text>
                <Text style={styles.font}>가격 : {Item_data.price}</Text>
                <Text style={styles.font}>수량 : {Item_data.count}</Text>
                <Text style={styles.smallfont}>사용기간 : {Item_data.using_time}</Text>
              </View>
              <View style={styles.infospaceright}>
                <View style={styles.buttontopspace}>
                  <TouchableOpacity style={styles.topbutton} onPress={() => EditopenModal(Item_data)}>
                    <Text style={{ fontSize: 18, color: 'black' }}>편집</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.buttonbottomspace}>
                  <TouchableOpacity style={styles.bottombutton} onPress={() => DeleteItemOject(Item_data)}>
                    <Text style={{ fontSize: 18, color: 'black' }}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
        {extraView}
        {EmptyView}
      </ScrollView>
      <ModalBox
        isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={styles.modaltopview}>
          <View style={styles.TopLeftModalView}>
            <View style={styles.ModalItemPicture}>
              <Image style={{ width: 100, height: 100 }} source={getItemImage(ModalPicture)} />
            </View>
            <Text>등록할 상품 사진</Text>
          </View>
          <View style={styles.TopRightModalView}>
            <Swiper>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(1)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num1} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(2)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num2} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(3)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num3} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(4)} >
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num4} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(5)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num5} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(6)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num6} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(7)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num7} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => setModalPicture(8)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num8} />
                  </TouchableOpacity>
                </View>
              </View>
            </Swiper>
          </View>
          <View>
          </View>
        </View>
        <View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>상품이름 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemname}
              onChangeText={(text) => setItemname(text)}
              placeholder="상품이름을 입력해주세요!"
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>상품설명 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemExplain}
              onChangeText={(text) => setItemExplain(text)}
              placeholder="상품설명을 입력해주세요!"
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>사용기간 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={deadline}
              onChangeText={(text) => setItemDeadline(text)}
              placeholder="사용기간을 입력해주세요!"
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>포인트 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={point}
              onChangeText={(text) => setItemPoint(text)}
              placeholder="포인트를 입력해주세요!"
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>갯수 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemNum}
              onChangeText={(text) => setItemNum(text)}
              placeholder="갯수를 입력해주세요!"
            />
          </View>
        </View>
        <View style={styles.buttonspace}>
          <TouchableOpacity style={styles.registerbutton} onPress={() => {CountItemandPost()}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>등록</Text>
          </TouchableOpacity>
        </View>
      </ModalBox>
      <ModalBox
        isOpen={isEditModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={EditcloseModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={styles.modaltopview}>
          <View style={styles.TopLeftModalView}>
            <View style={styles.ModalItemPicture}>
              <Image style={{ width: 100, height: 100 }} source={getItemImage(editModalPicture)} />
            </View>
            <Text>변경할 상품 사진</Text>
          </View>
          <View style={styles.TopRightModalView}>
            <Swiper>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(1)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num1} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(2)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num2} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(3)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num3} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(4)} >
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num4} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(5)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num5} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(6)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num6} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.swiperview}>
                <View style={styles.swiperLeftView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(7)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num7} />
                  </TouchableOpacity>
                </View>
                <View style={styles.swiperRightView}>
                  <TouchableOpacity style={styles.swiperitempicture} onPress={() => SeteditModalPicture(8)}>
                    <Image style={{ width: 100, height: 100 }} source={Item_Picture.Item_num8} />
                  </TouchableOpacity>
                </View>
              </View>
            </Swiper>
          </View>
          <View>
          </View>
        </View>
        <View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>상품이름 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemname}
              onChangeText={(text) => setItemname(text)}
              placeholder={selectedititem?.name}
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>상품설명 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemExplain}
              onChangeText={(text) => setItemExplain(text)}
              placeholder={selectedititem?.explain}
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>사용기간 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={deadline}
              onChangeText={(text) => setItemDeadline(text)}
              placeholder={selectedititem?.using_time}
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>포인트 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={point}
              onChangeText={(text) => setItemPoint(text)}
              placeholder= {String(selectedititem?.price)}
            />
          </View>
          <View style={styles.namespace}>
            <Text style={{ fontSize: 18, marginLeft: 20, color: 'black', fontWeight: 'bold' }}>갯수 :</Text>
            <TextInput
              style={{ borderColor: 'gray', fontSize: 18, }}
              value={itemNum}
              onChangeText={(text) => setItemNum(text)}
              placeholder={String(selectedititem?.count)}
            />
          </View>
        </View>
        <View style={styles.buttonspace}>
          <TouchableOpacity style={styles.registerbutton} onPress={() => {UpdateItemOject()}}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>변경</Text>
          </TouchableOpacity>
        </View>
      </ModalBox>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  itemspace: {
    height: 140,
    //backgroundColor : 'yellow',
    marginTop: 10,
    flexDirection: 'row',
  },
  picturespace: {
    flex: 0.3,
    //backgroundColor : 'red',
    justifyContent: 'center',
    alignItems: 'center'
  },
  infospace: {
    flex: 0.7,
    //backgroundColor : 'blue',
    flexDirection: 'row'
  },

  picture: {
    width: 130,
    height: 130,
    backgroundColor: '#f0f0f0', // 약간 어두운 흰색 배경색
    borderRadius: 20, // 테두리의 둥근 정도
    borderWidth: 5, // 테두리 두께
    borderColor: 'white', // 테두리 색상
    shadowColor: 'black', // 그림자 색상
    shadowOffset: { width: 0, height: 0 }, // 그림자 위치 (가로, 세로)
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 10, // 그림자의 둥근 정도
    justifyContent: 'center',
    alignItems: 'center'
  },

  infospaceleft: {
    flex: 0.6,
    //backgroundColor : 'red',
    justifyContent: 'center',

  },
  infospaceright: {
    flex: 0.4,
    //backgroundColor : 'green',
  },
  weightfont: {
    color: 'black',
    fontSize: 16,
    fontWeight: "bold"
  },
  font: {
    color: 'black',
    fontSize: 16,
  },
  smallfont: {
    fontSize: 14,
  },
  buttontopspace: {
    flex: 0.5,
    //backgroundColor : 'yellow',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonbottomspace: {
    flex: 0.5,
    //backgroundColor : 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topbutton: {
    width: 80,
    height: 30,
    backgroundColor: '#9A9EFF',
    borderRadius: 10,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottombutton: {
    width: 80,
    height: 30,
    backgroundColor: '#9A9EFF',
    borderRadius: 10,
    marginBottom: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItem: {
    width: 130,
    height: 130,
    backgroundColor: '#f0f0f0', // 약간 어두운 흰색 배경색
    borderRadius: 20, // 테두리의 둥근 정도
    borderWidth: 5, // 테두리 두께
    borderColor: 'white', // 테두리 색상
    shadowColor: 'black', // 그림자 색상
    shadowOffset: { width: 0, height: 0 }, // 그림자 위치 (가로, 세로)
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 10, // 그림자의 둥근 정도
    justifyContent: 'center',
    alignItems: 'center'
  },
  addItemText: {
    flex: 0.7,
    //backgroundColor : 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  addItemspace: {
    height: 140,
    //backgroundColor : 'yellow',
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#A9A9A9',
    margin: 10,
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 700,
  },
  modaltopview: {
    height: 180,
    //backgroundColor : 'yellow',
    flexDirection: 'row'
  },
  TopLeftModalView: {
    flex: 0.3,
    //backgroundColor : 'red',
    alignItems: 'center',
    justifyContent: 'center',

  },
  TopRightModalView: {
    flex: 0.7,
    //backgroundColor: 'blue'
  },
  ModalItemPicture: {
    width: 130,
    height: 130,
    backgroundColor: '#f0f0f0', // 약간 어두운 흰색 배경색
    borderRadius: 20, // 테두리의 둥근 정도
    borderWidth: 5, // 테두리 두께
    borderColor: 'white', // 테두리 색상
    shadowColor: 'black', // 그림자 색상
    shadowOffset: { width: 0, height: 0 }, // 그림자 위치 (가로, 세로)
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 10, // 그림자의 둥근 정도
    justifyContent: 'center',
    alignItems: 'center'
  },
  swiperview: {
    flex: 1,
    margin: 20,
    //backgroundColor : 'red',
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
  },
  swiperLeftView: {
    flex: 0.5,
    //backgroundColor : 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperRightView: {
    flex: 0.5,
    //backgroundColor : 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swiperitempicture: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0', // 약간 어두운 흰색 배경색
    borderRadius: 20, // 테두리의 둥근 정도
    borderWidth: 5, // 테두리 두께
    borderColor: 'white', // 테두리 색상
    shadowColor: 'black', // 그림자 색상
    shadowOffset: { width: 0, height: 0 }, // 그림자 위치 (가로, 세로)
    shadowOpacity: 0.5, // 그림자 투명도
    shadowRadius: 10, // 그림자의 둥근 정도
    justifyContent: 'center',
    alignItems: 'center'
  },
  namespace: {
    height: 50,
    //dbackgroundColor: 'red',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    margin: 10,
    borderRadius: 10,
    borderColor: '#A9A9A9'
  },
  buttonspace: {
    height: 60,
    //backgroundColor : 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerbutton: {
    width: 200,
    height: 45,
    backgroundColor: '#9A9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  }
});

export default ItemRegistration;