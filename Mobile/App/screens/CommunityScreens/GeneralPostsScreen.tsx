import React, { useState, } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View, StyleSheet, FlatList, TouchableWithoutFeedback,TouchableOpacity } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';

type Data = {
    id: number,
    like: number,
    time: string,
    title: string,
    watch: number,
    writer: string,
}

const renderEmptyItem = () => {
    return (
        <View style={{ height: 85 }}>
        </View>
    )
}

const GeneralPostsScreen: React.FC = ({ navigation, route }: any) => {
    const [communityData, setCommunityData] = useState<Data[]>([]);
    const { department_check, userdata } = route.params;
    console.log(userdata);
    console.log(department_check);
    const getGeneralposts = async () => {
        try {
            const response = await fetch('http://175.212.187.92:3000/generalpost');
            const postsdata = await response.json();
            //console.log(postsdata);
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error)
        }
    }

    const getDepartmentposts = async () => {
        try {
            const response = await fetch('http://175.212.187.92:3000/departmentpost');
            const postsdata = await response.json();
            setCommunityData(postsdata);
        } catch (error) {
            console.error(error)
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            if (department_check == 0) {
                //console.log("전체 게시판!");
                getGeneralposts();
            } else if (department_check == 1) {
                //console.log("학과 게시판");
                getDepartmentposts();
            } else {
               // console.log("이도 저도 아닌데?");
            }
        }, [])
    );

    const renderItem = ({ item }: { item: Data }) => (
        <TouchableWithoutFeedback onPress={() => navigation.navigate("PostDetailScreen")}>
            <View style={styles.writeboxcontainer}>
                <View style={styles.writetitle}>
                    <View style={styles.titlebox}>
                        <Text style={{ fontSize: 22, margin: 5, marginLeft: 5, color: 'black' }}>{item.title}</Text>
                    </View>
                    <View style={styles.eyesnum}>
                        <Text style={{ color: '#F29F05', }}> <IconB name="eyeo" size={26} /></Text>
                        <Text style={{ color: 'black', marginLeft: 3 }}>{item.watch}</Text>
                    </View>
                </View>
                <View style={styles.wirterandtime}>
                    <View style={styles.writerbox}>
                        <Text style={{ fontSize: 13, marginLeft: 5, color: 'black' }}>{item.writer}</Text>
                        <Text> | {item.time}</Text>
                    </View>
                    <View style={styles.likenum}>
                        <Text style={{ color: '#F29F05', marginBottom: 7 }}> <IconB name="like1" size={21} /></Text>
                        <Text style={{ color: 'black', marginLeft: 7, marginBottom: 4 }}>{item.like}</Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );

    return (
        <View style={styles.container}>
            <View style={styles.topnavigationborder}>
                <View style={styles.flatlisttopline}>
                </View>
                <FlatList
                    style={styles.flatliststyle}
                    data={communityData}
                    renderItem={renderItem}
                    ListFooterComponent={renderEmptyItem}
                //keyExtractor={(item) => item.id}
                />
            </View>
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
        height : 80,
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
    }

}
)

export default GeneralPostsScreen;