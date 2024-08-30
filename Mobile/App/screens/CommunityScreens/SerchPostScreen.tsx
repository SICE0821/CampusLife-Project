import React, { useState } from 'react';
import { useFocusEffect} from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconD from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import config from '../../config';

type PostData = {
    post_id: number,
    title: string,
    contents: string,
    date: string,
    view: number,
    like: number,
    name: string,
    user_title : string,
}

const SearchPostScreen: React.FC = ({ route, navigation }: any) => {
    console.log("you are in SearchPostScreen")
    const {  userdata } = route.params;
    const [searchtext, setsearchtext] = useState('');
    const [communityData, setCommunityData] = useState<PostData[]>([]);
    const [userData, setUserData] = useState<UserData>(userdata);

    const handlesearchTextChange = (inputText: string) => {
        setsearchtext(inputText);
    }

    const view_count_up = async (post_id: any) => {
        try {
            const response = await fetch(`${config.serverUrl}/view_count_up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post_id
                })
            })
            const result = await response.json();
            //console.log("포스트 View 올리기 성공!")
        } catch (error) {
            console.error('포스트 View 올리기 누르기 실패', error);
        }
    }

    const getGeneralposts = async () => {
        try {
            //console.log('Search text:', searchtext);
            const response = await fetch(`${config.serverUrl}/search_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    search_text: searchtext
                }),
            });
    
            // Check if response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const postsdata = await response.json();
            //console.log(postsdata);
            setCommunityData(postsdata);
            // setCommunityData(postsdata);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            //getGeneralposts();
        }, [])
    );


    const renderItem = ({ item, index }: { item: PostData, index: number }) => (
        <TouchableWithoutFeedback onPress={async () => {
                await view_count_up(item.post_id);
                navigation.navigate("PostDetailScreen", { item, userData })}}>
            <View style={styles.writeboxcontainer}>
                <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                        <Text style={{ fontSize: 19, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                        <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                        <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                    </View>
                </View>
                <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                        <Text
                                    style={{
                                        fontSize: 13,
                                        marginLeft: 10,
                                        color:
                                            item.user_title === "학교" ? 'red' :
                                            item.user_title === "반장" ? 'green' :
                                            item.user_title === "학우회장" ? 'blue' :
                                            'black'
                                    }}
                                >
                                    {item.name}
                                </Text>
                        <Text> | {item.date}</Text>
                    </View>
                    <View style={styles.likenum}>
                        <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                        <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    //console.log(communityData);

    return (
        <View style={styles.container}>
            <View style={styles.emptyspace1}></View>
            <View style={styles.headercontainer}>
                <View style={styles.searchcontainer}>
                    <View style={styles.picturebox}>
                        <IconD name="search1" size={22} color="#979797" />
                    </View>
                    <View style={styles.textinputbox}>
                        <TextInput
                            style={{ flex: 1, fontSize: 16, color: 'black' }}
                            onChangeText={handlesearchTextChange}
                            value={searchtext}
                            placeholder="글 제목, 내용"
                            placeholderTextColor={'gray'}
                            onSubmitEditing={() => getGeneralposts()}
                        />
                    </View>
                </View>
                <View style={styles.cancelcontainer}>
                    <TouchableOpacity style={styles.cancelbox} onPress={() => navigation.navigate("CommunityScreenStackNavigator")}>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            취소
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {communityData.length === 0 ? (
                <View style ={styles.nosearchView}>
                    <IconD name="search1" size={100} color="#979797" />
                    <Text style = {{fontSize : 20, marginTop : 10, fontWeight : 'bold'}}>게시판의 글을 검색해보세요</Text>
                </View>
            ) : (
                <FlatList
                    data={communityData}
                    renderItem={renderItem}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    emptyspace1: {
        height: 20,
        //backgroundColor: 'blue',
    },
    headercontainer: {
        height: 50,
        //backgroundColor: 'red',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom : 10
    },
    searchcontainer: {
        height: 40,
        width: 320,
        backgroundColor: '#FFDECF',
        flexDirection: 'row',
        marginLeft: 8,
        borderRadius: 8,
        //borderWidth: 1,
    },
    cancelcontainer: {
        height: 40,
        width: 80,
        //backgroundColor : 'green'
    },
    picturebox: {
        height: 40,
        marginLeft: 10,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinputbox: {
        height: 42
    },
    cancelbox: {
        flex: 1,
        backgroundColor: '#9A9EFF',
        borderRadius: 8,
        marginLeft: 8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topnavigationborder: {
        flex: 1,
        //backgroundColor : "blue",
        borderWidth: 2,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginTop: 57,
    },

    flatlisttopline: {
        //backgroundColor : 'red',
        //right : 118,
        height: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC'
    },

    flatliststyle: {
        //marginTop : 40,
        //backgroundColor : 'blue',
    },

    writeboxcontainer: {
        //padding: 50, 
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        //backgroundColor: 'red',
        height: 70,
    },

    writetitle: {
        flex: 0.6,
        flexDirection: 'row',
        marginTop: 5,
        //backgroundColor : 'yellow'
    },

    wirterandtime: {
        flex: 0.4,
        flexDirection: 'row'
        //backgroundColor : 'yellow'
    },

    titlebox: {
        flex: 0.85,
        //backgroundColor : 'green'
    },
    eyesnum: {
        flex: 0.15,
        flexDirection: 'row',
        // backgroundColor : 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    writerbox: {
        flex: 0.85,
        flexDirection: 'row',
        //backgroundColor : 'yellow',
    },
    likenum: {
        flex: 0.15,
        flexDirection: 'row',
        //backgroundColor : 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    delete: {
        width: 20,
        height: 20,
        backgroundColor: 'red',
    },
    
    nosearchView : {
        height : 400,
        //backgroundColor : 'yellow',
        alignItems : 'center',
        justifyContent : 'center',
    }
}
)

export default SearchPostScreen;