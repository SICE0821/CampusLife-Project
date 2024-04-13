import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconD from 'react-native-vector-icons/AntDesign';

const SearchPostScreen: React.FC = ({ navigation }: any) => {
    const [searchtext, setsearchtext] = useState('');
    const handlesearchTextChange = (inputText: string) => {
        setsearchtext(inputText);
    }
    return (
        <View style={styles.container}>
            <View style={styles.emptyspace1}></View>
            <View style={styles.headercontainer}>
                <View style={styles.searchcontainer}>
                    <View style={styles.picturebox}>
                        <IconD name="search1" size={30} color="#979797" />
                    </View>
                    <View style={styles.textinputbox}>
                        <TextInput
                            style={{ flex: 1, fontSize : 16}}
                            onChangeText={handlesearchTextChange}
                            value={searchtext}
                            multiline={true}
                            placeholder="글 제목, 내용"
                        />
                    </View>
                </View>
                <View style={styles.cancelcontainer}>
                    <TouchableOpacity style = {styles.cancelbox} onPress={() => navigation.navigate("CommunityScreenStackNavigator")}>
                        <Text style = {{fontSize : 20, color : 'black'}}>
                            취소
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //backgroundColor : 'red',
    },
    emptyspace1: {
        height: 30,
        //dbackgroundColor: 'blue',
    },
    headercontainer: {
        height: 45,
        //backgroundColor: 'red',
        flexDirection: 'row',
    },
    searchcontainer: {
        flex: 0.83,
        backgroundColor: '#FFDECF',
        flexDirection: 'row',
        marginLeft :8,
        borderRadius: 8,
        borderWidth: 1,
    },
    cancelcontainer: {
        flex: 0.17,
        //backgroundColor : 'green'
    },
    picturebox: {
        flex: 0.12,
        //backgroundColor : 'green',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textinputbox: {
        flex: 0.88,
        //backgroundColor : "black",
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    cancelbox : {
        flex : 1,
        backgroundColor : '#9A9EFF',
        borderRadius : 8,
        marginLeft : 8,
        marginRight : 8,
        justifyContent : 'center',
        alignItems : 'center',
    }
}
)

export default SearchPostScreen;