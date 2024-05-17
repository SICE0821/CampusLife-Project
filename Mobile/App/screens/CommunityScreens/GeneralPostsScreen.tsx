import React, { useState, } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback,TouchableHighlight , TouchableOpacity, Pressable, Animated } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

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

const renderLeftActions = () => (
    // 왼쪽으로 스와이프할 때 나타날 컴포넌트
    <View style={{ backgroundColor: 'green', justifyContent: 'center', alignItems: 'center', width: 100 }}>
        <Text>Delete</Text>
    </View>
);



const renderEmptyItem = () => {

    return (
        <View style={{ height: 85 }}>
        </View>
    )
}

const GeneralPostsScreen = ({ route, navigation }: any) => {
    const { department_check, userdata } = route.params;
    const [communityData, setCommunityData] = useState<PostData[]>([]);
    const [scrollPosition, setScrollPosition] = useState(0);
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

    const getDepartmentposts = async () => {
        try {
            const response = await fetch('http://172.16.117.122:3000/departmentpost');
            const postsdata = await response.json();
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (department_check == 0) {
                getGeneralposts();
            } else if (department_check == 1) {
                getDepartmentposts();
            }
        }, [])
    );

    const renderItem = ({ item }: { item: PostData }) => (
        <GestureHandlerRootView>
            <Swipeable
                renderRightActions={renderLeftActions}
                >
                <TouchableOpacity  /*onPress={() => navigation.navigate("PostDetailScreen")}*/>
                    <View style={styles.writeboxcontainer}>
                        <View style={styles.writetitle}>
                            <View style={styles.titlebox}>
                                <Text style={{ fontSize: 22, margin: 5, marginLeft: 10, color: 'black' }}>{item.title}</Text>
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
                </TouchableOpacity >
            </Swipeable>
        </GestureHandlerRootView>
    );

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.flatliststyle}
                data={communityData}
                renderItem={renderItem}
                ListFooterComponent={renderEmptyItem}
                
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
        height: 80,
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

export default GeneralPostsScreen;