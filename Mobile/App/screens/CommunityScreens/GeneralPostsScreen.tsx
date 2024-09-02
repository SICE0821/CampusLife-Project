import React, { useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableOpacity, Pressable, Animated, RefreshControl } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import IconC from 'react-native-vector-icons/FontAwesome';
import { UserData } from '../../types/type'
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import config from '../../config';

type PostData = {
    post_id: number,
    title: string,
    contents: string,
    date: string,
    view: number,
    like: number,
    name: string,
    user_title: string
}


const renderEmptyItem = () => { /** 하단바 크기의 공백 */
    return (
        <View style={{ height: 85 }} />
    )
}

const GeneralPostsScreen = ({ route, navigation }: any) => {
    console.log("you are in GeneralPostsScreen")
    const swipeableRefs = useRef<(Swipeable | null)[]>(new Array().fill(null));
    const ref = useRef(null);
    const { department_check, userdata } = route.params;
    const [communityData, setCommunityData] = useState<PostData[]>([]);
    const [userData, setUserData] = useState<UserData>(userdata);
    const [userHavePost, setUserHavePost] = useState<any[]>([]);
    const [isSwipeableOpen, setIsSwipeableOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    ;
    /*
    const onRefresh = async () => {
        setRefreshing(true);
        await AreYouHavePost();
        console.log("함수 잘 마무리")
        setTimeout(() => setRefreshing(false), 500); // 0.5초 후에 새로고침 완료
    };
    */

    const closebookmark = useCallback((index: any) => {
        //nameInput ref객체가 가리키는 컴포넌트(이름 입력필드)를 포커스합니다.
        swipeableRefs.current[index]?.close();
    }, []);


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
    
    const Addbookmark = async (user_pk: number, post_pk: number) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${config.serverUrl}/add_book_mark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_pk,
                    post_id: post_pk,
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.message === "북마크 추가 완료") {
                //console.log('북마크가 성공적으로 추가되었습니다.');
            } else {
                //console.log('알 수 없는 응답:', result);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('북마크 추가 요청 실패:', error);
            }
        }
    };

    const RemoveBookmark = async (user_pk: number, post_pk: number) => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${config.serverUrl}/delete_book_mark`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user_pk,
                    post_id: post_pk,
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.message === "북마크 추가 완료") {
                //console.log('북마크가 성공적으로 추가되었습니다.');
            } else {
                //console.log('알 수 없는 응답:', result);
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('북마크 추가 요청 실패:', error);
            }
        }
    };

    const handleBookmark = async (item: PostData, index: number) => {
    const handleBookmark = async (item: PostData, index: number) => {
        try {
            if (userHavePost.some(posts => item.post_id === posts.post_id)) {
                // 이미 북마크에 있는 경우, 북마크를 삭제합니다.
                await RemoveBookmark(userData.user_pk, item.post_id);
                // 서버 작업이 성공적으로 완료된 후, 상태를 업데이트합니다.
                setUserHavePost((prev) => prev.filter(post => post.post_id !== item.post_id));
                closebookmark(index);
            } else {
                // 북마크에 없는 경우, 북마크를 추가합니다.
                await Addbookmark(userData.user_pk, item.post_id);
                // 서버 작업이 성공적으로 완료된 후, 상태를 업데이트합니다.
                setUserHavePost((prev) => [...prev, item]);
                closebookmark(index);
            }
        } catch (error) {
            // 오류 처리
            console.error("Bookmark 처리 실패:", error);
        }
    };

    const renderRightActions = (item: PostData, index: number) => {
    const renderRightActions = (item: PostData, index: number) => {
        return (
            // 왼쪽으로 스와이프할 때 나타날 컴포넌트
            <TouchableOpacity
                onPress={() => handleBookmark(item, index)}
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

    const getGeneralposts = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/generalpost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    campus_id: userData.campus_pk,
                    department_id: userData.department_pk
                    campus_id: userData.campus_pk,
                    department_id: userData.department_pk
                }),
            })
            const postsdata = await response.json();
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error);
        } finally {
        }
    }


    const getDepartmentposts = async () => {
        try {
            const response = await fetch(`${config.serverUrl}/departmentpost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    department_id: userData.department_pk
                    department_id: userData.department_pk
                }),
            })
            const postsdata = await response.json();
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    const AreYouHavePost = async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            const response = await fetch(`${config.serverUrl}/get_user_have_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userData.user_pk
                }),
                signal: controller.signal
            })
            const user_have_posts = await response.json();
            //console.log('북마크 가져오기 성공:', user_have_posts);
            setUserHavePost(user_have_posts);

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error: any) {
            console.error('북마크 가져오기 실패:', error);

            if (error.name === 'AbortError') {
                console.error('요청이 타임아웃되었습니다.');
            } else {
                console.error('기타 오류:', error);
            }
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            const fetchData = async () => {
                try {
                    if (department_check == 0) {
                        await getGeneralposts(); //전체 전체 포스터 가져오기
                    } else if (department_check == 1) {
                        await getDepartmentposts(); //전체 학과 포스터 가져오기
                    }
                    setUserData(userdata);
                    await AreYouHavePost();
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            fetchData();
        }, [])
    );

    const renderItem = ({ item, index }: { item: PostData, index: number }) => (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Swipeable
                ref={(instance) => (swipeableRefs.current[index] = instance)}
                renderRightActions={() => renderRightActions(item, index)}>
                <TouchableWithoutFeedback onPress={async () => {
                    await view_count_up(item.post_id);
                    navigation.navigate("PostDetailScreen", { item, userData })
                }}>
                    await view_count_up(item.post_id);
                    navigation.navigate("PostDetailScreen", { item, userData })
                }}>
                    <View style={styles.writeboxcontainer}>
                        <View style={styles.writetitle}>
                            <View style={styles.titlebox}>
                                <Text style={{ fontSize: 19, marginLeft: 10, color: 'black' }}>{item.title}</Text>
                            </View>
                            <View style={styles.eyesnum}>
                                <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                                <Text style={{ color: 'black', marginLeft: 3 }}>{item.view}</Text>
                            </View>
                        </View>
                        <View style={styles.wirterandtime}>
                            <View style={styles.writerbox}>
                                <Text
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
                                <Text style={{ color: '#F29F05' }}> <IconB name="like1" size={21} /></Text>
                                <Text style={{ color: 'black', marginLeft: 7}}>{item.like}</Text>
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
                data={communityData}
                renderItem={renderItem}
                ListFooterComponent={renderEmptyItem}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        //onRefresh={onRefresh}
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
    writeboxcontainer: { // 게시물 박스
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        backgroundColor: 'white',
        flex: 1,
        height: 70,
    },
    writetitle: { // 게시물 상단 영역
        flex: 1,
        height: '60%',
        flexDirection: 'row',
        //backgroundColor : 'yellow'
    },
    wirterandtime: { // 게시물 하단 영역
        width: '100%',
        height: '40%',
        flexDirection: 'row',
        //backgroundColor : 'blue'
    },

    titlebox: { // 상단 제목 영역
        width: '87%',
        justifyContent: 'center',
        //backgroundColor : 'green'
    },
    eyesnum: { // 상단 조회수 영역
        width: '13%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        //backgroundColor : 'red',
    },
    writerbox: { // 하단 작성자, 시간 영역
        width: '87%',
        flexDirection: 'row',
        //backgroundColor : 'yellow',
    },
    likenum: { // 하단 추천수 영역
        width: '13%',
        flexDirection: 'row',
        bottom: 5,
        left: 2,
        alignItems: 'center',
        justifyContent: 'flex-start',
        //backgroundColor : 'red',
    },
}
)

export default GeneralPostsScreen;