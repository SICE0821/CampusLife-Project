import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Image,
    Alert,
    Modal,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import { useFocusEffect } from '@react-navigation/native';
import { PostDeatilData, CommentsWithRecomments, PostPhoto, UserData } from "../../types/type";
import config from '../../config';

const width = Dimensions.get("window").width;

// 신고 관련 타입 정의
type ReportUser = {
    post_id: number,
    user_id: number,
    report_name: string,
}

type ReportCommentUser = {
    comment_id: number,
    report_comment_name: string,
}

const SchoolClubDetailScreen: React.FC = ({ route, navigation }: any) => {
    console.log("you are in SchoolClubDetailScreen");
    const { item, userData } = route.params;

    // 상태 변수 정의
    const [commentText, setCommentText] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    const [postDetailInfo, setPostDetailInfo] = useState<PostDeatilData>();
    const [userdata, setUserData] = useState<UserData>(userData);
    const [comments, setComments] = useState<CommentsWithRecomments[]>([]);
    const [userReport, setUserReport] = useState<ReportUser[]>([]);
    const [userCommentReport, setUserCommentReport] = useState<ReportCommentUser[]>([]);
    const [isCommentOrRecomment, setIsCommentOrRecomment] = useState(0);
    const [isEditComment, setIsEditComment] = useState(0);
    const [commentsPk, setCommentsPk]: any = useState();
    const [editCommentPk, setEditCommentPk]: any = useState();
    const [editRecommentPk, setEditRecommentPk]: any = useState();
    const [isPushLike, setIsPushLike]: any = useState();
    const [showOptions, setShowOptions] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const inputRef = useRef<TextInput>(null);
    const [postImages, setPostImages] = useState<PostPhoto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<null | number>(null);

    // 옵션 메뉴 토글 함수
    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    // 댓글 옵션 토글 함수
    const toggleOptions2 = (commentId: number) => {
        setActiveCommentId(activeCommentId === commentId ? null : commentId);
    };

    // 댓글 입력 필드 포커스 함수
    const onFocusName = useCallback(() => {
        inputRef.current?.focus();
    }, []);

    // 댓글 수정 시 포커스 함수
    const onFocusEditComment = useCallback((comment_info: any) => {
        setCommentText(comment_info.content);
        inputRef.current?.focus();
    }, []);

    // 대댓글 수정 시 포커스 함수
    const onFocusEditReComment = useCallback((recomment_info: any) => {
        setCommentText(recomment_info.content);
        inputRef.current?.focus();
    }, []);

    // 이미지 모달 열기 함수
    const openImageModal = (index: number) => {
        setActiveImageIndex(index);
        setShowModal(true);
    };

    // 모달 닫기 함수
    const closeModal = () => {
        console.log('Attempting to close modal...');
        setShowModal(false);
        setActiveImageIndex(null);
    };

    // 화면 포커스 시 데이터 가져오기
    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await fetchPostDetail();
                    await fetchPostPhotos();
                    setUserData(userdata);
                } catch (error) {
                    console.error('데이터 가져오기 실패:', error);
                }
            };
            fetchData();
        }, [])
    );

    // 좋아요 여부 확인 함수
    const isUserPostLike = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/is_user_post_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    post_id: postDetailInfo?.post_id
                })
            });
            const result = await response.json();
            return result.isLiked;
        } catch (error) {
            console.error(error);
        }
    };

    // 좋아요 취소 함수
    const cancelPostLike = async (post_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/cancel_post_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    post_id: post_id
                })
            });
            await response.json();
        } catch (error) {
            console.error(error);
        }
    };

    // 좋아요 추가 함수
    const putUserPostLike = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/put_user_post_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    post_id: postDetailInfo?.post_id
                })
            });
        } catch (error) {
            console.error(error);
        }
    };

    // 포스트 상세 정보 가져오기 함수
    const fetchPostDetail = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_post_detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: item.post_id
                })
            });
            const postDetail = await response.json();
            setPostDetailInfo(postDetail);
        } catch (error) {
            console.error('포스트 상세 정보 가져오기 실패:', error);
        }
    };

    // 포스트 사진 가져오기 함수
    const fetchPostPhotos = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/DetailPostPhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: item.post_id
                })
            });
            const photos = await response.json();
            setPostImages(photos);
            console.log(photos);
        } catch (error) {
            console.error('포스트 사진 가져오기 실패:', error);
        }
    };

    // 좋아요 30개 이상 시 핫 포스터 등록 및 알림 전송
    const addHotAlarm = async () => {
        try {
            await fetch(`${config.serverUrl}/addHotAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target_id: postDetailInfo?.post_id,
                })
            });
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    };

    // 포스트 신고 알람 전송 함수
    const reportPostAlarm = async () => {
        try {
            await fetch(`${config.serverUrl}/reportPostAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target_id: postDetailInfo?.post_id,
                })
            });
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    };

    // 댓글 신고 알람 전송 함수
    const reportCommentAlarm = async () => {
        try {
            await fetch(`${config.serverUrl}/reportCommentAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target_id: postDetailInfo?.post_id,
                })
            });
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    };

    // 좋아요 시 알람 전송 함수
    const addLikeAlarm = async () => {
        try {
            await fetch(`${config.serverUrl}/addLikeAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: postDetailInfo?.user_id,
                    target_id: postDetailInfo?.post_id,
                })
            });
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    };

    // 포스트 좋아요 증가 함수
    const likePost = async (post_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/post_like_up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post_id,
                    user_id: userdata.user_pk
                })
            });
            await response.json();
            await fetchPostDetail(); // 좋아요 누르면 바로 반영
        } catch (error) {
            console.error('포스트 좋아요 실패:', error);
        }
    };

    // 포스트 좋아요 취소 함수
    const unlikePost = async (post_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/post_like_down`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post_id,
                    user_id: userdata.user_pk
                })
            });
            await response.json();
            await fetchPostDetail(); // 좋아요 취소 시 바로 반영
        } catch (error) {
            console.error('포스트 좋아요 취소 실패:', error);
        }
    };

    // 사용자 신고 등록 함수
    const putUserReport = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/putuserreport`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postDetailInfo?.post_id,
                    report_name: userdata.name
                })
            });
            if (response.ok) {
                const data = await response.json();
                setUserReport(prev => [
                    ...prev,
                    {
                        post_id: postDetailInfo?.post_id || 0,
                        user_id: postDetailInfo?.user_id || 0,
                        report_name: typeof userdata.name === 'string' ? userdata.name : ''
                    }
                ]);
                Alert.alert("신고 예약 되었습니다.");
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('신고 제출 실패:', error);
            Alert.alert('신고 제출에 실패하였습니다.');
        }
    };

    // 게시글 삭제 함수
    const deletePost = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/deletepost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postDetailInfo?.post_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();

            // 삭제 성공 시 알림 후 이전 화면으로 이동
            Alert.alert(
                '알림',
                '게시글이 삭제되었습니다.',
                [
                    {
                        text: '확인',
                        onPress: () => navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('게시글 삭제 실패:', error);
            Alert.alert('오류', '게시글 삭제에 실패했습니다.');
        }
    };

    // 중복 신고 여부 확인 및 신고 처리 함수
    const reportUserDuplicate = async () => {
        const isDuplicateReport = userReport.some((report) =>
            userdata.name === report.report_name && postDetailInfo?.post_id === report.post_id
        );
        if (isDuplicateReport) {
            Alert.alert("해당 게시물은 이미 신고 접수가 완료되었습니다.");
        } else {
            await putUserReport();
            await reportPostAlarm();
        }
    };

    // 사용자 신고 데이터 가져오기 함수
    const getUserReport = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/getuserreport`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUserReport(data);
            return data;
        } catch (error) {
            console.error('신고 데이터 가져오기 실패:', error);
        }
    };

    // 포스트 좋아요 알림 함수
    const postLikeAlert = (post_id: any) => {
        Alert.alert(
            "좋아요!!",
            "좋아요를 누르시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: async () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        const is_post_like: boolean = await isUserPostLike();
                        if (is_post_like) {
                            await likePost(post_id);
                            await putUserPostLike();
                            await addLikeAlarm();
                            if (postDetailInfo?.like === 29) { // 좋아요가 30개가 되면
                                await addHotAlarm();
                            }
                        } else {
                            console.log("이미 좋아요를 눌렀습니다.");
                        }
                    }
                }
            ]
        );
    };

    // 포스트 좋아요 취소 알림 함수
    const postCancelLikeAlert = (post_id: any) => {
        Alert.alert(
            "좋아요 취소!!",
            "좋아요를 취소하시겠습니까??",
            [
                {
                    text: "취소",
                    onPress: async () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        await unlikePost(post_id);
                        await cancelPostLike(post_id);
                    }
                }
            ]
        );
    };

    // 본인 게시물 수정 불가 알림 함수
    const noYourPostAlert = () => {
        Alert.alert(
            "본인 게시물만 수정할 수 있습니다.",
            "게시물 수정은 본인이 작성한 게시물만 할 수 있습니다.",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "확인" }
            ],
        );
    };

    // 게시글 수정 화면으로 이동 시 포스트 정보 가져오기
    const getPostInfo = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_post_info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postDetailInfo?.post_id
                })
            });
            const post_info = await response.json();
            return post_info;
        } catch (error) {
            console.error(error);
        }
    };

    // 댓글 입력 필드 크기 변경 핸들러
    const handleContentSizeChange = (e: any) => {
        const maxLineHeight = 112;
        const currentLineHeight = e.nativeEvent.contentSize.height;

        if (currentLineHeight <= maxLineHeight) {
            setInputHeight(e.nativeEvent.contentSize.height);
        }
        // console.log(e.nativeEvent.contentSize.height);
    };

    // 댓글 입력 변경 핸들러
    const handleInputChange = (inputText: string) => {
        setCommentText(inputText);
    };

    // 게시일 포맷팅
    const writeDate = postDetailInfo?.write_date;
    let formattedDate = "";
    if (writeDate) {
        const parts = writeDate.split("-");
        const datePart = parts.slice(0, 3).join("-");
        const timePart = parts.slice(3).join(":");
        formattedDate = `${datePart} ${timePart}`;
    }

    // 컴포넌트 마운트 시 사용자 신고 데이터 가져오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                await getUserReport();
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* 작성자 정보 영역 */}
                <View style={styles.writerArea}>
                    <View style={styles.writer}>
                        <View style={styles.writerPic}>
                            <Image
                                source={{ uri: `${config.photoUrl}/${postDetailInfo?.writer_propile}` }}
                                style={{ flex: 1, borderRadius: 12 }}
                            />
                        </View>
                        <View style={styles.writerInfo}>
                            <Text style={styles.writerName}>
                                {postDetailInfo?.post_writer}({postDetailInfo?.writer_department})
                            </Text>
                            <Text style={styles.writeTime}>{formattedDate}</Text>
                        </View>
                    </View>
                    {/* 옵션 버튼 */}
                    <TouchableOpacity onPress={toggleOptions} style={{ zIndex: 1000 }} >
                        <IconA size={35} color="black" name={"dots-three-vertical"} />
                    </TouchableOpacity>

                    {/* 옵션 메뉴 */}
                    {showOptions && (
                        <View style={styles.optionBox}>
                            {/* 수정 옵션 */}
                            <TouchableOpacity onPress={async () => {
                                if (userdata.user_pk === postDetailInfo?.user_id) {
                                    const postEditInfo = await getPostInfo();
                                    navigation.navigate("EditPostScreen", { userdata, postEditInfo, postImages });
                                } else {
                                    noYourPostAlert();
                                    toggleOptions();
                                }
                            }}>
                                <Text style={styles.optionText}>수정</Text>
                            </TouchableOpacity>
                            <View style={styles.optionLine}></View>
                            {/* 신고 옵션 */}
                            <TouchableOpacity
                                onPress={() => {
                                    if (userdata.user_pk === postDetailInfo?.user_id) {
                                        Alert.alert("본인은 신고할 수 없습니다.");
                                    } else {
                                        reportUserDuplicate();
                                    }
                                }}>
                                <Text style={styles.optionText}>신고</Text>
                            </TouchableOpacity>
                            {/* 삭제 옵션: 사용자 권한에 따라 표시 */}
                            {(userdata?.title === "학교" || postDetailInfo?.post_writer === userdata?.name) && (
                                <>
                                    <View style={styles.optionLine}></View>
                                    <TouchableOpacity onPress={deletePost}>
                                        <Text style={styles.optionText}>삭제</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    )}
                </View>

                {/* 포스트 내용 영역 */}
                <View style={styles.postArea}>
                    <Text style={styles.postTitle}>{postDetailInfo?.title}</Text>
                    <Text style={styles.postContent}>{postDetailInfo?.contents}</Text>
                    
                    {/* 포스트 이미지 스크롤: postImages가 있을 때만 렌더링 */}
                    {postImages.length > 0 && (
                        <ScrollView horizontal style={styles.imagePreviewContainer} showsHorizontalScrollIndicator={false}>
                            {postImages.map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => openImageModal(index)}
                                    style={postImages.length === 1 ? styles.previewImageFullArea : null}>
                                    <Image
                                        source={{ uri: `${config.photoUrl}/${image.post_photo}.png` }}
                                        style={postImages.length === 1 ? styles.previewImageFullWidth : styles.previewImage}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* 포스트 상태 (좋아요, 조회수) */}
                <View style={styles.postState}>
                    <TouchableOpacity onPress={async () => {
                        const is_post_like: boolean = await isUserPostLike();
                        if (is_post_like) {
                            postLikeAlert(postDetailInfo?.post_id);
                        } else {
                            postCancelLikeAlert(postDetailInfo?.post_id);
                        }
                    }}>
                        <IconB name="like1" size={24} color={'black'} />
                    </TouchableOpacity>
                    <Text style={styles.likeCount}>{postDetailInfo?.like}</Text>
                    <Text style={{ color: 'black', marginLeft: 5 }}>
                        <IconB name="eyeo" size={24} />
                    </Text>
                    <Text style={styles.viewCount}>{postDetailInfo?.view}</Text>
                </View>

                <View style={{ height: 20 }}></View>
            </ScrollView>

            {/* 이미지 모달 */}
            {activeImageIndex !== null && (
                <Modal
                    visible={showModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalTop}>
                        <TouchableOpacity onPress={closeModal} style={styles.closeModalButton}>
                            <Text style={styles.closeModalText}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.modalBackground}>
                        <FlatList
                            data={postImages}
                            horizontal
                            pagingEnabled
                            initialScrollIndex={activeImageIndex}
                            getItemLayout={(data, index) => (
                                { length: width, offset: width * index, index }
                            )}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image
                                    source={{ uri: `${config.photoUrl}/${item.post_photo}.png` }}
                                    style={styles.fullImage}
                                />
                            )}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </View>
                </Modal>
            )}

            {/* 동아리 신청 및 현황 파악 버튼 */}
            <View style={styles.buttonContainer}>
                {(userdata?.user_pk !== postDetailInfo?.user_id) && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            console.log("동아리 신청하기.");
                            navigation.navigate("SchoolClubSignScreen", { item, userData });
                        }}
                    >
                        <Text style={styles.buttonText}>동아리 신청하기</Text>
                    </TouchableOpacity>
                )}
                {(userdata?.user_pk === postDetailInfo?.user_id) && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            console.log("동아리 현황 파악하기.");
                            navigation.navigate("SchoolClubSignStateScreen", { item, userData });
                        }}
                    >
                        <Text style={styles.buttonText}>동아리 현황 파악하기</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

};

// 스타일 시트 정의
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    writerArea: { // 상단 작성자 영역
        height: 100,
        borderBottomWidth: 1,
        borderRadius: 20,
        borderColor: 'gray',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 35,
        alignItems: 'center',
    },
    writer: {
        flexDirection: 'row',
    },
    writerPic: { // 작성자 프로필 사진
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: 'gray'
    },
    writerInfo: { // 작성자 정보 영역
        height: 60,
        marginHorizontal: 10,
        justifyContent: 'space-evenly',
    },
    writerName: { // 작성자 이름
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black'
    },
    writeTime: { // 작성 시간
        fontSize: 17,
        color: 'black'
    },
    optionBox: { // 옵션 메뉴 스타일
        position: 'absolute',
        top: 70,
        right: 20,
        width: 120,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        zIndex: 9999
    },
    optionText: { // 옵션 텍스트 스타일
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
        paddingLeft: 10
    },
    optionLine: { // 옵션 메뉴 구분선
        width: 100,
        height: 0.4,
        backgroundColor: 'black',
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    postArea: { // 포스트 내용 영역
        flex: 1,
        marginHorizontal: 25,
        marginVertical: 10,
    },
    postTitle: { // 포스트 제목
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    postContent: { // 포스트 내용
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    postState: { // 포스트 상태 (좋아요, 조회수)
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 20,
        marginBottom: 20,
        borderColor: 'gray',
        borderBottomWidth: 1,
        borderRadius: 20
    },
    likeCount: { // 좋아요 수
        color: 'black',
        fontSize: 20,
        marginLeft: 5
    },
    viewCount: { // 조회수
        color: 'black',
        fontSize: 20,
        marginLeft: 5
    },
    imagePreviewContainer: { // 이미지 스크롤 컨테이너
        flexDirection: 'row',
    },
    previewImage: { // 이미지 미리보기 스타일
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    previewImageFullArea: { // 이미지가 한 장일 때 전체 영역 사용
        width: width - 60,
        height: width - 60,
    },
    previewImageFullWidth: { // 이미지가 한 장일 때 전체 너비 사용
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    fullImage: { // 모달에서 보여지는 전체 이미지 스타일
        flex: 1,
        width: width,
        height: '100%',
        resizeMode: 'contain'
    },
    modalBackground: { // 모달 배경 스타일
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalTop: { // 모달 상단 닫기 버튼 영역
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    closeModalButton: { // 모달 닫기 버튼 스타일
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeModalText: { // 모달 닫기 텍스트 스타일
        color: 'white',
        fontSize: 30,
    },
    buttonContainer: { // 하단 버튼 컨테이너 스타일
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'center',
    },
    button: { // 커스터마이징된 버튼 스타일
        width: '100%',
        backgroundColor: '#4CAF50', // 원하는 배경색으로 변경
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: { // 버튼 텍스트 스타일
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: { // 'or' 텍스트 스타일
        marginVertical: 10,
        fontSize: 16,
        color: 'gray'
    }
});

export default SchoolClubDetailScreen;
