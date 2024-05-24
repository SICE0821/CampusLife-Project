import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import IconD from 'react-native-vector-icons/EvilIcons';
import IconC from 'react-native-vector-icons/Feather';
import { useFocusEffect } from '@react-navigation/native';
import { PostDeatilData, PostCommentData } from "../../types/type"

type SubItem = {
    id: number;
    text: string;
}

type Item = {
    id: number;
    subItems: SubItem[];
}

const PostDetailScreen: React.FC = ({ route }: any) => {
    const { item, userData } = route.params; //유저 정보와, 커뮤니티정보
    const [commenttext, setcommenttext] = useState('댓글을 입력해주세요');
    const [inputheight, setinputheight] = useState(40);
    const [postDetailInfo, setPostDetailInfo] = useState<PostDeatilData>();
    const [commentData, setCommentData] = useState<PostCommentData[]>([]);
    const [data, setData] = useState<Item[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            //console.log(item.post_id);
            DeatilPost();
            CommentList();
        }, [])
    );

    //포스터에 대한 정보
    const DeatilPost = async () => {
        try {
            const response = await fetch('http://172.16.108.18:3000/get_post_detail', {
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
            const response = await fetch('http://172.16.108.18:3000/get_comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_ida: item.post_id
                })
            })
            const get_comment = await response.json();
            setCommentData(get_comment);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
        }
    }

    //댓글 리스트 가져오기
    const reCommentList = async () => {
        try {
            const response = await fetch('http://172.16.108.18:3000/get_recomment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_ida: item.post_id
                })
            })
            const get_recomment = await response.json();
            setCommentData(get_recomment);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
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

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{ height: 15 }}></View>
                <View style={styles.headersection}>
                    <View style={styles.headercontainer}>
                        <View style={styles.profilepicturecontainer}>
                            <View style={styles.profilepicturebox}>
                            </View>
                        </View>
                        <View style={styles.profileinfocontainer}>
                            <View style={{ flex: 0.6, justifyContent: 'center', }}>
                                <Text style={{ fontSize: 20, color: 'black', fontWeight: 'bold', marginTop: 13, }}>{postDetailInfo?.post_writer}({postDetailInfo?.writer_department})</Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', marginBottom: 9, }}>
                                <Text style={{ fontSize: 17, }}>{postDetailInfo?.write_date}</Text>
                            </View>
                        </View>
                        <View style={styles.listcontainer}>
                            <Text><IconA size={35} color="black" name={"dots-three-vertical"} /></Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: 'black', marginLeft: 20, marginRight: 20, marginTop: 10 }}></View>
                <View style={styles.titlecontainer}>
                    <Text style={{ fontSize: 25, marginLeft: 16, color: 'black', fontWeight: 'bold' }}>
                        {postDetailInfo?.title}
                    </Text>
                </View>
                <Text style={{ fontSize: 20, color: 'black', marginLeft: 16, marginRight: 20, }}>
                    {postDetailInfo?.contents}
                </Text>
                <View style={styles.postslikeandlook}>
                    <Text style={{ color: 'black', marginLeft: 10, marginTop: 6 }}> <IconB name="like1" size={24} /></Text>
                    <Text style={{ color: 'black', fontSize: 20, marginTop: 7, }}> {postDetailInfo?.view}</Text>
                    <Text style={{ color: 'black', marginTop: 9, marginLeft: 5 }}><IconB name="eyeo" size={24} /></Text>
                    <Text style={{ color: 'black', fontSize: 20, marginLeft: 3, marginTop: 7, }}> {postDetailInfo?.like} </Text>
                </View>
                {
                
                commentData.map(item => (
                    <View key={item.comment_id} style={styles.comentcontainer}>
                        <View style={styles.comentTopsection}>
                            <View style={styles.infobox}>
                                <View style={styles.picturebox}>
                                    <View style={styles.picture}>
                                    </View>
                                </View>
                                <View style={styles.infotextbox}>
                                    <Text style={{ fontSize: 24, color: 'black' }}>{item.student_name}</Text>
                                    <Text style={{ fontSize: 17, color: 'black' }}>{item.department_name}</Text>
                                </View>
                            </View>
                            <View style={styles.listbox}>
                                <View style={styles.ComentLikeListBox}>
                                    <View style={styles.comentbox}>
                                        <Text><IconD size={27} color="black" name={"comment"} /></Text>
                                    </View>
                                    <View style={styles.likebox}>
                                        <Text><IconD size={29} color="black" name={"like"} /></Text>
                                    </View>
                                    <View style={styles.reallistbox}>
                                        <Text><IconA size={19} color="black" name={"dots-three-vertical"} /></Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <Text style={{ fontSize: 20, color: 'black', marginLeft: 20, marginRight: 20, }}>
                            {item.content}
                        </Text>
                        <View style={styles.dataandlike}>
                            <Text style={{ marginTop: 3, marginLeft: 20, fontSize: 18 }}>
                                {item.date}
                            </Text>
                            <Text style={{ marginTop: 2 }}><IconD size={34} color="black" name={"like"} /></Text>
                            <Text style={{ fontSize: 19, marginTop: 2, }}>
                                {item.like}
                            </Text>
                        </View>
                        {commentData.map(subItem => (
                            <View key={subItem.comment_id} style={styles.subcommentbox}>
                                <View style={styles.enterspace}>
                                    <Text style={{ color: 'black' }}> <IconC name="corner-down-right" size={30} /></Text>
                                </View>
                                <View style={styles.maincontent}>
                                    <View style={styles.comentTopsection}>
                                        <View style={styles.infobox2}>
                                            <View style={styles.picturebox}>
                                                <View style={styles.picture}>
                                                </View>
                                            </View>
                                            <View style={styles.infotextbox}>
                                                <Text style={{ fontSize: 20, color: 'black', marginLeft: 5 }}>엄준식</Text>
                                                <Text style={{ fontSize: 13, color: 'black', marginLeft: 5 }}>컴퓨터소프트웨어과</Text>
                                            </View>
                                        </View>
                                        <View style={styles.listbox2}>
                                            <View style={styles.LikeListBox2}>
                                                <View style={styles.likebox2}>
                                                    <Text><IconD size={29} color="black" name={"like"} /></Text>
                                                </View>
                                                <View style={styles.reallistbox2}>
                                                    <Text><IconA size={19} color="black" name={"dots-three-vertical"} /></Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={{ fontSize: 20, color: 'black', marginLeft: 20, marginRight: 20, }}>
                                        에브리바디 해체!
                                    </Text>
                                    <View style={styles.dataandlike}>
                                        <Text style={{ marginTop: 3, marginLeft: 20, fontSize: 18 }}>
                                            01/26 25:00
                                        </Text>
                                        <Text style={{ marginTop: 2 }}><IconD size={30} color="black" name={"like"} /></Text>
                                        <Text style={{ fontSize: 19, marginTop: 2, }}>
                                            30
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
                        style={{ paddingLeft: 20, fontSize: 20, }}
                        onChangeText={handleInputChange}
                        onContentSizeChange={handleContentSizeChange}
                        value={commenttext}
                        multiline={true}
                        placeholder="텍스트를 입력하세요"
                    />
                </View>
                <View style={styles.sendbutton}>
                    <Text style={{ color: '#F29F05' }}> <IconC name="send" size={34} /></Text>
                </View>
            </View>
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
        borderRadius: 12,

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
        flex: 0.85,
        //backgroundColor: 'red',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    sendbutton: {
        flex: 0.15,
        //backgroundColor: 'blue',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
        alignSelf: 'flex-end'
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
        width: 54,
        height: 54,
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
        flexDirection: 'row'
    },
    comentbox: {
        flex: 1 / 3,
        //backgroundColor : 'red'
        justifyContent: 'center',
        alignItems: 'center'
    },
    likebox: {
        flex: 1 / 3,
        //backgroundColor : 'yellow',
        borderLeftWidth: 0.5,
        borderRightWidth: 0.5,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reallistbox: {
        flex: 1 / 3,
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
        flex: 0.5,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    reallistbox2: {
        flex: 0.5,
        //backgroundColor : 'blue'
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 0.5,
        borderColor: '#333',
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