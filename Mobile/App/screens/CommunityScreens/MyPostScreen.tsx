import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, FlatList, TouchableWithoutFeedback, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import config from '../../config';

type PostData = {
    post_id: number;
    title: string;
    contents: string;
    date: string;
    view: number;
    like: number;
    name: string;
    user_title: string;
};

const renderEmptyItem = () => <View style={styles.footerSpacing} />;

const MyPostScreen = ({ route, navigation }: any) => {
    const { userdata } = route.params;
    const [communityData, setCommunityData] = useState<PostData[]>([]);
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userHavePost, setUserHavePost] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const swipeableRefs = useRef<(Swipeable | null)[]>(new Array().fill(null));

    const onRefresh = async () => {
        setRefreshing(true);
        await AreYouHavePost();
        setTimeout(() => setRefreshing(false), 500);
    };

    const closeBookmark = useCallback((index: number) => {
        swipeableRefs.current[index]?.close();
    }, []);

    const viewCountUp = async (post_id: number) => {
        try {
            await fetch(`${config.serverUrl}/view_count_up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id }),
            });
        } catch (error) {
            console.error('조회수 증가 실패:', error);
        }
    };

    const addBookmark = async (user_pk: number, post_pk: number) => {
        try {
            const response = await fetch(`${config.serverUrl}/add_book_mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user_pk, post_id: post_pk }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            console.error('북마크 추가 실패:', error);
        }
    };

    const removeBookmark = async (user_pk: number, post_pk: number) => {
        try {
            const response = await fetch(`${config.serverUrl}/delete_book_mark`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user_pk, post_id: post_pk }),
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        } catch (error) {
            console.error('북마크 삭제 실패:', error);
        }
    };

    const handleBookmark = async (item: PostData, index: number) => {
        try {
            if (userHavePost.some(posts => item.post_id === posts.post_id)) {
                await removeBookmark(userData.user_pk, item.post_id);
                setUserHavePost(prev => prev.filter(post => post.post_id !== item.post_id));
            } else {
                await addBookmark(userData.user_pk, item.post_id);
                setUserHavePost(prev => [...prev, item]);
            }
            closeBookmark(index);
        } catch (error) {
            console.error('북마크 처리 실패:', error);
        }
    };

    const renderRightActions = (item: PostData, index: number) => (
        <TouchableOpacity onPress={() => handleBookmark(item, index)} style={styles.bookmarkButton}>
            {userHavePost.some(posts => item.post_id === posts.post_id) ? (
                <Text style={styles.bookmarkedIcon}>
                    <IconC name="bookmark" size={40} />
                </Text>
            ) : (
                <Text style={styles.bookmarkIcon}>
                    <IconC name="bookmark-o" size={40} />
                </Text>
            )}
        </TouchableOpacity>
    );

    const getMyPostData = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/getMyPostData`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userData.user_pk }),
            });
            const postsData = await response.json();
            setCommunityData(postsData);
        } catch (error) {
            console.error('게시물 가져오기 실패:', error);
        }
    };

    const AreYouHavePost = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/get_user_have_post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userData.user_pk }),
            });
            const userHavePosts = await response.json();
            setUserHavePost(userHavePosts);
        } catch (error) {
            console.error('북마크 가져오기 실패:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            getMyPostData();
            AreYouHavePost();
        }, [])
    );

    const renderItem = ({ item, index }: { item: PostData; index: number }) => (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable ref={instance => (swipeableRefs.current[index] = instance)} renderRightActions={() => renderRightActions(item, index)}>
                <TouchableWithoutFeedback
                    onPress={async () => {
                        await viewCountUp(item.post_id);
                        navigation.navigate('PostDetailScreen', { item, userData });
                    }}>
                    <View style={styles.postItem}>
                        <View style={styles.postHeader}>
                            <View style={styles.postTitleSection}>
                                <Text style={styles.postTitle} numberOfLines={1}>{item.title}</Text>
                            </View>
                            <View style={styles.viewCountSection}>
                                <Text style={styles.viewIcon}>
                                    <IconB name="eyeo" size={26} />
                                </Text>
                                <Text style={styles.viewCountText}>{item.view}</Text>
                            </View>
                        </View>
                        <View style={styles.postFooter}>
                            <View style={styles.authorSection}>
                                <Text
                                    style={[
                                        styles.authorName,
                                        item.user_title === '학교' && styles.schoolRole,
                                        item.user_title === '반장' && styles.leaderRole,
                                        item.user_title === '학우회장' && styles.presidentRole,
                                    ]}>
                                    {item.name}
                                </Text>
                                <Text> | {item.date}</Text>
                            </View>
                            <View style={styles.likeCountSection}>
                                <Text style={styles.likeIcon}>
                                    <IconB name="like1" size={21} />
                                </Text>
                                <Text style={styles.likeCountText}>{item.like}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={communityData}
                renderItem={renderItem}
                ListFooterComponent={renderEmptyItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    postItem: {
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        backgroundColor: 'white',
        flex: 1,
        height: 70,
    },
    postHeader: {
        flex: 1,
        height: '60%',
        flexDirection: 'row',
    },
    postFooter: {
        width: '100%',
        height: '40%',
        flexDirection: 'row',
    },
    postTitleSection: {
        width: '87%',
        justifyContent: 'center',
        paddingRight: 10,
    },
    viewCountSection: {
        width: '13%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    authorSection: {
        width: '87%',
        flexDirection: 'row',
    },
    likeCountSection: {
        width: '13%',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 5,
        left: 2,
        justifyContent: 'flex-start',
    },
    bookmarkButton: {
        backgroundColor: '#FFDFC1',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
    },
    bookmarkedIcon: {
        color: '#F29F05',
    },
    bookmarkIcon: {
        color: '#F29F05',
    },
    postTitle: {
        fontSize: 19,
        marginLeft: 10,
        color: 'black',
    },
    viewIcon: {
        color: '#F29F05',
    },
    viewCountText: {
        color: 'black',
        marginLeft: 4,
    },
    authorName: {
        fontSize: 13,
        marginLeft: 10,
    },
    schoolRole: {
        color: 'red',
    },
    leaderRole: {
        color: 'green',
    },
    presidentRole: {
        color: 'blue',
    },
    footerSpacing: {
        height: 85,
    },
    likeIcon: {
        color: '#F29F05',
    },
    likeCountText: {
        color: 'black',
        marginLeft: 7,
        top: 1
    },
});

export default MyPostScreen;
