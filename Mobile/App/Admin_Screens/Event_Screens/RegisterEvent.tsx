import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import config from '../../config';
import { TextInput } from 'react-native-gesture-handler';
import IconPen from 'react-native-vector-icons/FontAwesome6';
import IconTrash from 'react-native-vector-icons/FontAwesome6';
import IconCancel from 'react-native-vector-icons/AntDesign';
import IconPlus from 'react-native-vector-icons/AntDesign';
import IconVote from 'react-native-vector-icons/FontAwesome5';
import IconImage from 'react-native-vector-icons/FontAwesome5';
import IconCalendar from 'react-native-vector-icons/MaterialCommunityIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import { ko } from 'date-fns/locale'; // date-fns의 한국어 locale 불러오기
import { UserData } from '../../types/type'
import { useFocusEffect, useNavigation } from '@react-navigation/native';


const width = Dimensions.get("window").width;

const RegisterEvent = ({ route }: any) => {
  const { userdata } = route.params;
  const [userData, setUserData] = useState<UserData>(userdata); //유저 데이터
  // 이벤트 정보 관련 상태 변수들
  const [title, setTitle] = useState(''); // 이벤트 제목
  const [content, setContent] = useState(''); // 이벤트 내용
  const [simpleInfo, setSimpleInfo] = useState('')//이벤트 간략 설명
  const [grantPoint, setGrantPoint] = useState('');
  const [votes, setVotes] = useState<{ id: number, text: string }[]>([]); // 투표 옵션
  const [showVoteSection, setShowVoteSection] = useState(false); // 투표 섹션 표시 여부
  const [submittedData, setSubmittedData] = useState<any>(null); // 제출된 데이터
  const [selectedImages, setSelectedImages] = useState<any[]>([]); // 선택된 이미지
  const [selectedFormImages, setSelectedFormImages] = useState<FormData[]>([]); // 선택된 이미지를 폼데이터에 저장

  // useState Hook를 사용하여 시작 및 종료 날짜와 모달 유형, 노출 여부를 설정할 변수를 생성
  const [startDate, onChangeStartDate] = useState(new Date()); // 시작 날짜
  const [endDate, onChangeEndDate] = useState(new Date()); // 종료 날짜
  const [startVisible, setStartVisible] = useState(false); // 시작 날짜 모달 노출 여부
  const [endVisible, setEndVisible] = useState(false); // 종료 날짜 모달 노출 여부

  useFocusEffect(
    React.useCallback(() => {
      setUserData(userdata);
    }, [])
  );

  //Date 타입의 문자열을 sql문에 넣을 수 있게 변환하는 함수.
  const formatDateToSQL = (date: Date) => {
    return date.toISOString().slice(0, 19).replace('T', ' ');
  };

  const onPressStartDate = () => { // 시작 날짜 클릭 시
    setStartVisible(true); // 시작 날짜 모달 open
  };

  const onPressEndDate = () => { // 종료 날짜 클릭 시
    setEndVisible(true); // 종료 날짜 모달 open
  };

  const onConfirmStartDate = (selectedDate: React.SetStateAction<Date>) => { // 시작 날짜 선택 시
    setStartVisible(false); // 시작 날짜 모달 close
    onChangeStartDate(selectedDate); // 선택한 시작 날짜 변경
  };

  const onConfirmEndDate = (selectedDate: React.SetStateAction<Date>) => { // 종료 날짜 선택 시
    setEndVisible(false); // 종료 날짜 모달 close
    onChangeEndDate(selectedDate); // 선택한 종료 날짜 변경
  };

  const onCancel = () => { // 취소 시
    setStartVisible(false); // 모달 close
    setEndVisible(false); // 모달 close
  };


  // 투표 옵션 추가 함수
  const handleAddVote = () => {
    if (votes.length < 5) {
      setVotes(prevVotes => [...prevVotes, { id: prevVotes.length + 1, text: '' }]);
    }
  };

  // 투표 옵션 변경 함수
  const handleVoteChange = (id: number, text: string) => {
    const newVotes = votes.map(vote =>
      vote.id === id ? { ...vote, text } : vote
    );
    setVotes(newVotes);
  };

  // 투표 옵션 삭제 함수
  const handleDeleteVote = (id: number) => {
    const newVotes = votes.filter(vote => vote.id !== id);
    setVotes(newVotes);
    if (newVotes.length < 2) {
      setShowVoteSection(false);
    }
  };

  // 투표 옵션 표시 함수
  const showVoteOptions = () => {
    setShowVoteSection(true);
    if (votes.length <= 1) {
      setVotes([
        { id: 1, text: '' },
        { id: 2, text: '' }
      ]);
    }
  };

  // 투표 옵션 숨기기 함수
  const hideVoteOptions = () => {
    setShowVoteSection(false);
    setVotes([]);
  };

  const EventRegister = () => {
    Alert.alert(
      "이벤트 등록!",
      "정말로 이대로 이벤트를 등록 하시겠습니까??",
      [
        { text: "취소", style: "cancel" },
        { text: "확인", onPress: () => handleSubmit() }
      ]
    );
  };

  // 제출 처리 함수
  const handleSubmit = async () => {
    if (title.trim() !== '' && content.trim() !== '') {
      if (!showVoteSection || (showVoteSection && votes.every(vote => vote.text.trim() !== ''))) {
        // Validate start date and end date
        if (startDate <= endDate) {
          const submittedData = {
            title,
            content,
            simpleInfo,
            grantPoint,
            votes: showVoteSection ? votes.map(vote => vote.text.trim()) : [],
            images: selectedImages.map(image => image.uri),
            startDate,
            endDate
          };
          setSubmittedData(submittedData);

          try {
            // 폼 필드 초기화
            setTitle('');
            setContent('');
            setSimpleInfo('');
            setGrantPoint('');
            setVotes([]);
            setShowVoteSection(false);
            setSelectedImages([]);
            setSelectedFormImages([]);

            hideVoteOptions();
            const event_pk_string = await RegistorEvent(); //우선 이벤트 등록으로 등록된 이벤트의 PK값을 받아옴
            const event_pk = parseInt(event_pk_string);
            const event_photo = await uploadImages();  //사진을 서버에 업로드
            await RegistorEventPhoto(event_pk, event_photo);  // 그 PK값을 이용하여 연결된 사진 테이블에 값을저장
            await RegistorEventVotes(event_pk);   // 그 PK값을 이용하여 연결된 표 테이블에 값을저장
            await addNewEventAram(event_pk); //알람보내기

            // 이후 추가적인 처리나 화면 이동 등을 수행할 수 있음

          } catch (error) {
            console.error('이벤트 등록 처리 중 오류 발생', error);
            // 오류 처리 로직 추가
          }

        } else {
          Alert.alert("시작 날짜는 종료 날짜보다 이전이어야 합니다.");
        }
      } else {
        Alert.alert("투표 옵션을 모두 입력해주세요.");
      }
    } else {
      Alert.alert("이벤트 제목과 내용을 입력해주세요.");
    }
  };

  //이벤트 등록시 
  const addNewEventAram = async (event_pk : number) => {
    try {
        const response = await fetch(`${config.serverUrl}/addNewEventAram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                target_id: event_pk,
            })
        });
    } catch (error) {
        console.error('알람 전송 실패', error);
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
        //console.log(formDataArray);
      } else if (response.errorCode) {
        //console.log('Image picker error: ', response.errorMessage);
      }
    });
  };
  // 이미지 삭제 함수
  const handleImageRemove = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);

    const updatedFormImages = selectedFormImages.filter((_, i) => i !== index);
    setSelectedFormImages(updatedFormImages);
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

  //이벤트 정보만 Insert
  const RegistorEvent = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/RegistorEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campus_id: userData.campus_pk,
          user_id: userData.user_pk,
          event_name: title,
          get_point: grantPoint,
          info: content,
          simple_info: simpleInfo,
          start_date: formatDateToSQL(startDate),
          close_date: formatDateToSQL(endDate),
        }),
      })
      const data = await response.json();
      const eventPk = data.eventPk;
      return eventPk
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //이벤트 테이블에 연결되어있는 투표 테이블에 행삽입
  const RegistorEventVotes = async (event_id: number) => {
    try {
      const response = await fetch(`${config.serverUrl}/RegistorEventVotesRegistor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event_id,
          votes: votes
        }),
      })
      await response.json();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  //이벤트 테이블에 연결되어있는 이미지 테이블에 행삽입
  const RegistorEventPhoto = async (event_id: number, event_photo: any) => {
    try {
      const response = await fetch(`${config.serverUrl}/RegistorEventPhoto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: event_id,
          event_photo: event_photo
        }),
      })
      await response.json();
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* 이벤트 제목 입력란 */}
        <View style={styles.inputArea}>
          <Text style={styles.inputText}>이벤트 제목</Text>
          <View style={[styles.inputBox, { flexDirection: 'row' }]}>
            <TextInput
              style={styles.input}
              placeholder="제목을 입력해주세요. (최대 50자)"
              placeholderTextColor={'gray'}
              maxLength={50}
              value={title}
              onChangeText={setTitle}
            />
            <IconPen name='pen' size={22} color='black' style={styles.iconPen} />
          </View>
        </View>
        {/* 이벤트 간략 설명란 */}
        <View style={styles.inputArea}>
          <Text style={styles.inputText}>이벤트 간략설명</Text>
          <View style={[styles.inputBox, { flexDirection: 'row' }]}>
            <TextInput
              style={styles.input}
              placeholder="이벤트 간략 설명을 작성해주세요. (최대 30자)"
              placeholderTextColor={'gray'}
              maxLength={30}
              value={simpleInfo}
              onChangeText={setSimpleInfo}
            />
            <IconPen name='pen' size={22} color='black' style={styles.iconPen} />
          </View>
        </View>
        {/* 이벤트 내용 입력란 */}
        <View style={styles.inputArea}>
          <Text style={styles.inputText}>이벤트 내용</Text>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="내용을 입력해주세요. (최대 800자)"
              placeholderTextColor={'gray'}
              maxLength={800}
              multiline={true}
              value={content}
              onChangeText={setContent}
            />
            <Text style={[styles.showLength, { color: content.length === 800 ? 'red' : 'gray' }]}>
              {content.length} / 800
            </Text>
          </View>
        </View>

        <View style={styles.contentArea}>
          <View style={styles.addContentBox}>
            <View style={styles.contentTextArea}>
              <IconCalendar style={styles.PointIcon} name='cash-plus' />
              <Text style={styles.contentText}>포인트</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="부여 포인트를 작성해주세요. (숫자만)"
              placeholderTextColor={'gray'}
              maxLength={30}
              value={grantPoint}
              onChangeText={setGrantPoint}
            />
          </View>
        </View>

        {/* 투표 옵션 */}
        <View style={styles.contentArea}>
          {!showVoteSection && (
            <View style={styles.addContentBox}>
              <View style={styles.contentTextArea}>
                <IconVote style={styles.voteIcon} name='vote-yea' />
                <Text style={styles.contentText}>투표</Text>
              </View>

              <TouchableOpacity style={styles.contentTextArea} onPress={showVoteOptions}>
                <Text style={styles.contentAddText}>추가</Text>
                <IconPlus name='pluscircleo' style={styles.addIcon} />
              </TouchableOpacity>
            </View>
          )}

          {showVoteSection && (
            <View style={[styles.inputArea, { marginTop: 0 }]}>
              <Text style={styles.inputText}>투표 옵션</Text>
              {votes.map((vote, index) => (
                <View key={vote.id}
                  style={[styles.inputBox, styles.voteOptionArea]}>
                  <TextInput
                    style={styles.input}
                    placeholder={`옵션 ${index + 1}`}
                    placeholderTextColor={'gray'}
                    maxLength={50}
                    value={vote.text}
                    onChangeText={(text) => handleVoteChange(vote.id, text)}
                  />
                  <TouchableOpacity onPress={() => handleDeleteVote(vote.id)}>
                    <IconTrash name='trash' size={22} color='red' style={styles.icon} />
                  </TouchableOpacity>
                </View>
              ))}
              {votes.length < 5 && (
                <TouchableOpacity onPress={handleAddVote} style={{ marginTop: 10 }}>
                  <IconPlus name='pluscircleo' size={30} color='black' />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* 이미지 추가 영역 */}
        <View style={styles.contentArea}>
          <View style={styles.addContentBox}>
            <View style={styles.contentTextArea}>
              <IconImage style={styles.imageIcon} name='images' />
              <Text style={styles.contentText}>이미지</Text>
            </View>
            <TouchableOpacity style={styles.contentTextArea} onPress={handleImagePick}>
              <Text style={styles.contentAddText}>추가</Text>
              <IconPlus name='pluscircleo' style={styles.addIcon} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.fileInfo}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={() => handleImageRemove(index)} style={styles.cancelButton}>
                  <IconCancel name="closecircleo" size={22} color={'white'} style={{ backgroundColor: '#555555', borderRadius: 20 }} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentArea}>
          <View style={styles.addContentBox}>
            <View style={styles.contentTextArea}>
              <IconCalendar style={styles.imageIcon} name='calendar-start' />
              <Text style={styles.contentText}>시작 날짜</Text>
            </View>
            <TouchableOpacity style={styles.contentTextArea} onPress={onPressStartDate}>
              <Text style={styles.dateText}>{format(new Date(startDate), 'PPP', { locale: ko })} </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentArea}>
          <View style={styles.addContentBox}>
            <View style={styles.contentTextArea}>
              <IconCalendar style={styles.imageIcon} name='calendar-end' />
              <Text style={styles.contentText}>종료 날짜</Text>
            </View>
            <TouchableOpacity style={styles.contentTextArea} onPress={onPressEndDate}>
              <Text style={styles.dateText}>{format(new Date(endDate), 'PPP', { locale: ko })} </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={startVisible}
          mode={'date'}
          onConfirm={onConfirmStartDate}
          onCancel={onCancel}
          date={startDate} 
          minimumDate={new Date()}
          />
          

        <DateTimePickerModal
          isVisible={endVisible}
          mode={'date'}
          onConfirm={onConfirmEndDate}
          onCancel={onCancel}
          date={endDate} 
          minimumDate={new Date()}
          />

        {/* 등록 버튼 */}
        <TouchableOpacity style={styles.submitButton} onPress={() => EventRegister()}>
          <Text style={styles.submitButtonText}>등록하기</Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={{ height: 100 }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  inputArea: {
    alignItems: 'center',
    alignSelf: 'center',
    width: width * 0.9,
    padding: 10,
    marginTop: 20
  },
  inputText: {
    alignSelf: 'flex-start',
    color: 'black', // 입력란 제목 글자색
    fontSize: 18,
  },
  inputBox: {
    width: '100%',
    backgroundColor: '#eeeeee',
    borderBottomWidth: 1.5,
    borderRadius: 10,
    borderColor: 'gray', // 입력란 아래 테두리 색
    paddingHorizontal: 5,
  },
  input: {
    width: '90%',
    color: 'black', // 입력 텍스트 색상
    fontSize: 18,
  },
  iconPen: {
    alignSelf: 'center',
  },
  showLength: {
    alignSelf: 'flex-end',
    fontSize: 16,
  },
  contentArea: {
    //backgroundColor: 'red',
    width: width * 0.9,
    padding: 10,
    alignSelf: 'center',
    marginVertical: 10
  },
  addContentBox: {
    width: '100%',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderBottomWidth: 1.5,
    borderColor: 'gray'
  },
  contentTextArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  voteIcon: {
    color: 'black',
    fontSize: 22
  },
  imageIcon: {
    color: 'black',
    fontSize: 22
  },
  PointIcon: {
    color: 'black',
    fontSize: 30
  },
  contentText: {
    color: 'black',
    fontSize: 20,
    marginHorizontal: 5
  },
  contentAddText: {
    color: '#0080ff',
    fontSize: 22,
    marginHorizontal: 5
  },
  addIcon: {
    color: '#0080ff',
    fontSize: 22,
    top: 1
  },
  voteOptionArea: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fileButton: {
    padding: 10,
    backgroundColor: '#FFC700',
    borderRadius: 10,
    elevation: 2
  },
  fileButtonText: {
    fontSize: 16,
    color: 'black',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  cancelButton: {
    alignSelf: 'flex-start',
    right: 15,
    bottom: 5
  },
  icon: {
    alignSelf: 'center',
  },
  imagePreview: {
    width: 200,
    height: 100,
    resizeMode: 'contain',
    backgroundColor: '#eeeeee'
  },
  submitButton: {
    backgroundColor: 'orange',
    width: 100,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center'
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  dateText: {
    color: 'black',
    fontSize: 20,
  },
});

export default RegisterEvent;
