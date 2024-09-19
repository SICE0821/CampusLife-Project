import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, Button, StyleSheet, Dimensions, TouchableOpacity, TextInput, ScrollView, Alert, Image } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconCancel from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import { UserData } from '../../types/type'
import config from '../../config';
import { launchImageLibrary } from 'react-native-image-picker';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const EmptyMainText = () => {
  const content =
    "\n\n\n" +
    "캠퍼스라이프는 누구나 기분 좋게 참여할 수 있는 커뮤니티를 만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다. 위반 시 게시물이 삭제되고 서비스 이용이 일정 기간 제한될 수 있습니다." +
    "\n\n정치·사회 관련 행위 금지\n\n국가기관, 정치 관련 단체, 언론, 시민단체에 대한 언급 혹은 이와 관련한 행위" +
    "\n정책·외교 또는 정치·정파에 대한 의견, 주장 및 이념, 가치관을 드러내는 행위\n성별, 종교, 인종, 출신, 지역, 직업, 이념 등 사회적 이슈에 대한 언급 혹은 이와 관련한 행위" +
    "\n위와 같은 내용으로 유추될 수 있는 비유, 은어 사용 행위\n영리 여부와 관계 없이 사업체·기관·단체·개인에게 직간접적으로 영향을 줄 수 있는 게시물 작성 행위\n불법촬영물 유통 금지\n불법촬영물등을 게재할 경우 전기통신사업법에 따라 삭제 조치 및 서비스 이용이 영구적으로 제한될 수 있으며 관련 법률에 따라 처벌받을 수 있습니다." +
    "\n\n그 밖의 규칙 위반\n타인의 권리를 침해하거나 불쾌감을 주는 행위\n범죄, 불법 행위 등 법령을 위반하는 행위\n욕설, 비하, 차별, 혐오, 자살, 폭력 관련 내용을 포함한 게시물 작성 행위\n음란물, 성적 수치심을 유발하는 행위\n스포일러, 공포, 속임, 놀라게 하는 행위"

  return (
    <View style={{ padding: 6 }}>
      <Text>
        {content}
      </Text>
    </View>
  );
};


const WritePostPage: React.FC = ({ navigation, route }: any) => {
  console.log("you are in NoticeWritePostScreen")
  const { userdata } = route.params;
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [selectallposter, setselectapllposterOption] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [selectdepartmentposter, setselectdepartmentposter] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [postfontoption, setpostfontoption] = useState("게시판을 정해주세요");
  const [titletext, settitleText] = useState('');
  const [maintext, setmainText] = useState('');
  const [userData, setUserData] = useState<UserData>(userdata);
  const [selectedImages, setSelectedImages] = useState<any[]>([]); // 선택된 이미지
  const [selectedFormImages, setSelectedFormImages] = useState<FormData[]>([]); // 선택된 이미지를 폼데이터에 저장
  const [isModalVisible, setIsModalVisible] = useState(false);

  const forceUpdate = React.useReducer(() => ({}), {})[1];

  useFocusEffect(
    React.useCallback(() => {
      changeHeaderRightContent();
    }, [selectdepartmentposter, titletext, maintext, selectedFormImages])
  );

  const goback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (userData.title !== "일반학생" && userData.title !== "학교") {
      setselectdepartmentposter(1); // Default to department notice
      setselectapllposterOption(0);
      setpostfontoption("학과 공지사항");
    } else {
      // Compare selectallposter and selectdepartmentposter to set postfontoption
      if (selectallposter === 1) {
        setpostfontoption("학교 공지사항");
      } else if (selectdepartmentposter === 1) {
        setpostfontoption("학과 공지사항");
      } else {
        setpostfontoption("게시판을 정해주세요");
      }
    }
  }, [selectallposter, selectdepartmentposter, userData.title]);

  const openModal = () => {
    setIsModalOpen(true); // 모달을 열기 위해 상태를 true로 설정
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달을 닫기 위해 상태를 false로 설정
  };

  const handleAllPosterPress = () => {
    setselectapllposterOption(1);
    setselectdepartmentposter(0);
  };

  const handleDepartmentPosterPress = () => {
    setselectapllposterOption(0);
    setselectdepartmentposter(1);
  };

  const handletitleTextChange = (inputText: string) => {
    settitleText(inputText);
  };

  const handlemainTextChange = (inputText: string) => {
    setmainText(inputText);
  };

  const changeHeaderRightContent = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={async () => {
          const post_id = await write_post();
          const post_id_int = parseInt(post_id.postId);
          const imageGroup = await uploadImages();
          await RegistorPostPhoto(post_id_int, imageGroup); //포스트 사진 등록
          ok_go();

        }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#B20000', justifyContent: 'center', alignItems: 'center', width: 65, height: 35, borderRadius: 20, marginRight: 10 }}>
            <Text style={{ color: 'white', fontSize: 17, fontWeight: "bold" }}>완료</Text>
          </View>
        </TouchableOpacity>
      )
    });
  };

  const ok_go = () => {
    Alert.alert(
      "게시물 작성",
      "게시물 작성을 완료했습니다!",
      [
        { text: "확인", onPress: () => goback() }
      ]
    );
  };

    //사진 등록 함수 프로시저 사용할거임
    const RegistorPostPhoto = async (post_id: number, post_photo: any) => {
      try {
        const response = await fetch(`${config.serverUrl}/RegistorPostPhoto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post_id,
            post_photo: post_photo
          }),
        })
        await response.json();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }

  const adminCheck = () => {
    if(userData.title === "일반학생"){
      return 0;
    }else{
      return 1;
    }
  }

  const addSchoolNoticeAram = async (value : number) => {
    try {
        const response = await fetch(`${config.serverUrl}/addSchoolNoticeAram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_id: value
            })
        });
    } catch (error) {
        console.error('알람 전송 실패', error);
    }
}


