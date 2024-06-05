import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
const DeadlineEventScreen = () => {
  return (
      <View style = {styles.container}>
        <Text>한정 이벤트 페이지</Text>
      </View>
  );
};

const styles = StyleSheet.create({
  container : {
    flex : 1,
    alignItems : 'center',
  }
});

export default DeadlineEventScreen;