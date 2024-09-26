import React, { useState, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Text, View, TouchableOpacity, TextInput, FlatList, Alert, Image, Dimensions, StyleSheet, ScrollView } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import IconCancel from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import ModalBox from 'react-native-modalbox';
import { launchImageLibrary } from 'react-native-image-picker';
import LottieView from 'lottie-react-native';
import config from '../../config'; // 서버 URL 설정 파일
import { UserData } from '../../types/type'; // 사용자 데이터 타입 정의

const { width, height } = Dimensions.get('window'); // 화면의 너비와 높이 가져오기

// 비어있는 상태에서 보여줄 안내 텍스트 컴포넌트
const EmptyMainText = () => {
  const content = `\n\n\n캠퍼스라이프는 누구나 기분 좋게 참여할 수 있는 커뮤니티를 만들기 위해 커뮤니티 이용규칙을 제정하여 운영하고 있습니다...`;

  return (
    <View style={{ padding: 6 }}>
      <Text style={{ color: 'gray' }}>{content}</Text>
    </View>
  );
};

// 게시글 작성 페이지 컴포넌트
const WritePostPage: React.FC = ({ navigation, route }: any) => {
  const { userdata } = route.params; // 전달받은 사용자 데이터
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태 관리
  const [selectallposter, setSelectAllPosterOption] = useState(0); // 전체 게시판 선택 여부
  const [selectdepartmentposter, setSelectDepartmentPoster] = useState(0); // 학과 게시판 선택 여부
  const [postfontoption, setPostFontOption] = useState("게시판을 정해주세요"); // 게시판 선택 옵션
  const [titletext, setTitleText] = useState(''); // 게시물 제목 상태
  const [maintext, setMainText] = useState(''); // 게시물 내용 상태
  const [userData, setUserData] = useState<UserData>(userdata); // 사용자 데이터 상태
  const [selectedImages, setSelectedImages] = useState<any[]>([]); // 선택된 이미지 상태
  const [selectedFormImages, setSelectedFormImages] = useState<FormData[]>([]); // 폼 데이터 형태의 이미지 상태

  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부 상태

  const forceUpdate = React.useReducer(() => ({}), {})[1]; // 리렌더링 강제 함수

  // 화면이 포커스될 때 헤더의 오른쪽 버튼을 업데이트하는 효과
  useFocusEffect(
    React.useCallback(() => {
      changeHeaderRightContent();
    }, [selectdepartmentposter, titletext, maintext, selectedFormImages])
  );

  // 이전 화면으로 이동
  const goBack = () => {
    navigation.goBack();
  };

  // 전체 게시판 또는 학과 게시판 선택에 따라 게시판 텍스트 업데이트
  useEffect(() => {
    if (selectallposter === 1) {
      setPostFontOption("전체 게시판");
    } else if (selectdepartmentposter === 1) {
      setPostFontOption("학과 게시판");
    } else {
      setPostFontOption("게시판을 정해주세요");
    }
  }, [selectallposter, selectdepartmentposter]);

  // 모달 열기
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 전체 게시판 선택
  const handleAllPosterPress = () => {
    setSelectAllPosterOption(1);
    setSelectDepartmentPoster(0);
  };

  // 학과 게시판 선택
  const handleDepartmentPosterPress = () => {
    setSelectAllPosterOption(0);
    setSelectDepartmentPoster(1);
  };

  // 제목 텍스트 변경 핸들러
  const handleTitleTextChange = (inputText: string) => {
    setTitleText(inputText);
  };

  // 본문 텍스트 변경 핸들러
  const handleMainTextChange = (inputText: string) => {
    setMainText(inputText);
  };

  // 헤더의 오른쪽 버튼 업데이트
  const changeHeaderRightContent = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={async () => {
          const post_id = await writePost(); // 게시물 작성 API 호출
          const post_id_int = parseInt(post_id.postId);
          const imageGroup = await uploadImages(); // 이미지 업로드
          await RegistorPostPhoto(post_id_int, imageGroup); // 게시물 사진 등록 API 호출
          completePost(); // 완료 알림 후 이동
        }}>
          <View style={styles.headerButton}>
            <Text style={styles.headerButtonText}>완료</Text>
          </View>
        </TouchableOpacity>
      )
    });
  };

  // 게시물 작성 완료 알림
  const completePost = () => {
    Alert.alert("게시물 작성", "게시물 작성을 완료했습니다!", [{ text: "확인", onPress: () => goBack() }]);
  };

  // 사진 등록 함수 (서버에 이미지 등록)
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
      });
      await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  // 게시물 등록 API 호출
  const writePost = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/write_post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData.user_pk,
          department_check: selectdepartmentposter,
          inform_check: 0,
          title: titletext,
          contents: maintext,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('게시글 쓰기 실패!', error);
    }
  };

  // 이미지 선택
  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', selectionLimit: 10 - selectedImages.length }, (response) => {
      if (response.assets) {
        const newSelectedImage = [...selectedImages, ...response.assets];
        setSelectedImages(newSelectedImage);
        const formDataArray = newSelectedImage.map((image, index) => {
          const formData = new FormData();
          const fileNameWithoutExtension = image.fileName.split('.').slice(0, -1).join('.');
          const newFileName = `${Date.now()}_${fileNameWithoutExtension}.png`;
          formData.append('images', { uri: image.uri, type: image.type, name: newFileName, index: index });
          return formData;
        });
        setSelectedFormImages(formDataArray);
        forceUpdate();
      }
    });
  };

  // 이미지 업로드 API 호출
  const uploadImages = async () => {
    try {
      const uploadedImageDatas = [];
      for (const formData of selectedFormImages) {
        const response = await fetch(`${config.serverUrl}/uploadImages`, { method: 'POST', body: formData });
        const imageData = await response.json();
        uploadedImageDatas.push(imageData.fileNames[0]);
      }
      return uploadedImageDatas;
    } catch (error) {
      console.error('Error uploading images: ', error);
    }
  };

  // 이미지 삭제
  const handleImageRemove = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
    setSelectedFormImages(selectedFormImages.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 게시판 선택 영역 */}
        <TouchableOpacity onPress={openModal} style={styles.selectPostArea}>
          <Text style={styles.selectPostText}>{postfontoption}</Text>
          <IconB name="down" size={30} color={'black'} />
        </TouchableOpacity>

        {/* 제목 입력 영역 */}
        <View style={styles.postTitleArea}>
          <TextInput
            style={styles.postTitleText}
            onChangeText={handleTitleTextChange}
            value={titletext}
            placeholder="제목"
            placeholderTextColor={'gray'}
          />
        </View>

        {/* 본문 입력 영역 */}
        <View style={styles.postContentArea}>
          <TextInput
            style={{ fontSize: 20, color: 'black', textAlignVertical: "top" }}
            onChangeText={handleMainTextChange}
            value={maintext}
            multiline={true}
            placeholder="이곳에 글을 입력해 주세요!"
            placeholderTextColor={'gray'}
          />
          {maintext === '' && selectedImages.length === 0 && <EmptyMainText />}
        </View>

        {/* 이미지 미리보기 */}
        {selectedImages.length > 0 && (
          <View style={styles.photoArea}>
            <FlatList
              data={selectedImages}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center" // 이미지 중앙 정렬
              snapToInterval={width - 70} // 스냅 간격을 이미지 너비에 맞춤
              decelerationRate="fast" // 스크롤 속도를 빠르게 하여 자연스럽게 멈춤
              renderItem={({ item, index }) => (
                <View key={index} style={styles.fileInfo}>
                  <Image
                    source={{ uri: item.uri }}
                    resizeMode="contain"
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity onPress={() => handleImageRemove(index)} style={styles.cancelButton}>
                    <IconCancel name="closecircleo" size={22} color={'white'} />
                  </TouchableOpacity>
                  {index !== selectedImages.length - 1 && (
                    <LottieView
                      source={require('../../assets/Animation - 1725980201082.json')}
                      autoPlay
                      loop
                      style={{ width: 50, right: 45 }}
                    />
                  )}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        )}
      </ScrollView>

      {/* 이미지 선택 버튼 */}
      <View style={styles.postImageArea}>
        <TouchableOpacity onPress={handleImagePick} style={styles.postImageButton}>
          <IconC name="image" size={35} color={'black'} />
        </TouchableOpacity>
      </View>

      {/* 게시판 선택 모달 */}
      <ModalBox
        isOpen={isModalOpen}
        style={modalStyle.modal}
        position="bottom"
        swipeToClose={false}
        onClosed={closeModal}
      >
        <View style={modalStyle.modalContent}>
          <TouchableOpacity style={modalStyle.allposter} onPress={handleAllPosterPress}>
            <Text style={[modalStyle.noallposterfont, selectallposter == 1 && modalStyle.yesallposterfont]}>전체 게시판</Text>
          </TouchableOpacity>
          <TouchableOpacity style={modalStyle.allposter} onPress={handleDepartmentPosterPress}>
            <Text style={[modalStyle.noallposterfont, selectdepartmentposter === 1 && modalStyle.yesallposterfont]}>학과 게시판</Text>
          </TouchableOpacity>
          <View style={modalStyle.writeButtom}>
            <TouchableOpacity onPress={closeModal} style={{ flex: 0.35, justifyContent: 'center', alignItems: "center", backgroundColor: '#9A9EFF' }}>
              <Text style={{ fontSize: 20, color: 'black' }}>선택 완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalBox>

      {/* 글 등록 확인 모달 */}
      <Modal isVisible={isModalVisible}>
        <View style={modalStyle.modalContainer}>
          <Text style={modalStyle.title}>등록 확인</Text>
          <Text style={modalStyle.message}>글이 등록되었습니다.</Text>
          <TouchableOpacity style={modalStyle.confirmButton} onPress={goBack}>
            <Text style={modalStyle.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectPostArea: {
    flexDirection: 'row',
    marginHorizontal: 20,
    paddingVertical: 10,
    marginVertical: 20,
    justifyContent: 'space-between',
    borderBottomWidth: 2,
  },
  selectPostText: {
    fontSize: 22,
    color: 'black',
  },
  postTitleArea: {
    marginHorizontal: 20,
    paddingVertical: 0,
    marginVertical: 20,
    borderBottomWidth: 2,
  },
  postTitleText: {
    fontSize: 22,
    color: 'black',
  },
  postContentArea: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  postImageArea: {
    width: '100%',
    justifyContent: 'center',
  },
  postImageButton: {
    margin: 10,
    width: 50,
    alignItems: 'center',
  },
  fileInfo: {
    width: width - 70,
    height: height - 980,
    padding: 40,
    flexDirection: 'row',
  },
  cancelButton: {
    alignSelf: 'flex-start',
    bottom: 10,
    right: 10,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    backgroundColor: '#eeeeee',
  },
  photoArea: {
    width: "100%",
    height: height - 549,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    flexDirection: 'row',
    backgroundColor: '#B20000',
    justifyContent: 'center',
    alignItems: 'center',
    width: 65,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  headerButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

// 모달 스타일 정의
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
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    margin: 20,
  },
  noallposterfont: {
    color: '#CCCCCC',
    borderBottomWidth: 2,
    borderBottomColor: '#CCCCCC',
    width: '100%',
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 25,
    marginTop: 15,
  },
  yesallposterfont: {
    fontSize: 25,
    marginTop: 15,
    borderBottomColor: 'black',
    color: 'black',
    width: '100%',
    textAlign: 'center',
  },
  writeButtom: {
    flex: 0.6,
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
});

export default WritePostPage;
