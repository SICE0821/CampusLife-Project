import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/Feather';

const PostDetailScreen: React.FC = () => {
    const [commenttext, setcommenttext] = useState('댓글을 입력해주세요');
    const [inputheight, setinputheight] = useState(40);

    const handleContentSizeChange = (e: any) => {
        const maxlineHeight = 112;
        const currentlineHeight = e.nativeEvent.contentSize.height;

        if (currentlineHeight <= maxlineHeight) {
            setinputheight(e.nativeEvent.contentSize.height);
        }
        console.log(e.nativeEvent.contentSize.height);
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
                                <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold', marginTop: 13, }}>정유환(컴퓨터소프트웨어과)</Text>
                            </View>
                            <View style={{ flex: 0.4, justifyContent: 'center', marginBottom: 10, }}>
                                <Text style={{ fontSize: 13, }}>01/26 25:00</Text>
                            </View>
                        </View>
                        <View style={styles.listcontainer}>
                            <Text><IconA size={35} color="black" name={"dots-three-vertical"} /></Text>
                        </View>
                    </View>
                </View>
                <View style={{ height: 0.5, backgroundColor: 'black', marginLeft: 20, marginRight: 20, marginTop: 10 }}></View>
                <View style={styles.titlecontainer}>
                    <Text style={{ fontSize: 25, marginLeft: 20, color: 'black' }}>
                        집가고싶어요
                    </Text>
                </View>
                <Text style={{ fontSize: 16, color: 'black', marginLeft: 20, marginRight: 20, }}>
                    에브리바디 해체! 추억에 지우개를?! 어랏 텐션이 올라? 폐가 돼? 네, 라고는 말할 수 없어!
                    잘 보이는 세상 과자는 사라져버려?! 어쩌지 "어떻게?!"도 "이렇게 해!"도 너답지 않네? 그런 시대라도 좋아
                    우린 아직 원더를 믿고 있는,걸 노 No? know! 어른들의 예리한 눈금 너무 시달려버려서 눈이 한쪽으로 치우쳐질 것 같아!
                    "어떻게?!" "이렇게 해!"도 전부 정말 좋아!가 좋잖아!! 모두 모두가 웃어버릴 만한 속셈으로 숙적, 역경, 몬스터 불러도
                    되잖아?! 엉뚱하고도 최강인 세상을 아무리 해도 구할 수 없는 곤란함도 좋잖아! 모두 모두 구해버리자! 라는 포즈로 조금이나
                    잠깐으론 구겨지지 않는 미소 어때! 100번 실패해도 신비함은 흐트러지지 않아 원원에 둘이 통해 쓰리 포 에브리바디 쇼타임!

                </Text>
                <View style={styles.postslikeandlook}>
                    <Text style={{ color: 'black', marginLeft: 16, marginTop : 6}}> <IconB name="like1" size={20} /></Text>
                    <Text style={{ color: 'black', fontSize: 16, marginTop: 7, }}> 15 </Text>
                    <Text style={{ color: 'black', marginTop: 9, marginLeft: 5 }}> <IconB name="eyeo" size={20} /></Text>
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 3, marginTop: 7, }}>60</Text>
                </View>
            </ScrollView>
            <View style={styles.commentbox}>
                    <View style={[styles.inputtext, { height: inputheight }]}>
                        <TextInput
                            style={{ paddingLeft: 20, fontSize: 16, }}
                            onChangeText={handleInputChange}
                            onContentSizeChange={handleContentSizeChange}
                            value={commenttext}
                            multiline={true}
                            placeholder="텍스트를 입력하세요"
                        />
                    </View>
                    <View style={styles.sendbutton}>
                        <Text style={{ color: '#F29F05' }}> <IconC name="send" size={30} /></Text>
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
        flex: 0.25,
        //backgroundColor : 'yellow',
        justifyContent: 'center',
        alignItems: 'center',

    },
    profileinfocontainer: {
        flex: 0.55,
        //backgroundColor : 'red'
    },
    listcontainer: {
        flex: 0.2,
        //backgroundColor : 'blue',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profilepicturebox: {
        width: 55,
        height: 55,
        backgroundColor: '#CED4DA',
        borderRadius: 12,
    },
    maintextcontainer: {
        flex: 0.45,
        backgroundColor: 'blue',
    },
    titlecontainer: {
        height: 45,
        //backgroundColor : 'red',
        justifyContent: 'center',
    },
    postslikeandlook: {
        height: 30,
        backgroundColor : 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
    },
    writecommentcontainer: {
        height: 60,
        backgroundColor: 'yellow',
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
    }
})

export default PostDetailScreen;