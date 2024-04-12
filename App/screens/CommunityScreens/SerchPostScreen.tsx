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
            <View style={styles.headerbox}>
                <View style={styles.searchbox}>
                    <View style={styles.searchtextbox}>
                        <View style={styles.picturebox1}>
                            <IconD name="search1" size={30} color="#979797" />
                        </View>
                        <View style={styles.searchtextinputbox}>
                            <View style = {{flex : 1}}>
                                <TextInput
                                    style={{ fontSize: 16 }}
                                    onChangeText={handlesearchTextChange}
                                    value={searchtext}
                                />
                            </View>
                        </View>

                    </View>
                </View>
                <View style={styles.cancelbox}>
                    <TouchableOpacity
                        style={styles.cancelbutton}
                        onPress={() => navigation.navigate("CommunityScreenStackNavigator")}
                    >
                        <Text style={{ fontSize: 20, color: 'black' }}>취소</Text>
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
    headerbox: {
        height: 55,
        backgroundColor: 'blue',
        flexDirection: 'row',
        marginTop: 10,

    },
    searchbox: {
        flex: 0.80,
        //backgroundColor: 'green',
    },
    cancelbox: {
        flex: 0.20,
        //backgroundColor: 'yellow',
    },
    cancelbutton: {
        flex: 1,
        backgroundColor: '#9A9EFF',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    searchtextbox: {
        flex: 1,
        backgroundColor: '#FFDECF',
        margin: 8,
        borderRadius: 12,
        flexDirection: 'row',
    },
    picturebox1: {
        flex: 0.13,
        //backgroundColor : 'yellow',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchtextinputbox: {
        flex: 0.87,
        justifyContent: 'center',
    }
})

export default SearchPostScreen;