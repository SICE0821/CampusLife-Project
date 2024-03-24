import React from 'react';
import {View, StyleSheet} from 'react-native';

const BookmarkScreen:React.FC = () => {
    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationspace}>
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
        flex : 0.09,
        //backgroundColor : 'yellow',
    }

    }
)

export default BookmarkScreen;