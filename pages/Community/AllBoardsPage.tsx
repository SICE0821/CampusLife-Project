import React from 'react';
import {Text, View, Button, StyleSheet} from 'react-native';

const AllBoardsPage : React.FC = () => {
    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationspace}>

            </View>
            <Text>전체 게시판입니다.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
    },
    topnavigationspace : {
        flex : 0.09,
        //backgroundColor : 'yellow',
    }

    }
)

export default AllBoardsPage;

