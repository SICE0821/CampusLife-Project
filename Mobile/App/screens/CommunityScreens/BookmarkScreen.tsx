import React, { useState, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import { Swipeable, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';

type PostData = {
    post_id: number,
    title: string,
    contents: string,
    date: string,
    view: number,
    like: number,
    name: string,
    admin_check: boolean
}

const renderEmptyItem = () => {

    return (
        <View style={{ height: 85 }}>
        </View>
    )
}

const BookmarkScreen = ({ route, navigation }: any) => {
    const ref = useRef(null);
    const { department_check, userdata } = route.params;
    const [communityData, setCommunityData] = useState<PostData[]>([]);
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userHavePost, setUserHavePost] = useState<any[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);
    const swipeableRef = useRef<Swipeable>(null);
    const [swipeableRefs, setSwipeableRefs] = useState<Array<Swipeable>>([]);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await AreYouHavePost();
        setTimeout(() => setRefreshing(false), 500); // 0.5초 후에 새로고침 완료
    };


    const Addbookmark = async (user_pk: any, post_pk: any) => {
        try {
            const response = await fetch('http://175.212.187.92:3000/add_book_mark', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_pk,
                    post_id: post_pk,
                })
            })
            const result = await response.json();
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
        }
    }

    const renderRightActions = (item: PostData) => {
        return (
            // 왼쪽으로 스와이프할 때 나타날 컴포넌트
            <TouchableOpacity
                onPress={() => {
                    Addbookmark(userData.user_pk, item.post_id);
                    onRefresh();
                }}
                style={{
                    backgroundColor: '#FFDFC1',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 70,
                }}>
                {userHavePost.some(posts => item.post_id === posts.post_id) ? (
                    <Text style={{ color: '#F29F05' }}> <IconC name="bookmark" size={40} /></Text>
                ) : (
                    <Text style={{ color: '#F29F05' }}> <IconC name="bookmark-o" size={40} /></Text>
                )}
            </TouchableOpacity>
        )
    };
    //책갈피 일반 게시물을 가져오는 DB
    const getGeneralposts = async () => {
        try {
            const response = await fetch('http://172.16.117.122:3000/generalpost');
            const postsdata = await response.json();
            console.log(postsdata);
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error)
        }
    }
    //책갈피 학과 게시물을 가져오는 DB
    const getDepartmentposts = async () => {
        try {
            const response = await fetch('http://172.16.117.122:3000/departmentpost');
            const postsdata = await response.json();
            setCommunityData(postsdata);
        } catch (error) {
            //console.error(error)
        }
    }

    const AreYouHavePost = async () => {
        try {
            const response = await fetch('http://175.212.187.92:3000/get_user_have_post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.user_pk
                })
            })
            const user_have_posts = await response.json();
            setUserHavePost(user_have_posts);
        } catch (error) {
            console.error('유저 학과 이름 가져오기 실패:', error);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (department_check == 0) {
                getGeneralposts();
            } else if (department_check == 1) {
                getDepartmentposts();
            }
            setUserData(userdata);
            AreYouHavePost();
        }, [])
    );

    const renderItem = ({ item }: { item: PostData }) => (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable
                renderRightActions={() => renderRightActions(item)}
                onSwipeableWillOpen={() => setIsSwipeableOpen(true)}
                onSwipeableWillClose={() => setIsSwipeableOpen(false)}>
                <TouchableWithoutFeedback onPress={() => navigation.navigate("PostDetailScreen", { item, userData })}>
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
                                <Text style={{ fontSize: 13, marginLeft: 10, color: item.admin_check === true ? 'red' : 'black' }}>{item.name}</Text>
                                <Text> | {item.date}</Text>
                            </View>
                            <View style={styles.likenum}>
                                <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                                <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        </GestureHandlerRootView>
    );
    return (
        <View style={styles.container} ref={ref}>
            <View style={{ height: 120, backgroundColor: 'white' }}></View>
            <FlatList
                style={styles.flatliststyle}
                data={communityData}
                renderItem={renderItem}
                ListFooterComponent={renderEmptyItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            //keyExtractor={(item) => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
    }

    }
)

export default BookmarkScreen;