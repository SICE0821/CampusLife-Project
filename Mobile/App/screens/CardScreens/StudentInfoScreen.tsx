import React, {useState, useCallback} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {Text, TextInput, View, StyleSheet,TouchableOpacity, ViewBase} from 'react-native';
import IconA from 'react-native-vector-icons/FontAwesome5';
import IconB from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import { UserData } from "../../types/type"

const StudentInfoScreen = ({route} : any) => {
    const navigation = useNavigation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userdata } = route.params;
    const [userData, setUserData] = useState<UserData>(userdata);
    const [selectallposter, setselectapllposterOption] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
    const [selectdepartmentposter, setselectdepartmentposter] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리

    const handleAllPosterPress = () => {
        setselectapllposterOption(1);
        setselectdepartmentposter(0);
      };
    
      const handleDepartmentPosterPress = () => {
        setselectapllposterOption(0);
        setselectdepartmentposter(1);
      };

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

    const settingUserData = () => {
        setUserData(userdata);
      }

      useFocusEffect(
        React.useCallback(() => {
            settingUserData();
        }, [])
    )
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
                    <TextInput style={styles.TextInput}>
                        <Text style={styles.Textfont}>{userData.name}</Text>
                    </TextInput> 
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>생년월일</Text>
                    <TextInput style={styles.TextInput}>
                        <Text style={styles.Textfont}>{userData.birth}</Text>
                    </TextInput> 
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>EMAIL</Text>
                    <TextInput style={styles.TextInput}>
                        <Text style={styles.Textfont}>{userData.email}</Text>
                    </TextInput> 
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>학교 / 학과</Text>
                    <View style={styles.TextInput}>
                        <Text style={styles.Textfont}>asd</Text>
                    </View> 
                </View>
                <View style={styles.grade}>
                    <View>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>학년</Text>
                        <View style={styles.TextInput2}>
                            <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom : 3, marginLeft : 5}}>{userData.grade}학년</Text>
                            <TouchableOpacity onPress={openModal}>
                                <Text style={{ color: 'black'}}><IconB name="down" size={30} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style = {{marginLeft : 30}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>재학상태</Text>
                        <View style={styles.TextInput2} >
                            <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom : 3, marginLeft : 5}}>{userData.currentstatus}</Text>
                            <TouchableOpacity onPress={openModal}>
                                <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{marginTop : 10}}>
                    <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>아이디</Text>
                    <View style={styles.TextInput}>
                        <Text style={styles.Textfont}>{userData.id}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={openModal} style={styles.TextInput3}>
                        <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>회원 탈퇴</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal} style={styles.TextInput3}>
                        <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>로그아웃</Text>
                </TouchableOpacity>
            </View>
            <ModalBox
                isOpen={isModalOpen}
                style={styles.modal}
                position="bottom"
                swipeToClose={false}
                onClosed={closeModal}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.allposter} onPress={handleAllPosterPress}>
                        <Text style={[styles.noallposterfont, selectallposter == 1 && styles.yesallposterfont]}> 전체 게시판 </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.allposter} onPress={handleDepartmentPosterPress}>
                        <Text style={[styles.noallposterfont, selectdepartmentposter === 1 && styles.yesallposterfont]}> 학과 게시판 </Text>
                    </TouchableOpacity>
                    <View style={styles.writeButtom}>
                        <View style={{ flex: 0.65, }}>
                        </View>
                        <TouchableOpacity onPress={closeModal} style={{ flex: 0.35, justifyContent: 'center', alignItems: "center", backgroundColor: '#9A9EFF' }}>
                            <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
                        </TouchableOpacity>
                    </View>
                </View>


            </ModalBox>
            
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
    Textfont:{
        fontSize: 17, 
        fontWeight: "bold", 
        color: "black",
        marginTop : 10,
    },
    TextInput:{
        borderColor : "black",
        borderWidth : 2,
        borderRadius : 15,
        width : 400,
        height : 50,
    },
    TextInput2:{
        flexDirection : "row",
        alignItems: 'center',
        justifyContent: 'space-between',
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

    TextInput4:{
        borderColor : "black",
        borderWidth : 2,
        borderRadius : 15,
        width : 400,
        height : 50,
        fontSize: 17, 
        fontWeight: "bold", 
        color: "black",
        
    },
    grade:{
        flexDirection : 'row',
        marginTop : 10,
        marginRight : 130,
    },
    modal: { // 모달 창 css
        borderTopLeftRadius : 20,
        borderTopRightRadius : 20,
        height: 600,
      },

    modalContent: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: 'white',
      },

    allposter: {
        flex: 0.2,
        //backgroundColor : 'red',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        borderBottomWidth: 2,
      },

    noallposterfont: {
        color: '#CCCCCC',
        fontSize: 25,
        marginTop: 15,
    },

    writeButtom: {
        flex: 0.6,
        //backgroundColor : 'green',
      },

    yesallposterfont : {
        fontSize: 25,
        marginTop: 15,
        color: 'black'
    }
})

export default StudentInfoScreen;
