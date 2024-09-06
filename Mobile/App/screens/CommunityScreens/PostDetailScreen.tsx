import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Image, Keyboard, Alert } from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import IconD from 'react-native-vector-icons/EvilIcons';
import IconC from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import { PostDeatilData, PostCommentData, CommentsWithRecomments } from "../../types/type"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { UserData } from '../../types/type'
import config from '../../config';
import { ClipPath } from 'react-native-svg';

type ReportUser = {
    post_id: number,
    user_id: number,
    report_name: string,
}

type ReportCommentUser = {
    comment_id: number,
    report_comment_name: string,
}


const PostDetailScreen: React.FC = ({ route, navigation }: any) => {
    console.log("you are in PostDetailScreen")
    const { item, userData } = route.params;
    const [commenttext, setcommenttext] = useState('');
    const [inputheight, setinputheight] = useState(40);
    const [postDetailInfo, setPostDetailInfo] = useState<PostDeatilData>(); //포스터에 대한 정보.
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

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await DeatilPost();
                    await CommentList();
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

    //댓글 좋아요 중복 방치
    const is_user_comment_like = async (comment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/is_user_comment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    comment_id: comment_id
                })
            })
            const result = await response.json();
            return result.isLiked;
        } catch (error) {
            console.error(error);
        }
    }

    //대댓글 좋아요 중복 방치
    const is_user_recomment_like = async (recomment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/is_user_recomment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    recomment_id: recomment_id
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

    //댓글 좋아요 테이블에서 해당 유저 삭제
    const cancel_recomment_like = async (recomment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/cancel_recomment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    recomment_id: recomment_id
                })
            })
            await response.json();
        } catch (error) {
            console.error(error);
        }
    }

    //댓글 좋아요 테이블에서 해당 유저 삭제
    const cancel_comment_like = async (comment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/cancel_comment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,
                    comment_id: comment_id
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

    //댓글 좋아요 기록을 저장
    const put_user_comment_like = async (comment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/put_user_comment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,//해당 유저의 pk
                    comment_id: comment_id //해당 댓글의 pk
                })
            })
        } catch (error) {
            console.error(error);
        }
    }

    //대댓글 좋아요 기록을 저장
    const put_user_recomment_like = async (recomment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/put_user_recomment_like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userdata.user_pk,//해당 유저의 pk
                    recomment_id: recomment_id //해당 대댓글의 pk
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

    //댓글 리스트 가져오기
    const CommentList = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${config.serverUrl}/get_comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_ida: item.post_id
                })
            })
            const get_comment = await response.json();

            //댓글과 연결된 대댓글을 연결하는 작업
            const commentsWithRecomments = await Promise.all(
                get_comment.map(async (comment: any) => {
                    const recommentData = await fetchRecommentData(comment.comment_id);
                    return { ...comment, recomments: recommentData };
                })
            );
            setComments(commentsWithRecomments);
            clearTimeout(timeoutId);
            return (commentsWithRecomments);
        } catch (error) {
            console.error('댓글리스트 가져오기 실패:', error);
        }
    }
    //댓글달기
    const writecomment = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/writecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postDetailInfo?.post_id,
                    user_id: userdata.user_pk,
                    contents: commenttext
                })
            });
            await response.json();
            await CommentList();
        } catch (error) {
            console.error('댓글 쓰기 실패!', error);
        }
    }

    //댓글수정
    const editcomment = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/editcomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_pk: editcommentpk,
                    contents: commenttext
                })
            });
            await response.json();
            await CommentList();
        } catch (error) {
            console.error('댓글 수정 실패!', error);
        }
    }

    //댓글수정
    const editrecomment = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/editrecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recomment_pk: editrecommentpk,
                    contents: commenttext
                })
            });
            await response.json();
            await CommentList();
        } catch (error) {
            console.error('대댓글 수정 실패!', error);
        }
    }



    //댓글 작성 알람 추가
    const addCommentAram = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/addCommentAram`, {
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

    //대댓글 좋아요 누르면 해당 대댓글 쓴 사람한테 알람
    const addRecommentLikeAram = async (comment_id: any, user_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/addRecommentLikeAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id, //이거, 대댓글 쓴 사람 PK 넣어줘야됨
                    target_id: comment_id, //이거 recomment PK 넣어줘야됨
                })
            });;
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    }

    //댓글 좋아요 누르면 해당 댓글 쓴 사람한테 알람
    const addCommentLikeAram = async (comment_id: any, user_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/addCommentLikeAram`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_id, //이거, 댓글 쓴 사람 PK 넣어줘야됨
                    target_id: comment_id, //이거 comment PK 넣어줘야됨
                })
            });;
        } catch (error) {
            console.error('알람 전송 실패', error);
        }
    }

    //대댓글 달기
    const writerecomment = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/rewritecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: commentspk,
                    user_id: userdata.user_pk,
                    contents: commenttext
                })
            });
            await CommentList();
        } catch (error) {
            console.error('대댓글 쓰기 실패!', error);
        }
    }

    //대댓글 리스트 가져오기(잘 작동하고.)
    const fetchRecommentData = async (comment_pk: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/get_recomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_pk
                })
            })
            const recomment = await response.json();
            return recomment;
        } catch (error) {
            console.error('대댓글 하나 가져오기 실패:', error);
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

    //댓글 좋아요 누르기
    const comment_like_num_up = async (comment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/comment_like_up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_id
                })
            })
            await response.json();
            //console.log("댓글 좋아요 누르기 성공!")
        } catch (error) {
            console.error('댓글 좋아요 누르기 실패', error);
        }
    }

    //댓글 좋아요 내리기
    const comment_like_num_down = async (comment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/comment_like_num_down`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_id
                })
            })
            await response.json();
        } catch (error) {
            console.error('댓글 좋아요 누르기 실패', error);
        }
    }

    //대댓글 좋아요 누르기
    const recomment_like_num_up = async (recomment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/recomment_like_up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recomment_id: recomment_id
                })
            })
            const result = await response.json();
        } catch (error) {
            console.error('대댓글 좋아요 누르기 실패', error);
        }
    }

    //대댓글 좋아요 수 내리기
    const recomment_like_num_down = async (recomment_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/recomment_like_num_down`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recomment_id: recomment_id
                })
            })
            const result = await response.json();
        } catch (error) {
            console.error('대댓글 좋아요 누르기 실패', error);
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

    const put_user_comment_report = async (comment_id: number) => {
        try {
            const response = await fetch(`${config.serverUrl}/putusercommentreport`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_id,
                    report_comment_name: userdata.name
                })
            });
            if (response.ok) {
                const data = await response.json();
                setUsercommentReport(prev => [
                    ...prev,
                    {
                        comment_id: comment_id || 0,
                        report_comment_name: typeof userdata.name === 'string' ? userdata.name : '' // Ensure report_comment_name is a string
                    }
                ]);
                Alert.alert("신고 예약 되었습니다."); // 성공 메시지 표시
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            Alert.alert('신고 제출에 실패하였습니다.'); // 실패 메시지 표시
        }
    };


    const deleteComment = async (comment_id: number) => {
        try {
            const response = await fetch(`${config.serverUrl}/deletecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            await CommentList();

            Alert.alert(
                '알림',
                '댓글이 삭제되었습니다.',
                [
                    {
                        text: '확인',
                    },
                ],
                { cancelable: false }
            );
            //console.log('함수 잘 마무리!');
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            Alert.alert('오류', '댓글 삭제에 실패했습니다.');
        }
    };

    const deleterecomment = async (recomment_id: number) => {
        try {
            const response = await fetch(`${config.serverUrl}/deleterecomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recomment_id: recomment_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            await CommentList();

            Alert.alert(
                '알림',
                '댓글이 삭제되었습니다.',
                [
                    {
                        text: '확인',
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            Alert.alert('오류', '댓글 삭제에 실패했습니다.');
        }
    };

    const EditCommentAlert = () => {
        Alert.alert(
            "댓글 수정",
            "정말로 댓글을 수정하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "확인", onPress: async () => { await editcomment(); } }
            ],
        );
    };

    const EditreCommentAlert = () => {
        Alert.alert(
            "대댓글 수정",
            "정말로 대댓글을 수정하시겠습니까?",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "확인", onPress: async () => { await editrecomment(); } }
            ],
        );
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

    const ReportUserduplicate2 = async (comment_id: number) => {

        const isDuplicateReport = usercommentRe1port.some((report) =>
            userdata.name === report.report_comment_name && comment_id === report.comment_id
        );
        if (isDuplicateReport) {
            Alert.alert("해당 게시물에 대해 신고할 수 없습니다.");
        } else {
            await put_user_comment_report(comment_id);
            await reportCommentAram();
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

    const get_user_comment_report = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/getusercommentreport`, {
                method: 'GET', // GET 요청으로 수정
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUsercommentReport(data);
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

    const comment_Like_alert = (comment_id: any, user_pk: any) => {
        Alert.alert(
            "댓글 좋아요!!",
            "댓글에 좋아요를 누르시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        await comment_like_num_up(comment_id);
                        await put_user_comment_like(comment_id);
                        await addCommentLikeAram(comment_id, user_pk);
                        await CommentList();
                    }
                }
            ]
        );
    };

    const Comment_Cancel_Like_alert = (comment_id: any, user_pk: any) => {
        Alert.alert(
            "댓글 좋아요 취소!!",
            "댓글 좋아요를 취소하시겠습니까??",
            [
                {
                    text: "취소",
                    onPress: async () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        await comment_like_num_down(comment_id);
                        await cancel_comment_like(comment_id);
                        await CommentList();
                    }
                }
            ]
        );
    };


    const recomment_Like_alert = (recomment_id: any, user_pk: any) => {
        Alert.alert(
            "대댓글 좋아요!!",
            "대댓글에 좋아요를 누르시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        await recomment_like_num_up(recomment_id);
                        await put_user_recomment_like(recomment_id);
                        await addRecommentLikeAram(recomment_id, user_pk);
                        await CommentList();

                    }
                }
            ]
        );
    };

    const recomment_Like_Cancel_alert = (recomment_id: any, user_pk: any) => {
        Alert.alert(
            "대댓글 좋아요 취소!!",
            "대댓글에 좋아요를 취소하시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭"),
                    style: "cancel"
                },
                {
                    text: "확인", onPress: async () => {
                        await recomment_like_num_down(recomment_id);
                        await cancel_recomment_like(recomment_id);
                        await CommentList();
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

    const NoyourCommentAlert = (comment_id: any) => {
        Alert.alert(
            "댓글 수정 불가",
            "본인이 작성한 댓글만 수정 할 수 있습니다.",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "확인", onPress: () => { toggleOptions2(comment_id); } }
            ],
        );
    };

    const NoyourreCommentAlert = (recomment_id: any) => {
        Alert.alert(
            "대댓글 수정 불가",
            "본인이 작성한 대댓글만 수정 할 수 있습니다.",
            [
                {
                    text: "취소",
                    style: "cancel"
                },
                { text: "확인", onPress: () => { toggleOptions2(recomment_id); } }
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
    /*
    const loadCommentsWithRecomments = async () => {
        try {
          const commentsWithRecomments = await Promise.all(
            commentData.map(async (comment) => {
              const recommentData = await fetchRecommentData(comment.comment_id);
              console.log(recommentData);
              return { ...comment, recomments: recommentData };
            })
          );
          console.log(commentsWithRecomments);
          return commentsWithRecomments;

        } catch (error) {
          console.error('Failed to load recomment data:', error);
        }
      };
      */

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

    const writeComment = async () => {
        if (IsCommentorRecomment == 0 && IsEditComment == 0) { //댓글작성
            await writecomment();
            await addCommentAram();

        } else if (IsCommentorRecomment == 1 && IsEditComment == 0) { //대댓글 작성
            await writerecomment();
            await addCommentAram();

        } else if (IsCommentorRecomment == 0 && IsEditComment == 1) { //댓글 수정
            EditCommentAlert();
        } else if (IsCommentorRecomment == 1 && IsEditComment == 1) { //대댓글 수정
            EditreCommentAlert();
        }
        setcommenttext('');
        Keyboard.dismiss();
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
                await get_user_comment_report();
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: 15 }}></View>
                <View style={styles.headersection}>
                    <View style={styles.headercontainer}>
                        <View style={styles.profilepicturecontainer}>
                            <View style={styles.profilepicturebox}>
                                <Image
                                    source={{ uri: `${config.photoUrl}/${postDetailInfo?.writer_propile}` }}
                                    style={{ width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                />
                            </View>
                        </View>
                        <View style={styles.profileinfocontainer}>
                            <View style={{ flex: 0.6, justifyContent: 'center', }}>
                                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold', marginTop: 13, }}>{postDetailInfo?.post_writer}({postDetailInfo?.writer_department})</Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', marginBottom: 9, }}>
                                <Text style={{ fontSize: 17, color: 'black' }}>{formattedDate}</Text>
                            </View>
                        </View>
                        <View style={styles.listcontainer}>
                            <TouchableOpacity onPress={toggleOptions} >
                                <IconA size={35} color="black" name={"dots-three-vertical"} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: 'black', marginLeft: 20, marginRight: 20, marginTop: 10 }}></View>
                {showOptions && (
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity onPress={async () => {
                            if (userdata.user_pk === postDetailInfo?.user_id) {
                                const post_edit_info = await get_post_info();
                                navigation.navigate("EditPostScreen", { userdata, post_edit_info })
                            } else {
                                NoyourPostAlert();
                                toggleOptions();
                            }
                        }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>수정</Text>
                        </TouchableOpacity>
                        <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 10, marginBottom: 10 }}></View>
                        <TouchableOpacity
                            onPress={() => {
                                if (userdata.user_pk === postDetailInfo?.user_id) {
                                    Alert.alert("본인은 신고할 수 없습니다.");
                                } else {
                                    //포스트 신고
                                    ReportUserduplicate();
                                }
                            }}>
                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>신고</Text>
                        </TouchableOpacity>
                        {(userdata?.title === "학교" || postDetailInfo?.post_writer === userdata?.name) && (
                            <>
                                <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 10, marginBottom: 10 }}></View>
                                <TouchableOpacity onPress={deletePost}>
                                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>삭제</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                )}
                <View style={styles.titlecontainer}>
                    <Text style={{ fontSize: 20, marginLeft: 16, color: 'black', fontWeight: 'bold' }}>
                        {postDetailInfo?.title}
                    </Text>
                </View>
                <Text style={{ fontSize: 18, color: 'black', marginLeft: 26, marginRight: 30, }}>
                    {postDetailInfo?.contents}
                </Text>
                <View style={styles.postslikeandlook}>
                    <TouchableOpacity onPress={async () => {
                        const is_post_like: boolean = await is_user_post_like();
                        if (is_post_like) {
                            Post_Like_alert(postDetailInfo?.post_id)
                        } else {
                            Post_Cancel_Like_alert(postDetailInfo?.post_id)
                        }
                    }

                    }>
                        <Text style={{ color: 'black', marginLeft: 10, marginTop: 6 }}> <IconB name="like1" size={24} /></Text>
                    </TouchableOpacity>
                    <Text style={{ color: 'black', fontSize: 20, marginTop: 7, }}> {postDetailInfo?.like}</Text>
                    <Text style={{ color: 'black', marginTop: 9, marginLeft: 5 }}><IconB name="eyeo" size={24} /></Text>
                    <Text style={{ color: 'black', fontSize: 20, marginLeft: 3, marginTop: 7, }}>{postDetailInfo?.view}</Text>
                </View>
                {
                    comments.map(item => (
                        <View key={item.comment_id} style={styles.comentcontainer}>
                            <View style={styles.comentTopsection}>
                                <View style={styles.infobox}>
                                    <View style={styles.picturebox}>
                                        <View style={styles.picture}>
                                            <Image
                                                source={{ uri: `${config.photoUrl}/${item?.user_profile}` }}
                                                style={{ width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.infotextbox}>
                                        <Text style={{ fontSize: 17, color: 'black', fontWeight: "bold", }}>{item.student_name}</Text>
                                        <Text style={{ fontSize: 15, color: 'black' }}>{item.department_name}</Text>
                                    </View>
                                </View>
                                <View style={styles.listbox}>
                                    <View style={styles.ComentLikeListBox}>
                                        <TouchableOpacity
                                            style={styles.comentbox}
                                            onPress={() => {
                                                setIsCommentorRecomment(1);
                                                setCommentspk(item.comment_id);
                                                onFocusName();
                                            }}>
                                            <Text><IconD size={27} color="black" name={"comment"} /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.likebox}
                                            onPress={async () => {
                                                const is_comment_like: boolean = await is_user_comment_like(item.comment_id);
                                                if (is_comment_like) {
                                                    comment_Like_alert(item.comment_id, item.user_id);
                                                } else {
                                                    Comment_Cancel_Like_alert(item.comment_id, item.user_id);
                                                }

                                            }}>
                                            <Text><IconD size={29} color="black" name={"like"} /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.reallistbox}>
                                            <Text><IconA size={19} color="black" name={"dots-three-vertical"} onPress={() => toggleOptions2(item.comment_id)} /></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                {activeCommentId === item.comment_id && (
                                    <View style={styles.optionsContainer2}>
                                        <TouchableOpacity onPress={() => {
                                            if (userdata.user_pk == item.user_id) {
                                                setIsEditComment(1);
                                                toggleOptions2(item.comment_id);
                                                setEditcommentpk(item.comment_id);
                                                onFocusEditComment(item);
                                            } else {
                                                NoyourCommentAlert(item.comment_id);
                                            }
                                        }}>
                                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>수정</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 5, marginBottom: 5 }}></View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (userdata.user_pk === item.user_id) {
                                                    Alert.alert("본인은 신고할 수 없습니다.");
                                                } else {
                                                    //댓글
                                                    ReportUserduplicate2(item.comment_id);
                                                }
                                            }}>
                                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>신고</Text>
                                        </TouchableOpacity>
                                        {(userdata?.title === "학교" || item.student_name === userdata?.name) && (
                                            <>
                                                <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 10, marginBottom: 10 }}></View>
                                                <TouchableOpacity onPress={async () =>
                                                    await deleteComment(item.comment_id)}
                                                >
                                                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>삭제</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}
                                    </View>
                                )}
                            </View>
                            <Text style={{ fontSize: 19, color: 'black', marginLeft: 24, marginRight: 20, }}>
                                {item.content}
                            </Text>
                            <View style={styles.dataandlike}>
                                <Text style={{ marginTop: 3, marginLeft: 24, fontSize: 15, color: 'black' }}>
                                    {item.date}
                                </Text>
                                <Text style={{ marginTop: 2, }}><IconD size={27} color="black" name={"like"} /></Text>
                                <Text style={{ fontSize: 15, marginTop: 2, color: 'black' }}>
                                    {item.like}
                                </Text>
                            </View>
                            {item.recomments.map(subitem => (
                                <View key={subitem.recomment_id} style={styles.subcommentbox}>
                                    <View style={styles.enterspace}>
                                        <Text style={{ color: 'black' }}> <IconC name="corner-down-right" size={30} /></Text>
                                    </View>
                                    <View style={styles.maincontent}>
                                        <View style={styles.comentTopsection}>
                                            <View style={styles.infobox2}>
                                                <View style={styles.picturebox}>
                                                    <View style={styles.picture}>
                                                        <Image
                                                            source={{ uri: `${config.photoUrl}/${subitem?.user_profile}` }}
                                                            style={{ width: 40, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}
                                                        />
                                                    </View>
                                                </View>
                                                <View style={styles.infotextbox}>
                                                    <Text style={{ fontSize: 17, color: 'black', marginLeft: 5, fontWeight: 'bold' }}>{subitem.student_name}</Text>
                                                    <Text style={{ fontSize: 15, color: 'black', marginLeft: 5 }}>{subitem.department_name}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.listbox2}>
                                                <View style={styles.LikeListBox2}>
                                                    <TouchableOpacity
                                                        style={styles.likebox2}
                                                        onPress={async () => {
                                                            const is_recomment_like: boolean = await is_user_recomment_like(subitem.recomment_id);
                                                            if (is_recomment_like) {
                                                                recomment_Like_alert(subitem.recomment_id, subitem.user_id)
                                                            } else {
                                                                recomment_Like_Cancel_alert(subitem.recomment_id, subitem.user_id)
                                                            }
                                                        }}>
                                                        <Text><IconD size={29} color="black" name={"like"} /></Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.reallistbox2}>
                                                        <IconA size={19} color="black" name={"dots-three-vertical"} onPress={() => toggleOptions2(subitem.recomment_id)} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        {activeCommentId === subitem.recomment_id && (
                                            <View style={styles.optionsContainer3}>
                                                <TouchableOpacity onPress={() => {
                                                    if (userdata.user_pk == subitem.user_id) {
                                                        setIsEditComment(1);
                                                        toggleOptions2(subitem.recomment_id);
                                                        setIsCommentorRecomment(1);
                                                        setEditrecommentpk(subitem.recomment_id);
                                                        onFocusEditReComment(subitem);
                                                    } else {
                                                        NoyourreCommentAlert(subitem.recomment_id);
                                                    }
                                                }}>
                                                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>수정</Text>
                                                </TouchableOpacity>
                                                <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 10, marginBottom: 10 }}></View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        if (userdata.user_pk === item.user_id) {
                                                            Alert.alert("본인은 신고할 수 없습니다.");
                                                        } else {
                                                            //댓글신고
                                                            ReportUserduplicate2(item.comment_id);
                                                        }
                                                    }}>
                                                    <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>신고</Text>
                                                </TouchableOpacity>
                                                {(userdata?.title === "학교" || subitem.student_name === userdata?.name) && (
                                                    <>
                                                        <View style={{ width: 100, height: 0.4, backgroundColor: 'black', marginRight: 20, marginTop: 10, marginBottom: 10 }}></View>
                                                        <TouchableOpacity onPress={async () => deleterecomment(subitem.recomment_id)}>
                                                            <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", paddingLeft: 10 }}>삭제</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                )}
                                            </View>
                                        )}
                                        <Text style={{ fontSize: 19, color: 'black', marginLeft: 20, marginRight: 20, }}>
                                            {subitem.content}
                                        </Text>
                                        <View style={styles.dataandlike}>
                                            <Text style={{ marginTop: 3, marginLeft: 20, fontSize: 15, color: 'black' }}>
                                                {subitem.date}
                                            </Text>
                                            <Text style={{ marginTop: 2 }}><IconD size={30} color="black" name={"like"} /></Text>
                                            <Text style={{ fontSize: 15, marginTop: 2, color: 'black' }}>
                                                {subitem.like}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                    ))}
            </ScrollView>
            <View style={styles.commentbox}>
                <View style={[styles.inputtext, { height: inputheight }]}>
                    <TextInput
                        ref={inputRef}
                        style={{ paddingLeft: 20, fontSize: 20, color: 'black' }}
                        onChangeText={handleInputChange}
                        onBlur={() => {
                            setIsCommentorRecomment(0);
                            setIsEditComment(0);
                        }}
                        onContentSizeChange={handleContentSizeChange}
                        value={commenttext}
                        multiline={true}
                        placeholder="댓글을 입력하세요."
                        placeholderTextColor={'gray'}
                    />
                </View>
                <TouchableOpacity
                    onPress={async () => {
                        await writeComment();
                    }}
                    style={styles.sendspace}>
                    <Text style={{ color: '#F29F05', justifyContent: 'flex-end' }}> <IconC name="send" size={34} /></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : "white",
    },
    headersection: {
        height: 75,
        //backgroundColor: 'blue'
    },
    headercontainer: {
        width: '90%',
        alignSelf: 'center',
        //backgroundColor : 'red',
        flexDirection: 'row',
    },
    profilepicturecontainer: {
        height: 75,
        width: '20%',
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',

    },
    profileinfocontainer: {
        height: 75,
        //backgroundColor : 'red',
        width: '70%',

    },
    listcontainer: {
        height: 75,
        //backgroundColor : 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilepicturebox: {
        width: 60,
        height: 60,
        backgroundColor: '#CED4DA',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,

    },
    titlecontainer: {
        minHeight: 50,
        //backgroundColor : 'red',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    postslikeandlook: {
        height: 40,
        //backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginHorizontal: 10,
    },
    writecommentcontainer: {
        height: 60,
        //backgroundColor: 'yellow',
        //justifyContent : 'center',
        //alignItems : 'center'
    },
    commentbox: {
        backgroundColor: '#D9D9D9',
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row',
    },
    inputtext: {
        width: '88%',
        //backgroundColor: 'red',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    sendspace: {
        width: 45,
        height: 45,
        //backgroundColor: 'blue',
        borderRadius: 10,
        justifyContent: 'center',
        marginRight: 20,
        //alignItems : 'center',
        //alignSelf: 'flex-end'
    },
    comentcontainer: {
        minHeight: 120,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        borderRadius: 20,
        //backgroundColor: 'green'
    },
    comentTopsection: {
        height: 65,
        //backgroundColor: 'red',
        flexDirection: 'row',
    },
    listbox: {
        flex: 0.3,
        //backgroundColor : 'yellow'
    },
    infobox: {
        flex: 0.7,
        //backgroundColor : "red",
        flexDirection: 'row',
    },
    picturebox: {
        flex: 0.25,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
    },
    infotextbox: {
        flex: 0.75,
        //backgroundColor : 'green',
        justifyContent: 'center'
    },
    picture: {
        width: 40,
        height: 40,
        backgroundColor: '#CED4DA',
        borderRadius: 8,
        marginLeft: 10,
    },
    comentBottomsection: {
        height: 85,
        //backgroundColor: 'blue'
    },
    ComentLikeListBox: {
        width: 109,
        height: 29,
        borderRadius: 8,
        backgroundColor: '#CED4DA',
        marginTop: 7,
        flexDirection: 'row',
        elevation: 5,
    },
    comentbox: {
        width: 36,
        //backgroundColor : 'red',
        marginTop: 3,
        justifyContent: 'center',
        alignItems: 'center'

    },
    likebox: {
        width: 36,
        //backgroundColor : 'yellow',
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        marginTop: 3,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reallistbox: {
        width: 36,
        marginTop: 5,
        //backgroundColor : 'blue'
        justifyContent: 'center',
        alignItems: 'center'
    },
    dataandlike: {
        height: 30,
        //backgroundColor : 'yellow',
        flexDirection: 'row'
    },
    subcommentbox: {
        //backgroundColor: 'yellow',
        marginBottom: 10,
        flexDirection: 'row'
    },
    enterspace: {
        flex: 0.1,
        alignSelf: 'flex-start',
        //backgroundColor: 'blue',
        marginTop: 10,
        marginLeft: 10,
    },
    maincontent: {
        flex: 0.9,
        //backgroundColor: 'red'
    },
    LikeListBox2: {
        width: 74,
        height: 29,
        borderRadius: 8,
        marginTop: 7,
        flexDirection: 'row',
        backgroundColor: '#CED4DA',
    },
    likebox2: {
        width: 37,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 2,
    },
    reallistbox2: {
        width: 37,
        //backgroundColor : 'blue'
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5,
        borderColor: '#333',
        marginTop: 4,
    },
    listbox2: {
        flex: 0.25,
        //\\backgroundColor : 'yellow'
    },
    infobox2: {
        flex: 0.75,
        //backgroundColor : "red",
        flexDirection: 'row',
    },

    optionsContainer: {
        position: 'absolute',
        top: 80,
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

    optionsContainer2: {
        position: 'absolute',
        top: 45,
        right: 30,
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
        zIndex: 1000,
    },
    optionsContainer3: {
        position: 'absolute',
        top: 45,
        right: 30,
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

})

export default PostDetailScreen;