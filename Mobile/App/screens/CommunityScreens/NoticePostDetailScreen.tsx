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


const PostDetailScreen: React.FC = ({ route }: any) => {
    const { item, userData } = route.params;
    const [commenttext, setcommenttext] = useState('댓글을 입력해주세요');
    const [inputheight, setinputheight] = useState(40);
    const [postDetailInfo, setPostDetailInfo] = useState<PostDeatilData>(); //포스터에 대한 정보.
    const [commentData, setCommentData] = useState<PostCommentData[]>([]);
    const [userdata, setUserData] = useState<UserData>(userData);
    const [comments, setComments] = useState<CommentsWithRecomments[]>([]);
    const [IsCommentorRecomment, setIsCommentorRecomment] = useState(0);
    const [commentspk, setCommentspk]: any = useState();
    const inputRef = useRef<TextInput>(null);

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    await DeatilPost();
                    setUserData(userdata);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, [])
    );

    //포스터에 대한 정보
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
            //console.log(get_post_detail.post_id);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
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
                    post_id: post_id
                })
            })
            const result = await response.json();
            await DeatilPost();
            //console.log("포스트 좋아요 누르기 성공!")
        } catch (error) {
            console.error('포스트 좋아요 누르기 실패', error);
        }
    }



    const Post_Like_alert = (post_id: any) => {
        Alert.alert(
            "좋아요!!",
            "좋아요를 누르시겠습니까?",
            [
                {
                    text: "취소",
                    onPress: () => console.log("취소 클릭"),
                    style: "cancel"
                },
                { text: "확인", onPress: async () => await like_num_up(post_id) }
            ]
        );
    };




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

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: 15 }}></View>
                <View style={styles.headersection}>
                    <View style={styles.headercontainer}>
                        <View style={styles.profilepicturecontainer}>
                            <View style={styles.profilepicturebox}>
                                <Image
                                    source={{ uri: `${config.photoUrl}/${postDetailInfo?.writer_propile}.png` }}
                                    style={{ width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                                />
                            </View>
                        </View>
                        <View style={styles.profileinfocontainer}>
                            <View style={{ flex: 0.6, justifyContent: 'center', }}>
                                <Text style={{ fontSize: 17, color: 'black', fontWeight: 'bold', marginTop: 13, }}>{postDetailInfo?.post_writer}({postDetailInfo?.writer_department})</Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', marginBottom: 9, }}>
                                <Text style={{ fontSize: 17, color: 'black' }}>{postDetailInfo?.write_date}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.listcontainer} onPress = {() => console.log("공지사항 리스트 기능 x")}>
                            <Text><IconA size={35} color="black" name={"dots-three-vertical"} /></Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: 'black', marginLeft: 20, marginRight: 20, marginTop: 10 }}></View>
                <View style={styles.titlecontainer}>
                    <Text style={{ fontSize: 20, marginLeft: 16, color: 'black', fontWeight: 'bold' }}>
                        {postDetailInfo?.title}
                    </Text>
                </View>
                <Text style={{ fontSize: 18, color: 'black', marginLeft: 16, marginRight: 20, }}>
                    {postDetailInfo?.contents}
                </Text>
                <View style={styles.postslikeandlook}>
                    <TouchableOpacity onPress={() => Post_Like_alert(postDetailInfo?.post_id)}>
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
                                                source={{ uri: `http://10.0.2.2:3000/${item?.user_profile}.png` }}
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
                                            }}>
                                            <Text><IconD size={27} color="black" name={"comment"} /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.likebox}
                                           >
                                            <Text><IconD size={29} color="black" name={"like"} /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.reallistbox}>
                                            <Text><IconA size={19} color="black" name={"dots-three-vertical"} /></Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <Text style={{ fontSize: 19, color: 'black', marginLeft: 24, marginRight: 20, }}>
                                {item.content}
                            </Text>
                            <View style={styles.dataandlike}>
                                <Text style={{ marginTop: 3, marginLeft: 24, fontSize: 15 }}>
                                    {item.date}
                                </Text>
                                <Text style={{ marginTop: 2 }}><IconD size={27} color="black" name={"like"} /></Text>
                                <Text style={{ fontSize: 15, marginTop: 2, }}>
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
                                                            source={{ uri: `http://10.0.2.2:3000/${item?.user_profile}` }}
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
                                                        >
                                                        <Text><IconD size={29} color="black" name={"like"} /></Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.reallistbox2}>
                                                        <Text><IconA size={19} color="black" name={"dots-three-vertical"} /></Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                        <Text style={{ fontSize: 19, color: 'black', marginLeft: 20, marginRight: 20, }}>
                                            {subitem.content}
                                        </Text>
                                        <View style={styles.dataandlike}>
                                            <Text style={{ marginTop: 3, marginLeft: 20, fontSize: 15 }}>
                                                {subitem.date}
                                            </Text>
                                            <Text style={{ marginTop: 2 }}><IconD size={30} color="black" name={"like"} /></Text>
                                            <Text style={{ fontSize: 15, marginTop: 2, }}>
                                                {subitem.like}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>

                    ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor : "red",
    },
    headersection: {
        height: 75,
        //backgroundColor: 'blue'
    },
    headercontainer: {
        flex: 1,
        //backgroundColor : 'red',
        flexDirection: 'row',

    },
    profilepicturecontainer: {
        height: 75,
        width: 100,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',

    },
    profileinfocontainer: {
        height: 75,
        //backgroundColor : 'red',
        width: 330,

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
    maintextcontainer: {
        flex: 0.45,
        backgroundColor: 'blue',
    },
    titlecontainer: {
        height: 50,
        //backgroundColor : 'red',
        justifyContent: 'center',
    },
    postslikeandlook: {
        height: 40,
        //backgroundColor: 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
        width: 410,
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
        //height: 150,
        marginBottom: 10,
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
        width : 37,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop : 2,
    },
    reallistbox2: {
        width : 37,
        //backgroundColor : 'blue'
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5,
        borderColor: '#333',
        marginTop : 4,
    },
    listbox2: {
        flex: 0.25,
        //backgroundColor : 'yellow'
    },
    infobox2: {
        flex: 0.75,
        //backgroundColor : "red",
        flexDirection: 'row',
    },
})

export default PostDetailScreen;