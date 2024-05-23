    import React, {useState, useCallback, useEffect} from 'react';
    import { useNavigation, useFocusEffect } from '@react-navigation/native';
    import {Text, TextInput, View, StyleSheet,TouchableOpacity, Alert, ScrollView, Image} from 'react-native';
    import IconA from 'react-native-vector-icons/FontAwesome5';
    import IconB from 'react-native-vector-icons/AntDesign';
    import Modal from 'react-native-modal';
    import ModalBox from 'react-native-modalbox';
    import ImageCropPicker from 'react-native-image-crop-picker';
    import { UserData } from "../../types/type"

    const StudentInfoScreen = ({route, navigation} : any) => {
        const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
        const [isModalOpen, setIsModalOpen] = useState(false);
        const { userData, Userdepartment } = route.params;
        const [userdata, setUserData] = useState<UserData>(userData);
        const [UserUniversity, setUserUniversity] = useState();
        const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
        const [selectedstatus, setSelectedstatus] = useState<string | null>(null);  // 선택된 학년을 추적하는 state
        const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

        const get_user_university = async () => {
            try {
            const response = await fetch('http://192.168.35.207:3000/get_university_name', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                university_name: userdata.campus_pk,
                })
            })
            const useruniversity = await response.json();
            const userUniversity = useruniversity.useruniversity; //키값을 치면 값을 json에서 추출할 수 있다.
            setUserUniversity(userUniversity);
            } catch (error) {
            console.error('유저 학교 이름 가져오기 실패:', error);
            }
        }


        const DeleteUser = async () => {
            try {
                const response = await fetch('http://192.168.35.207:3000/delete_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_pk: userdata.user_pk
                    })
                });
                const data = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
                if (response.ok) {
                    Alert.alert(data.message, "", [
                        {
                            text: "확인",
                            onPress: () => navigation.navigate("LoginScreen")
                        }
                    ]); // 성공적으로 삭제되면 알림창 표시
                } else {
                    throw new Error(data.message); // 실패 시 에러 처리
                }
            } catch (error) {
                console.error('계정 삭제 실패:', error);
                Alert.alert("계정 삭제 실패"); // 실패 시 알림창 표시
            }
        }

        const UpdateAccount = async () => {
            try {
            const response = await fetch('http://192.168.35.207:3000/updateAccount', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                email: userdata.email,
                grade : userdata.grade,
                currentstatus : userdata.currentstatus,
                student_id : userdata.student_pk,
                })
            })
            const data = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
            if (response.ok) {
                UpdateImg();
                Alert.alert(data.message, "", [
                    {
                        text: "확인",
                        onPress: () => navigation.navigate("MainScreen" , {updatedUserData: userdata})
                    }
                ]); // 성공적으로 삭제되면 알림창 표시
            } else {
                throw new Error(data.message); // 실패 시 에러 처리
            }
        } catch (error) {
            console.error('계정 업데이트 실패:', error);
            Alert.alert("계정 업데이트 실패"); // 실패 시 알림창 표시
        }
    }

    const defaultImg = async() => {
        setUserData(prevuserdata => ({ ...prevuserdata, profile_photo: null }));
    }

    const UpdateImg = async() => {
        try {
            const response = await fetch('http://192.168.35.207:3000/updateImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profilePhoto : userdata.profile_photo,
                    user_id : userdata.user_pk
                })
            });
            const data = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
        } catch (error) {
            console.error('이미지 업데이트 실패:', error);
        }
    }

    const getPhotos = async () => {
        try {
          const res = await ImageCropPicker.openPicker({
            multiple: true,
            mediaType: 'photo',
            includeBase64: true,
            includeExif: true,
          });
          const profile_photo = res.map(image => image.path);
          setUserData(prevuserdata => ({ ...prevuserdata, profile_photo: profile_photo[0] })); // 첫 번째 사진 경로로 업데이트
          // 여기서 UpdateImg 함수를 호출하여 변경된 userdata를 서버에 업데이트할 수 있습니다.
        } catch (error) {
          console.error('사진 선택 실패:', error);
          throw error; // 오류 발생 시 throw
        }
    };


        const handleGradeSelect = (grade: number) => {
            setSelectedGrade(grade);
            setUserData(prevuserdata => ({ ...prevuserdata, grade })); 
        };

        const handlestatusSelect = (currentstatus: string) => {
            setSelectedstatus(currentstatus);
            setUserData(prevuserdata => ({ ...prevuserdata, currentstatus })); 
        };

        const Logout = () => {
            navigation.navigate("LoginScreen");
        }

        const opengradeModal = () => {
            setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
        };
        
        const closegradeModal = () => {
            setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
        };

        const openStatusModal = () => {
            setIsStatusModalOpen(true); // 새로운 모달을 열기 위해 상태를 true로 설정
        };
        
        const closeStatusModal = () => {
            setIsStatusModalOpen(false); // 새로운 모달을 닫기 위해 상태를 false로 설정
        };

        const openCameraModal = () => {
            setIsCameraModalOpen(true); // 새로운 모달을 열기 위해 상태를 true로 설정
        };
        
        const closeCameraModal = () => {
            setIsCameraModalOpen(false); // 새로운 모달을 닫기 위해 상태를 false로 설정
        };

        const settingUserData = () => {
            setUserData(userData);
        }

        useFocusEffect(
            React.useCallback(() => {
                settingUserData();
                get_user_university();
                //get_student_Info();
            }, [])
        )

        useEffect(() => {
            // userData.grade가 1학년이면 selectedGrade를 1로 설정
            if (userdata.grade === 1) {
                setSelectedGrade(1);
            }else if (userdata.grade === 2){
                setSelectedGrade(2);
            }else if (userdata.grade === 3){
                setSelectedGrade(3);
            }
            if (userdata.currentstatus === "졸업") {
                setSelectedstatus("졸업");
            }else if (userdata.currentstatus === "휴학중"){
                setSelectedstatus("휴학중");
            }else if (userdata.currentstatus === "재학중"){
                setSelectedstatus("재학중");
            }
        }, [userdata.grade,userdata.currentstatus,userdata.profile_photo]
    ); 
        

        return (
            <ScrollView>
            <View style={styles.container}>
                    <View style={styles.profilePicture}>
                        {userdata.profile_photo ? (
                            <Image source={{ uri: userdata.profile_photo }} style={styles.image} />
                        ) : (
                            <IconA name="user" size={50} color="black" style={styles.image}/>
                        )}
                        <TouchableOpacity style={styles.cameraButton} onPress={openCameraModal}>
                            <IconA name="camera" size={32} color="black" />
                        </TouchableOpacity>
                    </View>
                <View style={styles.containerBox}>
                    <View style={{marginTop : 30}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>이름</Text>
                        <View style={styles.TextInput}>
                            <Text style={styles.Textfont}>{userdata.name}</Text>
                        </View> 
                    </View>
                    <View style={{marginTop : 10}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>생년월윌</Text>
                        <View style={styles.TextInput}>
                            <Text style={styles.Textfont}>{userdata.birth}</Text>
                        </View> 
                    </View>
                    <View style={{marginTop : 10}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>EMAIL</Text>
                        <TextInput
                            style={[styles.TextInput, { fontSize: 17, fontWeight: "bold", color: "black", paddingLeft : 10,}]}
                            value={userdata.email}
                            onChangeText={(text) => setUserData(prevuserdata => ({ ...prevuserdata, email: text }))}
                        />
                    </View>
                    <View style={{marginTop : 10}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>학교 / 학과</Text>
                        <View style={styles.TextInput}>
                            <Text style={styles.Textfont}>{UserUniversity} / {Userdepartment}</Text>
                        </View> 
                    </View>
                    <View style={styles.grade}>
                        {userdata.currentstatus !== "졸업" && (
                            <View>
                                <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10 }}>학년</Text>
                                <View style={styles.TextInput2}>
                                    <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 3, marginLeft: 9 }}>{userdata.grade}학년</Text>
                                    <TouchableOpacity onPress={opengradeModal}>
                                        <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {userdata.currentstatus !== "졸업" ? (
                            <View style={{ marginLeft: 30 }}>
                                <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10 }}>재학상태</Text>
                                <View style={styles.TextInput2} >
                                    <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 3, marginLeft: 9 }}>{userdata.currentstatus}</Text>
                                    <TouchableOpacity onPress={openStatusModal}>
                                        <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            <View style={{ marginRight: 150 }}>
                                <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10 }}>재학상태</Text>
                                <View style={styles.TextInput2} >
                                    <Text style={{ fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 3, marginLeft: 5 }}>{userdata.currentstatus}</Text>
                                    <TouchableOpacity onPress={openStatusModal}>
                                        <Text style={{ color: 'black' }}><IconB name="down" size={30} /></Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>

                    <View style={{marginTop : 10}}>
                        <Text style={{fontSize: 17, fontWeight: "bold", color: "black", marginBottom: 7, marginLeft: 10}}>아이디</Text>
                        <View style={styles.TextInput}>
                            <Text style={styles.Textfont}>{userdata.id}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.TextInput3} onPress={DeleteUser}>
                            <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>회원 탈퇴</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.TextInput3} onPress = {Logout}>
                            <Text style={{ color: 'red' , fontSize : 20, fontWeight : "bold"}}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
                <ModalBox
                    isOpen={isModalOpen}
                    style={styles.modal}
                    position="bottom"
                    swipeToClose={false}
                    onClosed={closegradeModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedGrade=== 1 && styles.selectedGrade]}
                            onPress={() => handleGradeSelect(1)}
                        >
                            <Text style={[styles.gradeButtonText, selectedGrade === 1 && { color: "black" }]}>1학년</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedGrade === 2 && styles.selectedGrade]}
                            onPress={() => handleGradeSelect(2)}
                        >
                            <Text style={[styles.gradeButtonText, selectedGrade === 2 && { color: "black" }]}>2학년</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedGrade === 3 && styles.selectedGrade]}
                            onPress={() => handleGradeSelect(3)}
                        >
                            <Text style={[styles.gradeButtonText, selectedGrade === 3 && { color: "black" }]}>3학년</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closegradeModal} style={styles.completeButton}>
                            <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
                        </TouchableOpacity>
                    </View>
                </ModalBox>
                <ModalBox
                    isOpen={isStatusModalOpen}
                    style={styles.modal}
                    position="bottom"
                    swipeToClose={false}
                    onClosed={closeStatusModal}
                >
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedstatus === "졸업" && styles.selectedGrade]}
                            onPress={() => handlestatusSelect("졸업")}
                        >
                            <Text style={[styles.gradeButtonText, selectedstatus === "졸업" && { color: "black" }]}>졸업</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedstatus === "휴학중" && styles.selectedGrade]}
                            onPress={() => handlestatusSelect("휴학중")}
                        >
                            <Text style={[styles.gradeButtonText, selectedstatus === "휴학중" && { color: "black" }]}>휴학중</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.gradeButton, selectedstatus === "재학중" && styles.selectedGrade]}
                            onPress={() => handlestatusSelect("재학중")}
                        >
                            <Text style={[styles.gradeButtonText, selectedstatus === "재학중" && { color: "black" }]}>재학중</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeStatusModal} style={styles.completeButton}>
                            <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
                        </TouchableOpacity>
                    </View>
                </ModalBox>
                <ModalBox
                    isOpen={isCameraModalOpen}
                    style={styles.Cameramodal}
                    position="top"
                    swipeToClose={false}
                    onClosed={closeCameraModal}
                >
                    <View style={{alignItems : "center", justifyContent : "center"}}>
                        <Text style={{ fontSize : 18, color : "black", fontWeight : "bold"}}>프로필 사진 변경</Text>
                        <TouchableOpacity onPress={getPhotos} style={{marginTop : 20}} >
                            <Text style={{ fontSize : 22, color : "blue", fontWeight : "bold"}}>앨범에서 사진 선택</Text>
                        </TouchableOpacity>
                        <View style = {{borderColor : "black", borderWidth : 2, width : 270, marginTop : 10, marginBottom : 10,}}>
                            
                        </View>
                        <TouchableOpacity onPress={defaultImg}>
                            <Text style = {{ fontSize : 22, color : "blue", fontWeight : "bold"}}>기본 이미지 설정</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.modalconfirmButton} onPress = {closeCameraModal} >
                        <Text style={{ fontSize: 20, color: 'black', fontWeight : "bold" }}>닫기</Text>
                    </TouchableOpacity> 
                </ModalBox>
                    <TouchableOpacity style={styles.confirmButton} onPress = {UpdateAccount}>
                        <Text style={{ fontSize: 20, color: 'black', fontWeight : "bold" }}>확인</Text>
                    </TouchableOpacity>
            </View>
            </ScrollView>
        );
    };

    const styles = StyleSheet.create({
        container : {
            flex : 1,
            backgroundColor : 'white',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        profilePicture: {
            marginTop : 10,
            width: 110,
            height: 110,
            borderRadius: 60,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
          },
        containerBox : {
            marginTop : 15,
            borderTopWidth : 2,
            borderLeftWidth : 2,
            borderRightWidth : 2,
            borderColor : "black",
            width : 415,
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
            marginLeft : 9,
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
            height : 450,
        },

        modalContent: { 
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
        },

        gradeButton: {
            borderBottomWidth: 2,
            borderRadius: 15,
            width: 420,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 35,
            borderColor: "#CCCCCC",
        },

        // 선택된 학년 버튼의 스타일
        selectedGrade: {
            borderColor: "black",
            color: "black",
        },

        gradeButtonText: {
            fontSize: 25,
            fontWeight: "bold",
            color: "#CCCCCC",
        },

        completeButton: {
            marginTop: 65,
            backgroundColor: '#9A9EFF',
            width : 480,
            height : 70,
            alignItems: 'center',
            justifyContent: 'center',
        },
        confirmButton:{
            backgroundColor: '#9A9EFF',
            width : 480,
            height : 70,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop : 30,
        },
        Cameramodal : {
            borderRadius : 20,
            height : 150,
            width : 320,
            marginTop : 300,
        },

        modalconfirmButton:{
            backgroundColor: '#9A9EFF',
            borderRadius : 20,
            width : 320,
            height : 70,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop : 30,
        },

        cameraButton: {
            position: 'absolute',
            bottom: -5,
            right: -5,
            borderRadius: 16,
            padding: 5,
            zIndex: 1,
          },

          image: {
            width: '100%',
            height: '100%',
            borderRadius: 60,
            backgroundColor : "#909090",
            paddingLeft : 35,
            paddingTop : 25
          },
    })

    export default StudentInfoScreen;
