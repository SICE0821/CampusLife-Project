import React, { useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';

const server = () => {
    fetch('http://192.168.0.12:3000')
    .then((response: Response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then((data: string) => {
        console.log('Server response:', data);
    })
    .catch((error: Error) => {
        console.error('Fetch error:', error);
    });
}

const AllBoardsPage: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.topnavigationspace}></View>
            <Button title = "서버에게 요청" onPress={() => server()}></Button>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    topnavigationspace: {
        flex: 0.09,
        //backgroundColor: 'yellow',
    }
});

export default AllBoardsPage;


