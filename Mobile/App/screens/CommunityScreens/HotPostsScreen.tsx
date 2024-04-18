import React from 'react';
import {View, StyleSheet} from 'react-native';

const HotPostsScreen:React.FC = () => {
    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationborder}>
                <View style = {styles.flatlisttopline}>
                </View>   
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
    },
    topnavigationspace : {
        flex : 0.07,
        backgroundColor : 'yellow',
    },
    topnavigationborder : {
        flex : 1,
        //backgroundColor : "red",
        borderWidth : 2,
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
        marginTop : 50,
    },

    flatlisttopline : {
        //backgroundColor : 'red',
        //right : 118,
        height : 60, 
        borderBottomWidth :1,
        borderBottomColor: '#CCCCCC'
    },
    }
)

export default HotPostsScreen;