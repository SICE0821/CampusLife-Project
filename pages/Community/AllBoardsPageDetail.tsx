import React, {  useState, } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {Text, View, StyleSheet, FlatList, TouchableWithoutFeedback, } from 'react-native';
import IconB from 'react-native-vector-icons/AntDesign';

type Data = {
    id : number,
    like : number,
    time : string,
    title : string,
    watch : number,
    writer : string,
}

const renderEmptyItem = () => {
    return(
        <View style = {{height : 85}}>
        </View>
    )
}

const AllBoardersPageDetail:React.FC = () => {
    const [communityData, setCommunityData] = useState<Data[]>([]);

    const fetchData = async () => {
        try {
          const response = await fetch('http://172.30.1.24:3000/AllCommunity');
          if (!response.ok) {
            throw new Error('서버 응답 실패');
          }
          const data = await response.json();
          setCommunityData(data);
          console.log("데이터 받음:", data);
        } catch (error) {
          console.error('데이터를 가져오는 중 오류 발생:', error);
        }
      };

      useFocusEffect(
        React.useCallback(() => {
          fetchData();
        }, [])
      );
    
      const renderItem = ({ item }: { item: Data }) => (
        <TouchableWithoutFeedback onPress={() => console.log(item.id)}>
            <View style = {styles.writeboxcontainer}>
          <View style = {styles.writetitle}>
            <View style = {styles.titlebox}>
                <Text style = {{fontSize : 20, margin : 5, marginLeft: 5, color : 'black'}}>{item.title}</Text>
            </View>
            <View style = {styles.eyesnum}>
                <Text style = {{color : '#F29F05',}}> <IconB name = "eyeo" size = {26}/></Text>
                <Text style = {{ color : 'black', marginLeft : 3}}>{item.watch}</Text>
            </View>
          </View>
          <View style = { styles.wirterandtime}>
            <View style = {styles.writerbox}>
                <Text style = {{fontSize : 13, marginLeft : 5, color : 'black'}}>{item.writer}</Text>
                <Text> | {item.time}</Text>
            </View>
            <View style = {styles.likenum}>
                <Text style = {{color : '#F29F05', marginBottom : 7}}> <IconB name = "like1" size = {21}/></Text>
                <Text style = {{ color : 'black', marginLeft : 7, marginBottom : 4}}>{item.like}</Text>
            </View>
          </View>
        </View>
        </TouchableWithoutFeedback>
      );

    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationspace}>
            </View>
            <View style = {styles.topnavigationborder}>
                <View style = {styles.flatlisttopline}>
                </View>   
                <FlatList
                    style = {styles.flatliststyle}
                    data={communityData}
                    renderItem={renderItem}
                    ListFooterComponent={renderEmptyItem}
                    //keyExtractor={(item) => item.id}
                    />
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
        //backgroundColor : 'yellow',
    },

    topnavigationborder : {
        flex : 0.93,
        //backgroundColor : "red",
        borderWidth : 2,
        borderTopLeftRadius : 10,
        borderTopRightRadius : 10,
    },

    flatlisttopline : {
        //backgroundColor : 'red',
        //right : 118,
        height : 49, 
        borderBottomWidth :1,
        borderBottomColor: '#CCCCCC'
    },

    flatliststyle : {
        //marginTop : 40,
        //backgroundColor : 'blue',
    },

    writeboxcontainer : { 
        //padding: 50, 
        borderBottomWidth: 1, 
        borderBottomColor: '#CCCCCC', 
        backgroundColor : 'white'
    },

    writetitle : {
        flex : 0.5,
        flexDirection : 'row',
        marginTop : 5,
        //backgroundColor : 'yellow'
    },

    wirterandtime : {
        flex : 0.5,
        flexDirection : 'row'
        //backgroundColor : 'yellow'
    },

    titlebox : {
        flex : 0.85,
        //backgroundColor : 'green'
    },
    eyesnum : {
        flex : 0.15,
        flexDirection : 'row',
       // backgroundColor : 'red',
        alignItems : 'center',
        justifyContent :'center',
    },
    writerbox : {
        flex : 0.85,
        flexDirection : 'row',
       // backgroundColor : 'yellow',
    },
    likenum : {
        flex : 0.15,
        flexDirection : 'row',
        //backgroundColor : 'red',
        alignItems : 'center',
        justifyContent :'center',
    }

    }
)

export default AllBoardersPageDetail;