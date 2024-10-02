import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Keyboard, Alert, Modal, TouchableOpacity, FlatList, Dimensions, Button } from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import IconD from 'react-native-vector-icons/EvilIcons';
import IconC from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import { PostDeatilData, CommentsWithRecomments, PostPhoto } from "../../types/type"
import { UserData } from '../../types/type'
import config from '../../config';

const width = Dimensions.get("window").width;

const eventImages = [
    require('../../assets/001.png'),
    require('../../assets/002.png'),
    require('../../assets/부천대.png'),
    require('../../assets/wjdtkdghk.jpg'),
];

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
    console.log("you are in SchoolClubDetailScreen")
    const { item, userData } = route.params;
    const [commenttext, setcommenttext] = useState('');
    const [inputheight, setinputheight] = useState(40);
    const [postDetailInfo, setPostDetailInfo] = useState<PostDeatilData>();
    const [userdata, setUserData] = useState<UserData>(userData);
    const [comments, setComments] = useState<CommentsWithRecomments[]>([]);
    const [userReport, setUserReport] = useState<ReportUser[]>([]);
    const [usercommentRe1port, setUsercommentReport] = useState<ReportCommentUser[]>([]);
    const [IsCommentorRecomment, setIsCommentorRecomment] = useState(0);
    const [IsEditComment, setIsEditComment] = useState(0);
    const [commentspk, setCommentspk]: any = useState();
    const [editcommentpk, setEditcommentpk]: any = useState();
    const [editrecommentpk, setEditrecommentpk]: any = useState();
    const [ispushlike, Setispushlike]: any = useState();
    const [showOptions, setShowOptions] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
    const inputRef = useRef<TextInput>(null);

    const [postImages, setpostImages] = useState<PostPhoto[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [activeImageIndex, setActiveImageIndex] = useState<null | number>(null);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const toggleOptions2 = (commentId: number) => {
        setActiveCommentId(activeCommentId === commentId ? null : commentId);
    };

    const onFocusName = useCallback(() => {
        //nameInput ref객체가 가리키는 컴포넌트(이름 입력필드)를 포커스합니다.
        inputRef.current?.focus();
    }, []);

    const onFocusEditComment = useCallback((comment_info: any) => {
        setcommenttext(comment_info.content);
        inputRef.current?.focus();
    }, []);

    const onFocusEditReComment = useCallback((recomment_info: any) => {
        setcommenttext(recomment_info.content);
        inputRef.current?.focus();
    }, []);

    const openImageModal = (index: number) => {
        setActiveImageIndex(index);
        setShowModal(true);
    };

    const closeModal = () => {
        console.log('Attempting to close modal...'); // Debug statement
        setShowModal(false);
        setActiveImageIndex(null);
    };

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await DeatilPost();
                    await DetailPostPhoto();
                    setUserData(userdata);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, [])
    );

    //좋아요 중복 제거
    const is_user_post_like = async () => {
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
            })
            const result = await response.json();
            return result.isLiked;
        } catch (error) {
            console.error(error);
        }
    }



    //좋아요 테이블에서 해당 유저 삭제
    const cancel_post_like = async (post_id: any) => {
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
            })
            await response.json();
        } catch (error) {
            console.error(error);
        }
    }



    //좋아요 테이블에 유저 번호 넣음
    const put_user_post_like = async () => {
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
            })
        } catch (error) {
            console.error(error);
        }
    }



    //포스터에 대한 정보.
    const DeatilPost = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_post_detail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: item.post_id
                })
            })
            const get_post_detail = await response.json();
            setPostDetailInfo(get_post_detail);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
        }
    }

    //포스터 사진 가져오기
    const DetailPostPhoto = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/DetailPostPhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: item.post_id
                })
            })
            const DetailPostPhoto = await response.json();
            setpostImages(DetailPostPhoto);
            console.log(DetailPostPhoto);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
        }
    }



    //좋아요 30개가 넘으면 핫포스터로 등록되면서 모든 user에게 알람 보내기
    const addHotAram = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/addHotAram`, {
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
    }

    //리포트 포스터
    const reportPostAram = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/reportPostAram`, {
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
    }

    const reportCommentAram = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/reportCommentAram`, {
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
    }

    //좋아요 눌러주면 해당 당사자에게 알람이 쑝숑쑝~
    const addLikeAram = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/addLikeAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: postDetailInfo?.user_id,
                    target_id: postDetailInfo?.post_id,
                })
            });;
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    }



    //포스트 좋아요 누르기
    const like_num_up = async (post_id: any) => {
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
            })
            const result = await response.json();
            await DeatilPost(); //좋이요 누르면 바로 반영
        } catch (error) {
            console.error('포스트 좋아요 누르기 실패', error);
        }
    }

    //포스트 좋아요 취소하기
    const like_num_down = async (post_id: any) => {
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
            })
            const result = await response.json();
            await DeatilPost(); //좋이요 누르면 바로 반영
        } catch (error) {
            console.error('포스트 좋아요 누르기 실패', error);
        }
    }






    const put_user_report = async () => {
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
                        report_name: typeof userdata.name === 'string' ? userdata.name : '' // Ensure report_name is a string
                    }
                ]);
                Alert.alert("신고 예약 되었습니다."); // 성공 메시지 표시
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('신고 제출에 실패하였습니다.', error);
            Alert.alert('신고 제출에 실패하였습니다.'); // 실패 메시지 표시
        }
    };

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
            //console.log('게시글 삭제 완료:', result);

            // 게시글 삭제가 성공하면 알림창을 띄우고 확인 버튼을 눌렀을 때 navigation.goBack()을 호출합니다.
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




    const ReportUserduplicate = async () => {
        const isDuplicateReport = userReport.some((report) =>
            userdata.name === report.report_name && postDetailInfo?.post_id === report.post_id
        );
        if (isDuplicateReport) {
            Alert.alert("해당 게시물은 이미 신고 접수가 완료되었습니다.");
        } else {
            await put_user_report();
            await reportPostAram();
        }
    }

    const get_user_report = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/getuserreport`, {
                method: 'GET', // GET 요청으로 수정
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUserReport(data);
            return data;
        } catch (error) {
            console.error('값 가져오기 실패:', error);
        }
    }



    const Post_Like_alert = (post_id: any) => {
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

                        const is_post_like: boolean = await is_user_post_like(); //유저의 포스터 좋아요 방지 확인
                        if (is_post_like) {
                            await like_num_up(post_id);
                            await put_user_post_like();
                            await addLikeAram();
                            if (postDetailInfo?.like == 29) {
                                await addHotAram();
                            }
                        } else {
                            console.log("이미 좋아요를 눌렀습니다.")
                        }
                    }
                }
            ]
        );
    };

    const Post_Cancel_Like_alert = (post_id: any) => {
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
                        await like_num_down(post_id);
                        await cancel_post_like(post_id);
                    }
                }
            ]
        );
    };




    const NoyourPostAlert = () => {
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



    //우선 게시글 수정화면에 본래 post정보를 뿌려주기 위해 포스터 데이터를 가져오자
    const get_post_info = async () => {
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
            return post_info
        } catch (error) {
            console.error(error);
        }
    }


    const handleContentSizeChange = (e: any) => {
        const maxlineHeight = 112;
        const currentlineHeight = e.nativeEvent.contentSize.height;

        if (currentlineHeight <= maxlineHeight) {
            setinputheight(e.nativeEvent.contentSize.height);
        }
        //console.log(e.nativeEvent.contentSize.height);
    }
    const handleInputChange = (inputText: string) => {
        setcommenttext(inputText);
    };




    const writeDate = postDetailInfo?.write_date;
    let formattedDate = "";
    if (writeDate) {
        const parts = writeDate.split("-");
        const datePart = parts.slice(0, 3).join("-");
        const timePart = parts.slice(3).join(":");
        formattedDate = `${datePart} ${timePart}`;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await get_user_report();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.writerArea}>
                    <View style={styles.writer}>
                        <View style={styles.writerPic}>
                            <Image
                                source={{ uri: `${config.photoUrl}/${postDetailInfo?.writer_propile}` }}
                                style={{ flex: 1, borderRadius: 12 }}
                            />
                        </View>
                        <View style={styles.writerInfo}>
                            <Text style={styles.writerName}>{postDetailInfo?.post_writer}({postDetailInfo?.writer_department})</Text>
                            <Text style={styles.writeTime}>{formattedDate}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={toggleOptions} style={{ zIndex: 1000 }} >
                        <IconA size={35} color="black" name={"dots-three-vertical"} />
                    </TouchableOpacity>

                    {showOptions && ( // 상단 옵션
                        <View style={styles.optionBox}>
                            <TouchableOpacity onPress={async () => {
                                if (userdata.user_pk === postDetailInfo?.user_id) {
                                    const post_edit_info = await get_post_info();
                                    navigation.navigate("EditPostScreen", { userdata, post_edit_info, postImages })
                                } else {
                                    NoyourPostAlert();
                                    toggleOptions();
                                }
                            }}>
                                <Text style={styles.optionText}>수정</Text>
                            </TouchableOpacity>
                            <View style={styles.optionLine}></View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (userdata.user_pk === postDetailInfo?.user_id) {
                                        Alert.alert("본인은 신고할 수 없습니다.");
                                    } else {
                                        //포스트 신고
                                        ReportUserduplicate();
                                    }
                                }}>
                                <Text style={styles.optionText}>신고</Text>
                            </TouchableOpacity>
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
                <View style={styles.postArea}>
                    <Text style={styles.postTitle}>{postDetailInfo?.title}</Text>
                    <Text style={styles.postContent}>{postDetailInfo?.contents}</Text>
                    <ScrollView horizontal style={styles.imagePreviewContainer} showsHorizontalScrollIndicator={false}>
                        {postImages.map((image, index) => (
                            <TouchableOpacity key={index} onPress={() => openImageModal(index)}
                                style={postImages.length === 1 ? styles.previewImageFullArea : null}>
                                <Image
                                    source={{ uri: `${config.photoUrl}/${image.post_photo}.png` }}
                                    style={postImages.length === 1 ? styles.previewImageFullWidth : styles.previewImage}
                                />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.postState}>
                    <TouchableOpacity onPress={async () => {
                        const is_post_like: boolean = await is_user_post_like();
                        if (is_post_like) {
                            Post_Like_alert(postDetailInfo?.post_id)
                        } else {
                            Post_Cancel_Like_alert(postDetailInfo?.post_id)
                        }
                    }

                    }>
                        <IconB name="like1" size={24} color={'black'} />
                    </TouchableOpacity>
                    <Text style={{ color: 'black', fontSize: 20 }}> {postDetailInfo?.like}</Text>
                    <Text style={{ color: 'black', marginLeft: 5 }}><IconB name="eyeo" size={24} /></Text>
                    <Text style={{ color: 'black', fontSize: 20, marginLeft: 5 }}>{postDetailInfo?.view}</Text>
                </View>
                <View style={{ height: 20 }}></View>

            </ScrollView>
            {/* Your existing components */}
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
                                <Image source={{ uri: `${config.photoUrl}/${item.post_photo}.png` }}
                                    style={styles.fullImage} />
                            )}
                            keyExtractor={(_, index) => index.toString()}
                        />
                    </View>
                </Modal>
            )}
            <View style = {{flex : 1, alignItems : 'center'}}>
            <Button
                title="(유저)동아리 신청하기."
                onPress={() => {
                    console.log("동아리 신청하기.");
                    navigation.navigate("SchoolClubSignScreen", {item, userData});
                }}
            />
            <View style = {{height : 20}}></View>
            <Text>or</Text>
            <View style = {{height : 20}}></View>
            {(userdata?.user_pk === postDetailInfo?.user_id) && (
                    <>
                        <Button
                            title="(게시글 주인)동아리 현황파악하기."
                            onPress={() => {
                                console.log("동아리 현황파악하기.");
                                navigation.navigate("SchoolClubSignStateScreen", { item, userData });
                            }}
                        />
                                </>
                            )}          
            </View>
        </View>
    );
};

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
        //backgroundColor: 'orange'
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
    optionBox: {
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
        zIndex: 999
    },
    optionText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "black",
        paddingLeft: 10
    },
    optionLine: {
        width: 100,
        height: 0.4,
        backgroundColor: 'black',
        marginRight: 20,
        marginTop: 10,
        marginBottom: 10
    },
    postArea: {
        flex: 1,
        marginHorizontal: 25,
        marginVertical: 10,
    },
    postTitle: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold'
    },
    postContent: { // 게시물 내용
        fontSize: 18,
        color: 'black',
        marginTop: 10,
        marginBottom: 20
    },
    postState: { // 게시물 상태 (좋아요 조회수)
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingBottom: 20,
        marginBottom: 20,
        borderColor: 'gray',
        borderBottomWidth: 1,
        borderRadius: 20
    },
    //만약에 사진 추가 하려면 여기에
    commentcontainer: {
        minHeight: 120,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        borderRadius: 20,
    },
    commentTop: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        justifyContent: 'space-between'
    },
    commentInfo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    commentPic: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: 'gray'
    },
    commentName: {
        marginHorizontal: 10,
    },
    commentOptionBox: {
        width: 120,
        height: 35,
        backgroundColor: '#CED4DA',
        borderRadius: 8,
        elevation: 5,
        flexDirection: 'row',
    },
    commentOptionIcon: {
        width: 40,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    commentContentArea: {
        paddingHorizontal: 25,
        paddingVertical: 10,
    },
    commentContent: {
        fontSize: 19,
        color: 'black',
    },
    commentState: {
        flexDirection: 'row',
        marginTop: 10
    },
    commentStateText: {
        fontSize: 15,
        color: 'black',
    },
    recommentTop: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 15,
        justifyContent: 'space-between',
    },
    recommentOptionBox: {
        width: 80,
        height: 35,
        backgroundColor: '#CED4DA',
        borderRadius: 8,
        elevation: 5,
        flexDirection: 'row',
    },
    recommentContentArea: {
        paddingHorizontal: 25,
        paddingLeft: 70,
        paddingVertical: 10,
    },
    writeCommentBox: {
        backgroundColor: '#D9D9D9',
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    inputtext: {
        width: '88%',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    sendspace: {
        width: 45,
        height: 45,
        borderRadius: 10,
        justifyContent: 'center',
        marginRight: 20,
    },
    commentOption: {
        top: 45,
        right: 20,
        position: 'absolute',
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
    },
    recommentOption: {
        top: 60,
        right: 20,
        position: 'absolute',
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
    },
    imagePreviewContainer: {
        flexDirection: 'row',
    },
    previewImage: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 10,
        resizeMode: 'contain',
    },
    previewImageFullArea: {
        width: width - 60,
        height: width - 60,
    },
    previewImageFullWidth: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    fullImage: {
        flex: 1,
        width: width,
        height: '100%',
        resizeMode: 'contain'
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalTop: {
        width: '100%',
        height: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    closeModalButton: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeModalText: {
        color: 'white',
        fontSize: 30,
    },
})

export default SchoolClubDetailScreen;