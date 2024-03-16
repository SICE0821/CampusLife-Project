import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const server = () => {
  return fetch('http://172.30.1.72:3000')
    .then((response: Response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then((data: string) => {
        console.log('Server response:', data);
        return data;
    })
    .catch((error: Error) => {
        console.error('Fetch error:', error);
        throw error;
    });
}

const AllBoardsPage: React.FC = () => {
  const navigation = useNavigation();
  const [serverResponse, setServerResponse] = useState<string | null>(null);

  useEffect(() => {
      const fetchData = async () => {
          try {
              const response = await server();
              setServerResponse(response);
          } catch (error) {
              // 에러 처리
          }
      };

      // 페이지가 포커스를 받았을 때 서버 요청
      const unsubscribeFocus = navigation.addListener('focus', () => {
          fetchData();
      });

      return unsubscribeFocus; // clean-up 함수 등록

  }, [navigation]);
    return (
        <View style={styles.container}>
            <View style={styles.topnavigationspace}></View>
            <View></View>
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
        backgroundColor: 'yellow',
    }
});

export default AllBoardsPage;