const addDepartmentNoticeAram = async (value : number) => {
  try {
      const response = await fetch(`${config.serverUrl}/addDepartmentNoticeAram`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              target_id: value
          })
      });
  } catch (error) {
      console.error('알람 전송 실패', error);
  }
}


  const write_post = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/write_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userData.user_pk,
          department_check: selectdepartmentposter,
          inform_check: adminCheck(),
          title: titletext,
          contents: maintext,
        })
      });
      const value = await response.json();
      if(selectdepartmentposter === 0) {
      await addSchoolNoticeAram(value.postId);
      return value;
    }else if(selectdepartmentposter === 1) {
      await addDepartmentNoticeAram(value.postId);
      return value;
    }

    } catch (error) {
      console.error('게시글 쓰기 실패!', error);
    }
  }

    // 이미지 선택 함수
    const handleImagePick = () => {
      launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 - selectedImages.length }, (response) => {
        if (response.assets) {
          const newSelectedImage = [...selectedImages, ...response.assets];
          setSelectedImages(newSelectedImage);
          const formDataArray = newSelectedImage.map((image, index) => {
            const formData = new FormData();
            const fileNameWithoutExtension = image.fileName.split('.').slice(0, -1).join('.');
            const newFileName = `${Date.now()}_${fileNameWithoutExtension}.png`;
            formData.append('images', {
              uri: image.uri,
              type: image.type,
              name: newFileName,
              index: index,
            });
            return formData;
          });
          setSelectedFormImages(formDataArray);
          forceUpdate();
        } else if (response.errorCode) {
          //console.log('Image picker error: ', response.errorMessage);
        }
      });
    };
  
      // 이미지 업로드 함수
      const uploadImages = async () => {
        try {
          const uploadedImageDatas = [];
          for (const formData of selectedFormImages) {
            const response = await fetch(`${config.serverUrl}/uploadImages`, {
              method: 'POST',
              body: formData,
            });
            const imageData = await response.json();
            uploadedImageDatas.push(imageData.fileNames[0]);
            if (response.ok) {
              //console.log('Image uploaded successfully');
            } else {
              //console.error('Image upload failed');
            }
          }
          //console.log(uploadedImageDatas);
          return uploadedImageDatas;
        } catch (error) {
          console.error('Error uploading images: ', error);
        }
      };
    
  
    // 이미지 삭제 함수
    const handleImageRemove = (index: number) => {
      const updatedImages = selectedImages.filter((_, i) => i !== index);
      setSelectedImages(updatedImages);
  
      const updatedFormImages = selectedFormImages.filter((_, i) => i !== index);
      setSelectedFormImages(updatedFormImages);
    };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.selectPostArea}>
          <Text style={styles.selectPostText}>{postfontoption}</Text>
          {userData.title === "학교" && (
            <IconB name="down" onPress={openModal} size={30} color={'black'} />
          )}
        </View>
      <View style={styles.postTitleArea}>
        <TextInput
          style={styles.postTitleText}
          onChangeText={handletitleTextChange}
          value={titletext}
          placeholder="제목"
          placeholderTextColor={'gray'}
        />
      </View>
      <View style={styles.postContentArea}>
        <TextInput
          style={{ fontSize: 20, color: 'black', textAlignVertical: "top" }}
          onChangeText={handlemainTextChange}
          value={maintext}
          multiline={true}
          placeholder={"이곳에 글을 입력해 주세요!"}
          placeholderTextColor={'gray'}
        />
        {maintext === '' && selectedImages.length === 0 && <EmptyMainText />}
      </View>
      {selectedImages.length > 0 && (
        <View style={styles.photoArea}>
          <ScrollView style={styles.photoScrollViewArea} horizontal={true}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.fileInfo}>
                <Image
                  source={{ uri: image.uri }}
                  resizeMode="contain"
                  style={styles.imagePreview} />
                <TouchableOpacity onPress={() => handleImageRemove(index)} style={styles.cancelButton}>
                  <IconCancel name="closecircleo" size={22} color={'white'} style={{ backgroundColor: '#555555', borderRadius: 20 }} />
                </TouchableOpacity>

                {/* 마지막 인덱스가 아닐 때만 LottieView를 렌더링 */}
                {index !== selectedImages.length - 1 && (
                  <LottieView
                    source={require('../../assets/Animation - 1725980201082.json')}
                    autoPlay
                    onAnimationFinish={() => console.log('애니메이션이 완료되었습니다')}
                    loop
                    style={{ width: width - 440, height: height - 910, right: width - 455, top: height - 830 }}
                  />
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
    <View style={styles.postImageArea}>
      <TouchableOpacity onPress={handleImagePick} style={styles.postImageButton}>
        <IconC name="image" size={35} color={'black'} />
      </TouchableOpacity>
    </View>
    <ModalBox
      isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
      style={modalStyle.modal}
      position="bottom"
      swipeToClose={false}
      onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
      >
        <View style={modalStyle.modalContent}>
          {userData.title === "학교" && (
            <TouchableOpacity style={modalStyle.allposter} onPress={handleAllPosterPress}>
              <Text style={[modalStyle.noallposterfont, selectallposter == 1 && modalStyle.yesallposterfont]}> 학교 공지사항 </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={modalStyle.allposter} onPress={handleDepartmentPosterPress}>
            <Text style={[modalStyle.noallposterfont, selectdepartmentposter === 1 && modalStyle.yesallposterfont]}> 학과 공지사항 </Text>
          </TouchableOpacity>
          <View style={modalStyle.writeButtom}>
            <View style={{ flex: 0.65 }} />
            <TouchableOpacity onPress={closeModal} style={{ flex: 0.35, justifyContent: 'center', alignItems: "center", backgroundColor: '#9A9EFF' }}>
              <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
    </ModalBox>
    <Modal isVisible={isModalVisible}>
      <View style={modalStyle.modalContainer}>
        <Text style={modalStyle.title}>등록 확인</Text>
        <Text style={modalStyle.message}>글이 등록되었습니다.</Text>
        <TouchableOpacity style={modalStyle.confirmButton} onPress={goback}>
          <Text style={modalStyle.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor : 'green'
  },

  selectPostText: {
    fontSize: 22,
    color: 'black',
  },

  postTitleText: {
    fontSize: 22,
    color: 'black',
  },

  photoArea: {
    width: "100%",
    height: height - 549,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor : 'red'
  },

  postTitleArea: {
    marginHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 20,
    borderBottomWidth: 2,
  },

  postImageArea: {
    width: '100%',
    justifyContent: 'center'
  },

  postImageButton: {
    margin: 10,
    width: 50,
    alignItems: 'center'
  },

  selectPostArea: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },

  photoScrollViewArea: {
    width: "85%",
    height: "100%",
    //backgroundColor : 'red',
    borderWidth: 3,
    borderColor: "#CCCCCC",
    borderRadius: 20
  },

  cancelButton: {
    alignSelf: 'flex-end',
    bottom: height - 647,
    left: width - 492
  },

  fileInfo: {
    width: width - 79,
    height: height - 980,
    padding: 40,
    flexDirection: 'row',
    //backgroundColor: 'blue'
  },

  postoption: {
    height: 70,
    //backgroundColor : 'red'
  },

  postContentArea: {
    marginHorizontal: 20,
    marginBottom: 20
  },

  selectpostcontainer: {
    height: 70,
    //backgroundColor : 'blue'
  },
  selectpost: {
    flex: 1,
    margin: 10,
    marginRight: 15,
    marginLeft: 15,
    //backgroundColor : 'yellow',
    borderBottomWidth: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  selectfont: {
    //marginTop : 10,
    fontSize: 20,
    color: 'black',
    //backgroundColor : 'yellow'
  },

  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    backgroundColor: '#eeeeee'
  },
  
  writespace: {
    margin: 15,
    flex: 0.82,
    //backgroundColor : 'blue'
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 400,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },

  allposter: {
    flex: 0.2,
    justifyContent: 'center', // 수직 정렬
    alignItems: 'center', // 수평 정렬
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 20,
  },

  noallposterfont: {
    color: '#CCCCCC',
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
    paddingBottom: 10,
    fontSize: 25,
    marginTop: 15,
  },
  
  yesallposterfont: {
    fontSize: 25,
    marginTop: 15,
    borderBottomColor: 'black',
    color: 'black',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
  },

  departmentposter: {
    flex: 0.5,
    backgroundColor: 'green',
  },

  writeButtom: {
    flex: 0.6,
    //backgroundColor : 'green',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})

const modalStyle = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 400,
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },

  allposter: {
    flex: 0.2,
    justifyContent: 'center', // 수직 정렬
    alignItems: 'center', // 수평 정렬
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 20,
  },

  noallposterfont: {
    color: '#CCCCCC',
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
    paddingBottom: 10,
    fontSize: 25,
    marginTop: 15,
  },

  yesallposterfont: {
    fontSize: 25,
    marginTop: 15,
    borderBottomColor: 'black',
    color: 'black',
    width: '100%', // 가로 길이 조정
    textAlign: 'center', // 텍스트 가운데 정렬
  },

  departmentposter: {
    flex: 0.5,
    backgroundColor: 'green',
  },

  writeButtom: {
    flex: 0.6,
    //backgroundColor : 'green',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
})

export default WritePostPage;