import React, { useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, TextInput, View, StyleSheet, TouchableOpacity, Alert, ScrollView, Image, Dimensions } from 'react-native';
import IconA from 'react-native-vector-icons/FontAwesome5';
import IconB from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import ImageCropPicker from 'react-native-image-crop-picker';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import { UserData } from "../../types/type"
import config from '../../config';

const width = Dimensions.get('window').width;
let content: any;

const StudentInfoScreen = ({ route, navigation }: any) => {
    const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userData, Userdepartment } = route.params;
    const [userdata, setUserData] = useState<UserData>(userData);
    const [UserUniversity, setUserUniversity] = useState();
    const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
    const [selectedstatus, setSelectedstatus] = useState<string | null>(null);  // 선택된 학년을 추적하는 state
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState(`${config.photoUrl}/${userData.profile_photo}`);
    const [imageResponse, setImageResponse] = useState<ImagePickerResponse | null>(null);
    const [imageFormData, setImageFormData] = useState<FormData | null>(null);
    const [imageFileName, setImageFileName] = useState<string | null>(null);


    const getPhotos = () => {
        const options: any = {
            mediaType: 'photo',
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("사진 선택 취소");
            } else if (response.errorCode) {
                console.log(`imagePicker Error : ${response.errorCode}`)
            } else {
                if (response.assets && response.assets.length > 0) {
                    setImageResponse(response);
                    response.assets[0].fileName = `${Date.now()}.png`
                    const formData = new FormData();
                    formData.append('images', {
                        uri: response.assets[0].uri,
                        type: response.assets[0].type,
                        name: response.assets[0].fileName
                    });
                    setImageFormData(formData);
                }
            }
        })
    }

    const get_user_university = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_university_name`, {
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
            const response = await fetch(`${config.serverUrl}/delete_user`, {
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
            const response = await fetch(`${config.serverUrl}/updateAccount`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userdata.email,
                    grade: userdata.grade,
                    currentstatus: userdata.currentstatus,
                    student_id: userdata.student_pk,
                })
            })
            const data = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
            if (response.ok && userdata.title !== "학교") {
                if (imageFormData) {
                    const imageFileName = await uploadImages(imageFormData);
                    //console.log(imageFileName);
                    if (imageFileName) {
                        userdata.profile_photo = imageFileName;
                        await UpdateImg(imageFileName); //학생게정
                    }
                }
                Alert.alert(data.message, "", [
                    {
                        text: "확인",
                        onPress: () => navigation.navigate("MainScreen", { updatedUserData: userdata })
                    }
                ]); // 성공적으로 삭제되면 알림창 표시
            } else {
                //await UpdateImg(); //학교계정
                Alert.alert(data.message, "", [
                    {
                        text: "확인",
                        onPress: () => navigation.navigate("AdminScreen", { updatedUserData: userdata })
                    }
                ]); // 성공적으로 삭제되면 알림창 표시
            }
        } catch (error) {
            console.error('계정 업데이트 실패:', error);
            Alert.alert("계정 업데이트 실패"); // 실패 시 알림창 표시
        }
    }

    const defaultImg = async () => {
        setUserData(prevuserdata => ({ ...prevuserdata, profile_photo: null }));
    }

    const UpdateImg = async (imageFileName: string | null) => {
        try {
            const response = await fetch(`${config.serverUrl}/updateImg`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profilePhoto: imageFileName,
                    user_id: userdata.user_pk
                })
            });
            const data = await response.json(); // 서버로부터의 응답을 JSON으로 파싱
        } catch (error) {
            console.error('이미지 업데이트 실패:', error);
        }
    }
    /*
    const getPhotos = async () => {
        try {
            const res = await ImageCropPicker.openPicker({
                multiple: true,
                mediaType: 'photo',
                includeBase64: true,
                includeExif: true,
            });
            const formData = new FormData();
            res.forEach(image => {
                formData.append('images', {
                    uri: image.path,
                    type: 'image/jpeg',
                    name: `${Date.now()}_${image.filename || userData.user_pk}.png`,
                });
            });
            await uploadImages(formData); 
        } catch (error) {
            // 사용자가 이미지 선택을 취소한 경우 오류가 발생할 수 있음
            //console.log('사용자가 이미지 선택을 취소했습니다.');
            // 또는 다른 방법으로 사용자에게 메시지를 보여줄 수 있음
        }
    };
    */


    const uploadImages = async (formData: FormData) => {
        try {
            const response = await fetch(`${config.serverUrl}/upload`, {
                method: 'POST',
                body: formData,
            });
            const imageName = await response.text(); // Assuming the server sends plain text
            return imageName;
        } catch (error: any) {
            console.error('Image upload failed:', error);
            // Provide more details for debugging
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

    if (imageResponse) {
        if (imageResponse && imageResponse.assets) {
            content = <Image source={{ uri: imageResponse.assets[0].uri }} style={styles.image} />;
        }
    } else if (userData.profile_photo) {
        content = <Image source={{ uri: `${config.photoUrl}/${userData.profile_photo}` }} style={styles.image} />;
    } else {
        content = <IconA name="user" size={50} color="black" style={styles.image} />;
    }

    useEffect(() => {
        // userData.grade가 1학년이면 selectedGrade를 1로 설정
        if (userdata.grade === 1) {
            setSelectedGrade(1);
        } else if (userdata.grade === 2) {
            setSelectedGrade(2);
        } else if (userdata.grade === 3) {
            setSelectedGrade(3);
        }
        if (userdata.currentstatus === "졸업") {
            setSelectedstatus("졸업");
        } else if (userdata.currentstatus === "휴학중") {
            setSelectedstatus("휴학중");
        } else if (userdata.currentstatus === "재학중") {
            setSelectedstatus("재학중");
        }
    }, [userdata.grade, userdata.currentstatus, userdata.profile_photo]
    );


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.profilePicture}>
                    {content}
                    <TouchableOpacity style={styles.cameraButton} onPress={openCameraModal}>
                        <IconA name="camera" size={32} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.studentInfoArea}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>학교</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>{UserUniversity}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>학과</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>{Userdepartment}</Text>
                            </View>
                        </View>
                    </View>
                    {userdata.title !== '학교' && ( // 학교면 재학상태, 학년 안보임 졸업하면 학년 안보임
                        <View>
                            {userdata.currentstatus == "졸업" && (

                                <View style={styles.infoRow}>
                                    <View style={styles.infoTitle}>
                                        <Text style={styles.infoTitleText}>재학상태</Text>
                                    </View>
                                    <View style={styles.infoData}>
                                        <View style={styles.infoDataTextArea}>
                                            <Text style={styles.infoDataText}>{userdata.currentstatus}</Text>
                                        </View>
                                    </View>
                                </View>
                            )}
                            {userdata.currentstatus !== "졸업" && (
                                <View>
                                    <View style={styles.infoRow}>
                                        <View style={styles.infoTitle}>
                                            <Text style={styles.infoTitleText}>학년</Text>
                                        </View>
                                        <View style={styles.infoData}>
                                            <View style={styles.infoDataTextArea}>
                                                <Text style={styles.infoDataText}>{userdata.grade}학년</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.infoRow}>
                                        <View style={styles.infoTitle}>
                                            <Text style={styles.infoTitleText}>재학상태</Text>
                                        </View>
                                        <View style={styles.infoData}>
                                            <View style={styles.infoDataTextArea}>
                                                <Text style={styles.infoDataText}>{userdata.currentstatus}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>학번</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>2033053</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>생년월일</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>{userdata.birth}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>성명(한글)</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>{userdata.name}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>성명(영어)</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>아이디</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}>{userdata.id}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>전화(집)</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>전화(H.P)</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>E-mail</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <TextInput 
                                    style={styles.infoDataInput} 
                                    value={userdata.email} 
                                    onChangeText={(text) => setUserData(prevuserdata => ({ ...prevuserdata, email: text }))}
                                />
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>우편주소</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>주소</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>상세주소</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>은행명</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>은행계좌</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <View style={styles.infoTitle}>
                            <Text style={styles.infoTitleText}>예금주</Text>
                        </View>
                        <View style={styles.infoData}>
                            <View style={styles.infoDataTextArea}>
                                <Text style={styles.infoDataText}></Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={styles.biuttonArea}>
                    <TouchableOpacity style={[styles.button, { borderBottomWidth: 1, borderColor: 'gray' }]} onPress={DeleteUser}>
                        <Text style={styles.buttonText}>회원 탈퇴</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, { borderTopWidth: 1, borderColor: 'gray' }]} onPress={Logout}>
                        <Text style={styles.buttonText}>로그아웃</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <ModalBox
                isOpen={isModalOpen}
                style={test.modal}
                position="bottom"
                swipeToClose={false}
                onClosed={closegradeModal}
            >
                <View style={test.modalContent}>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedGrade === 1 && test.selectedGrade]}
                        onPress={() => handleGradeSelect(1)}
                    >
                        <Text style={[test.gradeButtonText, selectedGrade === 1 && { color: "black" }]}>1학년</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedGrade === 2 && test.selectedGrade]}
                        onPress={() => handleGradeSelect(2)}
                    >
                        <Text style={[test.gradeButtonText, selectedGrade === 2 && { color: "black" }]}>2학년</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedGrade === 3 && test.selectedGrade]}
                        onPress={() => handleGradeSelect(3)}
                    >
                        <Text style={[test.gradeButtonText, selectedGrade === 3 && { color: "black" }]}>3학년</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closegradeModal} style={test.completeButton}>
                        <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
                    </TouchableOpacity>
                </View>
            </ModalBox>
            <ModalBox
                isOpen={isStatusModalOpen}
                style={test.modal}
                position="bottom"
                swipeToClose={false}
                onClosed={closeStatusModal}
            >
                <View style={test.modalContent}>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedstatus === "졸업" && test.selectedGrade]}
                        onPress={() => handlestatusSelect("졸업")}
                    >
                        <Text style={[test.gradeButtonText, selectedstatus === "졸업" && { color: "black" }]}>졸업</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedstatus === "휴학중" && test.selectedGrade]}
                        onPress={() => handlestatusSelect("휴학중")}
                    >
                        <Text style={[test.gradeButtonText, selectedstatus === "휴학중" && { color: "black" }]}>휴학중</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[test.gradeButton, selectedstatus === "재학중" && test.selectedGrade]}
                        onPress={() => handlestatusSelect("재학중")}
                    >
                        <Text style={[test.gradeButtonText, selectedstatus === "재학중" && { color: "black" }]}>재학중</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={closeStatusModal} style={test.completeButton}>
                        <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
                    </TouchableOpacity>
                </View>
            </ModalBox>
            <ModalBox
                isOpen={isCameraModalOpen}
                style={test.Cameramodal}
                position="top"
                swipeToClose={false}
                onClosed={closeCameraModal}
            >
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 18, color: "black", fontWeight: "bold" }}>프로필 사진 변경</Text>
                    <TouchableOpacity onPress={() => getPhotos()} style={{ marginTop: 20 }} >
                        <Text style={{ fontSize: 22, color: "blue", fontWeight: "bold" }}>앨범에서 사진 선택</Text>
                    </TouchableOpacity>
                    <View style={{ borderColor: "black", borderWidth: 2, width: 270, marginTop: 10, marginBottom: 10, }}>

                    </View>
                    <TouchableOpacity onPress={defaultImg}>
                        <Text style={{ fontSize: 22, color: "blue", fontWeight: "bold" }}>기본 이미지 설정</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={test.modalconfirmButton} onPress={closeCameraModal} >
                    <Text style={{ fontSize: 20, color: 'black', fontWeight: "bold" }}>닫기</Text>
                </TouchableOpacity>
            </ModalBox>
            <TouchableOpacity style={styles.confirmButton} onPress={UpdateAccount}>
                <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignContent: 'center'
    },
    profilePicture: {
        marginTop: 10,
        width: 110,
        height: 110,
        borderRadius: 60,
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'relative',
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
        backgroundColor: "#909090",
        paddingLeft: 35,
        paddingTop: 25
    },
    studentInfoArea: { // 학생 정보 영역
        backgroundColor: 'white',
        width: '90%',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 20
    },
    infoRow: { // 정보 행 영역
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        height: 45,
        borderWidth: 1,
        borderColor: 'gray',
    },
    infoTitle: { // 제목 영역
        width: '30%',
        height: '100%',
        borderRightWidth: 2,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center'
    },
    infoTitleText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    infoData: { // 정보 영역
        width: '70%',
        height: '100%',
    },
    infoDataTextArea: {
        flex: 1,
        margin: 2,
        borderWidth: 2,
        borderRadius: 3,
        borderColor: 'gray',
        justifyContent: 'center'
    },
    infoDataText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8
    },
    infoDataInput: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
        padding: 4,
    },
    biuttonArea: {
        width: '90%',
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: 'gray',
        marginVertical: 10
    },
    button: { // 버튼 (회원탈퇴, 로그아웃)
        width: '100%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'red'
    },
    confirmButton: { // 확인 버튼
        backgroundColor: '#9A9EFF',
        width: 480,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButtonText: {
        fontSize: 22, 
        color: 'black', 
        fontWeight: "bold"
    }
})

const test = StyleSheet.create({
    modal: { // 모달 창 css
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 450,
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
        width: 480,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmButton: {
        backgroundColor: '#9A9EFF',
        width: 480,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
    Cameramodal: {
        borderRadius: 20,
        height: 150,
        width: 320,
        marginTop: 300,
    },
    modalconfirmButton: {
        backgroundColor: '#9A9EFF',
        borderRadius: 20,
        width: 320,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
    },
})

export default StudentInfoScreen;
