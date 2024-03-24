import React from 'react';
import {Text, View, Button,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen : React.FC = ({navigation} : any, {route} : any) => {
    const pk : number = 1;
    const name : string = "유환";
    return (
        <View style = {{justifyContent :'center', alignItems : 'center', flex : 1}}>
            <Text style = {{fontSize : 50, fontWeight :'bold'}}> 로그인 스크린 </Text>
            <Button title = "바텀 네비게이션으로 이동" onPress={ () => navigation.navigate("BottomNavigation", { userpk : pk})}/>
        </View>
    );
};

export default LoginScreen;