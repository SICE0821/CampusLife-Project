import React, { useState } from 'react';
import { Dimensions, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";

const width = Dimensions.get("window").width * 0.98;

const bcuimage = require('../../assets/img-bcu-logo.png'); // 학교 로고

const info_data_head = ["층", "학과 홈페이지", "학과 사무실 전화번호"];

const info_building = ['한길관', '꿈집', '세미나관', '공학권', '에지관', '밀레니엄관'];

const info_data = [
  [
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
    ["B1", "실내건축디자인학과", "010-1234-5678"],
  ],
  [
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
    ["2F", "건축학과", "010-8765-4321"],
  ],
  [
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
    ["3F", "컴퓨터공학과", "010-1357-2468"],
  ],
  
];

const widthArrs = [width * 0.2, width * 0.4, width * 0.4];
const tableBorderColor = 'gray';

const SchoolInfoScreen = () => {
    const [visibleBuildings, setVisibleBuildings] = useState<{ [key: string]: boolean }>({});

  const toggleInfoDataVisibility = (buildingName : string) => {
    setVisibleBuildings((prev) => ({
      ...prev,
      [buildingName]: !prev[buildingName],
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.map}>
          <Text>맵</Text>
        </View>
        <View style={styles.logoArea}>
          <Image style={styles.logo} source={bcuimage} />
          <Text style={styles.logoText}>(031-432-789)</Text>
        </View>
        {info_building.map((building, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.infoArea} onPress={() => toggleInfoDataVisibility(building)}>
              <Text style={styles.infoText}>{building}</Text>
            </TouchableOpacity>
            {visibleBuildings[building] && (
              <View style={styles.infodata}>
                <Table borderStyle={{ borderWidth: 1, borderColor: tableBorderColor }}>
                  <Row
                    data={info_data_head}
                    style={{ height: 40, backgroundColor: "#dddddd" }}
                    textStyle={{ textAlign: "center", fontWeight: "bold", color: 'black' }}
                    widthArr={widthArrs}
                  />
                  <Rows
                    data={info_data[index]}
                    style={{ width: width, height: 40 }}
                    textStyle={{ textAlign: "center", fontWeight: 'bold', color: 'black' }}
                    widthArr={widthArrs}
                  />
                </Table>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: '100%',
    height: 700,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoArea: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    marginLeft: 10,
  },
  infoArea: {
    alignSelf: 'center',
    width: '100%',
    borderWidth: 0,
    borderRadius: 15,
    borderBottomWidth: 0,
    borderBottomStartRadius: 0,
    borderTopWidth: 1,
  },
  infoText: {
    alignSelf: 'flex-start',
    margin: 10,
    marginLeft: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },
  infodata: {
    alignSelf: 'center',
  },
  bottomArea: {
    width: '100%',
    height: 90,
  },
});

export default SchoolInfoScreen;
