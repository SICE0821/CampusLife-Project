import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import IconA from 'react-native-vector-icons/Entypo';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/Feather';

const PostDetailScreen: React.FC = () => {
    const [commenttext, setcommenttext] = useState('댓글을 입력해주세요');
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
                    ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
                    ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
                    ㅇㅇㅇㅇㅇ
                </Text>
                <View style={styles.postslikeandlook}>
                    <Text style={{ color: 'black', marginLeft: 16, }}> <IconB name="like1" size={30} /></Text>
                    <Text style={{ color: 'black', fontSize: 16, marginTop: 7, }}> 15 </Text>
                    <Text style={{ color: 'black', marginTop: 7, marginLeft: 5 }}> <IconB name="eyeo" size={38} /></Text>
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 3, marginTop: 7, }}>60</Text>
                </View>
                <View style={styles.writecommentcontainer}>
                    <View style={styles.commentbox}>
                        <View style={styles.inputtext}>
                            <TextInput
                                style={{ flex: 1, backgroundColor : 'red', paddingLeft: 20, }}
                                onChangeText={handleInputChange}
                                value={commenttext}
                                multiline={true}
                                placeholder="텍스트를 입력하세요"
                            />
                        </View>
                        <View style={styles.sendtext}>
                            <Text style={{ color: '#F29F05'}}> <IconC name="send" size={30} /></Text>
                        </View>
                    </View>
                </View>
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
        height: 45,
        //backgroundColor : 'yellow',
        flexDirection: 'row',
        alignItems: 'center',
    },
    writecommentcontainer: {
        height: 70,
        // backgroundColor: 'yellow',
        //justifyContent : 'center',
        //alignItems : 'center'
    },
    commentbox: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        margin: 10,
        borderRadius: 10,
        flexDirection: 'row'
    },
    inputtext: {
        flex: 0.85,
        //backgroundColor: 'red',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    sendtext: {
        flex: 0.15,
        //backgroundColor: 'blue',
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent : 'center',
        alignItems : 'center'
    }
})

export default PostDetailScreen;