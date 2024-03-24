import React from 'react';
import {Text, View, Button,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen : React.FC = ({navigation, route} : any) => {
    const { userpk } = route.params;
    console.log(userpk);
    return (
        <View style = {{justifyContent :'center', alignItems : 'center', flex : 1}}>
            <Text style = {{fontSize : 50, fontWeight :'bold'}}> 홈 스크린 </Text>
            <Text>{userpk}</Text>
            <Button title = "DetailScreen으로 이동" onPress={ () => navigation.navigate("DetailScreen")}/>
        </View>
    );
};

export default HomeScreen;