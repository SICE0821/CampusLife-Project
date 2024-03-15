import React, { useState } from 'react';
import {Text, View, Button, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

const AllBoardsPage : React.FC = () => {

    const [data, setData] = useState<Array<{ id: string; title: string }>>([
        { id: '1', title: '아이템 1' },
        { id: '2', title: '아이템 2' },
        { id: '3', title: '아이템 3' },
        { id: '4', title: '아이템 4' },
        { id: '5', title: '아이템 5' },
      ]);
      const [loading, setLoading] = useState<boolean>(false);
      const [page, setPage] = useState<number>(1);
    
      const fetchMoreData = () => {
        // 이미 모든 데이터를 로드한 경우 더 이상 데이터를 불러오지 않음
        if (loading || data.length >= 100) return;
        setLoading(true);
    
        // 예제를 위해 1초 후에 데이터를 추가합니다.
        setTimeout(() => {
          const newData = Array.from({ length: 5 }, (_, index) => ({
            id: String(data.length + index + 1),
            title: `아이템 ${data.length + index + 1}`,
          }));
          setData([...data, ...newData]);
          setLoading(false);
        }, 1000);
      };

    const renderFooter = () => {
        if (!loading) return null;
    
        return (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      };
    
    const renderItem = ({ item }: { item: { id: string; title: string } }) => (
        <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
          <Text>{item.title}</Text>
        </View>
      );
    

    return (
        <View style = {styles.container}>
            <View style = {styles.topnavigationspace}>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                onEndReached={fetchMoreData}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                style = {{flex :0.91,}}
            />
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

