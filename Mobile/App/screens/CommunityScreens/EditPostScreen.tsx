import React, { useState, useEffect, useRef } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Image, Dimensions } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import { UserData, Edit_Post_Info, PostPhoto } from '../../types/type'
import IconCancel from 'react-native-vector-icons/AntDesign';
import config from '../../config';
import IconC from 'react-native-vector-icons/FontAwesome';
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

const EditPostScreen: React.FC = ({ navigation, route }: any) => {
  const { userdata, post_edit_info, postImages } = route.params;
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열기/닫기 상태를 useState로 관리
  const [selectallposter, setselectapllposterOption] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [selectdepartmentposter, setselectdepartmentposter] = useState(0); // 선택된 옵션의 인덱스를 useState로 관리
  const [postfontoption, setpostfontoption] = useState("");
  const [titletext, settitleText] = useState(post_edit_info.title);
  const [maintext, setmainText] = useState(post_edit_info.contents);
  const [userData, setUserData] = useState<UserData>(userdata);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<any[]>([]); // 선택된 이미지
  const [selectedFormImages, setSelectedFormImages] = useState<FormData[]>([]); // 선택된 이미지를 폼데이터에 저장
  const [postImages2, setpostImages] = useState<PostPhoto[]>(postImages);

  const forceUpdate = React.useReducer(() => ({}), {})[1];

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          changeHeaderRightContent();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }, [selectdepartmentposter, titletext, maintext, selectedFormImages])
  );


  const goback = () => {
    navigation.goBack();
  };

  useEffect(() => {
    // selectallposter와 selectdepartmentposter를 비교하여 postfontoption을 설정
    if (selectallposter === 1) {
      setpostfontoption("전체 게시판");
    } else if (selectdepartmentposter === 1) {
      setpostfontoption("학과 게시판");
    } else {
      if (post_edit_info.department_check == true) {
        setpostfontoption("학과 게시판");
        handleDepartmentPosterPress();
      } else if (post_edit_info.department_check == false) {
        setpostfontoption("전체 게시판");
        handleAllPosterPress();
      }
    }
  }, [selectallposter, selectdepartmentposter]);

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

  const chagneImageArray = (addImage : any) => {
    const ChangeServerImageArray = postImages2.map(photo => photo.post_photo);
    //console.log(ChangeServerImageArray);

    const combinedImageArray = ChangeServerImageArray.concat(addImage);
    //console.log('결합된 이미지 배열:', combinedImageArray);

    return combinedImageArray;
  }

  const changeHeaderRightContent = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={async () => {
          await DeletePostPhoto(); //일단 현제 포스트 사진 초기화 후
          await update_post(); //포스트 정보부터 업데이트 한 다음
          const imageGroup = await uploadImages(); //선택한 서버 등록 후 가져오고
          const newImageArray = chagneImageArray(imageGroup); //기존 서버 사진과, 현제 등록한 서버 사진을 결합
          await RegistorPostPhoto(newImageArray); //그다음 새 사진 배열을 db에 저장시켜줄거야
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
      "게시물 수정",
      "게시물 수정을 완료했습니다!",
      [
        { text: "확인", onPress: () => navigation.navigate("CommunityScreenStackNavigator") }
      ]
    );
  };

  //사진 등록 함수 프로시저 사용할거임
  const RegistorPostPhoto = async (post_photo: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/RegistorPostPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_edit_info.post_id,
          post_photo: post_photo
        }),
      })
      await response.json();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

    //기존 DB에 저장되어있는 사진을 삭제하고 새 배열을 넣어줄거임
    const DeletePostPhoto = async () => {
      try {
        const response = await fetch(`${config.serverUrl}/DeletePostPhoto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            post_id: post_edit_info.post_id,
          }),
        })
        await response.json();
      } catch (error) {
        console.error(error);
      } finally {
      }
    }

  // 서버에서 가져온 이미지 삭제 함수
  const handleServerImageRemove = (index: number) => {
    const updatedServerImages = postImages2.filter((_, i) => i !== index);
    setpostImages(updatedServerImages);
    //console.log("서버 이미지 배열 삭제")
  };


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
          inform_check: 0,
          title: titletext,
          contents: maintext,
        })
      });
      const post_id = await response.json();
      return (post_id);

    } catch (error) {
      console.error('게시글 쓰기 실패!', error);
    }
  }

  const update_post = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/update_post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: post_edit_info.post_id,
          department_check: selectdepartmentposter,
          inform_check: 0,
          title: titletext,
          contents: maintext,
        })
      });
      await response.json();
      ok_go();
    } catch (error) {
      console.error('게시글 수정 실패!', error);
    }
  }

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
        <TouchableOpacity onPress={openModal} style={styles.selectPostArea}>
          <Text style={styles.selectPostText}>{postfontoption}</Text>
          <IconB name="down" size={30} color={'black'} />
        </TouchableOpacity>
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
            placeholder="이 곳에 글을 입력해주세요!"
            placeholderTextColor={'gray'}
          />
          {maintext === '' && selectedImages.length === 0 && <EmptyMainText />}
        </View>
        {(postImages2.length > 0 || selectedImages.length > 0) ? (
          <View style={styles.photoArea}>
            <ScrollView style={styles.photoScrollViewArea} horizontal={true}>
              {postImages2.map((image, index) => (
                <View key={index} style={styles.fileInfo}>
                  <Image
                    source={{ uri: `${config.photoUrl}/${image.post_photo}.png` }}
                    resizeMode="contain"
                    style={styles.imagePreview} />
                  <TouchableOpacity onPress={() => handleServerImageRemove(index)} style={styles.cancelButton}>
                    <IconCancel name="closecircleo" size={22} color={'white'} style={{ backgroundColor: '#555555', borderRadius: 20 }} />
                  </TouchableOpacity>

                  {/* 마지막 인덱스가 아닐 때만 LottieView를 렌더링 */}
                  {index !== postImages2.length - 1 && (
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
        ) : (
          <View></View>
        )}
      </ScrollView>
      <View style={styles.postImageArea}>
        <TouchableOpacity onPress={handleImagePick} style={styles.postImageButton}>
          <IconC name="image" size={35} color={'black'} />
        </TouchableOpacity>
      </View>
      <ModalBox
        isOpen={isModalOpen} // 모달의 열기/닫기 상태를 prop으로 전달
        style={styles.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal} // 모달이 닫힐 때 호출되는 콜백 함수
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
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>등록 확인</Text>
          <Text style={styles.message}>글이 등록되었습니다.</Text>
          <TouchableOpacity style={styles.confirmButton} onPress={goback}>
            <Text style={styles.confirmButtonText}>확인</Text>
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
  postoption: {
    height: 70,
    //backgroundColor : 'red'
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
  postImageArea: {
    width: '100%',
    justifyContent: 'center'
  },
  postImageButton: {
    margin: 10,
    width: 50,
    alignItems: 'center'
  },
  cancelButton: {
    alignSelf: 'flex-end',
    bottom: height - 647,
    left: width - 492
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    backgroundColor: '#eeeeee'
  },
  fileInfo: {
    width: width - 79,
    height: height - 980,
    padding: 40,
    flexDirection: 'row',
    //backgroundColor: 'blue'
  },

  photoArea: {
    width: "100%",
    height: height - 549,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor : 'red'
  },

  photoScrollViewArea: {
    width: "85%",
    height: "100%",
    //backgroundColor : 'red',
    borderWidth: 3,
    borderColor: "#CCCCCC",
    borderRadius: 20
  },
  postTitleText: {
    fontSize: 22,
    color: 'black',
  },
  postTitleArea: {
    marginHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 20,
    borderBottomWidth: 2,
  },
  selectPostText: {
    fontSize: 22,
    color: 'black',
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
  postContentArea: {
    marginHorizontal: 20,
    marginBottom: 20
  },

})

export default EditPostScreen;