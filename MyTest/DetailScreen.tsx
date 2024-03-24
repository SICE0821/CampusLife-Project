import React from 'react';
import {Text, View, Button,} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DetailScreen : React.FC = ({route} : any) => {
    const { userpk } = route.params;
    const navigation: any = useNavigation();
    console.log(userpk);
    return (
        <View style = {{justifyContent :'center', alignItems : 'center', flex : 1}}>
            <Text style = {{fontSize : 50, fontWeight :'bold', backgroundColor : 'blue'}}> 반갑습니다. </Text>
            <Text>{userpk}</Text>
            <Button title = "DetailScreen으로 이동" onPress={ () => navigation.navigate("CommunityScreen", {userpk : 2})}/>
        </View>
    );
};

export default DetailScreen;