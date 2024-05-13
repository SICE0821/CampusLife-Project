import React, {useState} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {Text, TextInput, View, StyleSheet,TouchableOpacity, ViewBase} from 'react-native';
import IconA from 'react-native-vector-icons/FontAwesome5';
import IconB from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';

const StudentInfoScreen = ({navigation} : any) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const checkopenModal = () => {
        setIsModalVisible(true); // 모달 열기
      };

    const checkcloseModal = () => {
        navigation.goBack();
    };

    const openModal = () => {
        setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
    };
    
      const closeModal = () => {
        setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
    };
    
    useFocusEffect(
        React.useCallback(() => {
          changeHeaderRightContent();
        }, [])
      );

      const changeHeaderRightContent = () => {
        navigation.setOptions({
            tabBarVisible: {display: 'none'}
        });
      };
    return (
        <View style={styles.container}>
            <View style={styles.profilePicture}>
                <TouchableOpacity>
                    <IconA name="camera" size={32} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.containerBox}>
                <View style={{marginTop : 30}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>이름</Text>
                    <TextInput style={styles.TextInput} />
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>생년월일</Text>
                    <TextInput style={styles.TextInput} />
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>EMAIL</Text>
                    <TextInput style={styles.TextInput} />
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>학교 / 학과</Text>
                    <TextInput style={styles.TextInput} />
                </View>
                <View style={styles.grade}>
                    <View>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>학년</Text>
                        <View style={styles.TextInput2}>
                            <TouchableOpacity onPress={openModal}>
                                <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{marginLeft : 30}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>재학상태</Text>
                        <View style={styles.TextInput2} >
                            <TouchableOpacity onPress={openModal}>
                                <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>아이디</Text>
                    <TextInput style={styles.TextInput} />
                </View>
                <TouchableOpacity onPress={openModal} style={styles.TextInput3}>
                        <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>회원 탈퇴</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal} style={styles.TextInput3}>
                        <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>로그아웃</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    profilePicture : {
        width : 110,
        height : 110,
        backgroundColor :'#909090',
        borderRadius : 60,
        marginTop : 10,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    containerBox : {
        marginTop : 15,
        borderTopWidth : 2,
        borderLeftWidth : 2,
        borderRightWidth : 2,
        borderColor : "black",
        width : 485,
        height : 700,
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,
        alignItems: 'center', 
        //backgroundColor : "black",
    },
    TextInput:{
        borderColor : "black",
        borderWidth : 2,
        borderRadius : 15,
        width : 400,
        height : 50,
        
    },
    TextInput2:{
        justifyContent: 'center',
        alignItems: 'flex-end',
        borderColor : "black",
        borderWidth : 2,
        borderRadius : 15,
        width : 120,
        height : 50, 
        
    },
    TextInput3:{
        borderColor : "black",
        borderWidth : 2,
        borderRadius : 15,
        width : 400,
        height : 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop : 15,
    },
    grade:{
        flexDirection : 'row',
        marginTop : 10,
        marginRight : 130,
    },
    modal:{

    }
})

export default StudentInfoScreen;
