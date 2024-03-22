import React from 'react';
import {Text, View, Button,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CommunityScreen : React.FC = () => {
    const navigation: any = useNavigation();
    return (
        <View style = {{justifyContent :'center', alignItems : 'center', flex : 1}}>
            <Text style = {{fontSize : 50, fontWeight :'bold', backgroundColor : 'blue'}}> 정유환입니다. </Text>
            <Button title = "DetailScreen으로 이동" onPress={ () => navigation.navigate("DetailScreen")}/>
        </View>
    );
};

export default CommunityScreen;