import React, { useState, useEffect } from 'react';
import { Dimensions, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { NaverMapView, NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import IconA from 'react-native-vector-icons/FontAwesome6';

export type SchoolData = {
  department_name: string,
  campus_name: string,
  department_phone: string,
  department_floor: string,
  department_building: string
}

const width = Dimensions.get("window").width * 0.98;

const bcuimage = require('../../assets/img-bcu-logo.png'); // 학교 로고

const info_data_head = ["층", "학과 홈페이지", "학과 사무실 전화번호"];

const widthArrs = [width * 0.2, width * 0.4, width * 0.4];
const tableBorderColor = 'gray';

const SchoolInfoScreen = () => {
  const [visibleBuilding, setVisibleBuilding] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);

  const toggleInfoDataVisibility = (buildingName: string) => {
    setVisibleBuilding((prev) => (prev === buildingName ? null : buildingName));
  };

  const fetchSchoolData = async () => {
    try {
      const response = await fetch('http://172.16.108.2:3000/getSchoolInfo');
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      setSchoolData(data);
    } catch (error) {
      console.error('데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const renderDepartmentList = (buildingName: string) => {
    return (
      schoolData
        .filter(item => item.department_building === buildingName)
        .sort((a, b) => parseInt(a.department_floor) - parseInt(b.department_floor))
        .map((item, idx) => (
          <Rows
            key={idx}
            data={[[item.department_floor, item.department_name, item.department_phone]]}
            style={{ width: width, height: 40 }}
            textStyle={{ textAlign: "center", fontWeight: 'bold', color: 'black' }}
            widthArr={widthArrs}
          />
        ))
    );
  };

  useEffect(() => {
    fetchSchoolData();
  }, []);

  // 중복되지 않는 건물 이름 목록 가져오기
  const uniqueBuildingNames = [...new Set(schoolData.map(item => item.department_building))];

  return (
    <View style={styles.container}>
      <ScrollView>
        <View>
          
          <NaverMapView
            style={styles.map}
            initialCamera={{
              latitude: 37.48943025,
              longitude: 126.77881105,
              zoom : 17,
            }}
            >
            <NaverMapMarkerOverlay
              latitude={37.48989698610115}
              longitude={126.77785702906668}
              onTap={() => console.log("세미나관")}
              anchor={{ x : 0.4, y: 0.0 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.48937654643633}
              longitude={126.77771746261125}
              onTap={() => console.log("한길관")}
              anchor={{ x : 0.25, y: 0.6 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.48889012284611}
              longitude={126.7778628375205}
              onTap={() => console.log("밀레니엄관")}
              anchor={{ x : 0.47, y: 0.7 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.49035674627899}
              longitude={126.77801638575652}
              onTap={() => console.log("예지관")}
              anchor={{ x : 0.25, y: 0.55 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.49055615469343}
              longitude={126.77865509020005}
              onTap={() => console.log("꿈집")}
              anchor={{ x : 0.05 , y: 0.35 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.49040470778797}
              longitude={126.7795431688615}
              onTap={() => console.log("공학관")}
              anchor={{ x : 0.1 , y: 0.4 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
            <NaverMapMarkerOverlay
              latitude={37.48865867527963}
              longitude={126.77936455767309}
              onTap={() => console.log("몽당기념관")}
              anchor={{ x : 0.3 , y: 0.5 }}
              caption={{
                text: 'hello',
              }}
              subCaption={{
                text: '123',
              }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
          </NaverMapView>   
        </View>
        <View style={styles.logoArea}>
          <Image style={styles.logo} source={bcuimage} />
          <Text style={styles.logoText}>(031-432-789)</Text>
        </View>
        {uniqueBuildingNames.map((buildingName, index) => (
          <View key={index}>
            <TouchableOpacity style={styles.infoArea} onPress={() => toggleInfoDataVisibility(buildingName)}>
              <Text style={styles.infoText}>{buildingName}</Text>
            </TouchableOpacity>
            {/* 건물 이름을 클릭한 경우 해당 건물에 속한 학과 목록 표시 */}
            {visibleBuilding === buildingName && (
              <View style={styles.infodata}>
                <Table borderStyle={{ borderWidth: 1, borderColor: tableBorderColor }}>
                  <Row
                    data={info_data_head}
                    style={{ height: 40, backgroundColor: "#dddddd" }}
                    textStyle={{ textAlign: "center", fontWeight: "bold", color: 'black' }}
                    widthArr={widthArrs}
                  />
                  {/* 건물에 속한 학과 목록 표시 */}
                  {renderDepartmentList(buildingName)}
                </Table>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      <View style={styles.bottomArea}></View>
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
