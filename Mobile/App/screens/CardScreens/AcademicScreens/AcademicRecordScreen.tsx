import React from 'react';
import {Text, View, StyleSheet,} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconA from 'react-native-vector-icons/FontAwesome5';

const AcademicRecord = () => {
    return (
        <View style = {styles.container}>
            <View style = {styles.textView}>
                <TouchableOpacity>
                    <Text style = {{fontSize : 25, fontWeight : "bold", marginLeft : 30,}}>학점</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text style = {{fontSize : 25, fontWeight : "bold", marginLeft : 20}}>수강신청이력</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <IconA style = {{marginLeft : 190}} name="calculator" size={32} color="black"></IconA>
                </TouchableOpacity>
            </View>
            <View style={{borderBottomWidth : 2, marginTop : 5,borderColor : "black"}}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'white',
    },
    textView : {
        flexDirection : "row",
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop : 20,
        
    }

    }
)

export default AcademicRecord;
