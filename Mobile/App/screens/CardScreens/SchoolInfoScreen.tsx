import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { NaverMapView, NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import IconA from 'react-native-vector-icons/FontAwesome6';
import { Picker } from '@react-native-picker/picker';

export type SchoolData = {
  department_name: string,
  campus_name: string,
  campus_place: string,
  department_phone: string,
  department_floor: string,
  department_building: string
}

const width = Dimensions.get("window").width * 0.98;

const bcuimage = require('../../assets/img-bcu-logo.png'); // 학교 로고

const info_data_head = ["층", "학과 홈페이지", "학과 사무실 전화번호"];

const widthArrs = [width * 0.2, width * 0.4, width * 0.4];
const tableBorderColor = 'gray';

const latitude = [ 37.48989698610115, 37.48937654643633, 37.48889012284611, 37.49035674627899, 37.49055615469343, 37.49040470778797, 37.48865867527963 ];
const longitude = [ 126.77785702906668, 126.77771746261125, 126.7778628375205, 126.77801638575652, 126.77865509020005, 126.7795431688615, 126.77936455767309 ];
const building = ['세미나관', '한길관', '밀레니엄관', '예지관', '꿈집', '공학관', '몽당기념관'];

const SchoolInfoScreen = () => {
  const [visibleBuilding, setVisibleBuilding] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleInfoDataVisibility = (buildingName: string) => {
    setVisibleBuilding((prev) => (prev === buildingName ? null : buildingName));
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 700, animated: true });
    }, 300); // Delay to allow state update to complete
  };

  const fetchSchoolData = async () => {
    try {
      const response = await fetch('http://192.168.35.83:3000/getSchoolInfo');
      if (!response.ok) {
        throw new Error('서버 응답 실패');
      }
      const data = await response.json();
      setSchoolData(data);
    } catch (error) {
      console.error('으아아아악데이터를 가져오는 중 오류 발생:', error);
    }
  };

  const renderDepartmentList = (buildingName: string) => {
    return (
      schoolData
        .filter(item => item.department_building === buildingName && item.campus_place === selectedCampus)
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
    setSelectedCampus("본캠퍼스"); // 초기에 본캠퍼스를 선택하도록 설정
    fetchSchoolData(); // 학교 데이터 가져오기
  }, []);
  
  const uniqueBuildingNames = [...new Set(schoolData
    .filter(item => item.campus_place === selectedCampus) // 선택된 캠퍼스에 해당하는 건물만 필터링
    .map(item => item.department_building))];
  
  // 중복되지 않는 캠퍼스 위치 목록 가져오기
  const campusPlaces = [...new Set(schoolData.map(item => item.campus_place))];

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <View>
          <NaverMapView
            style={styles.map}
            initialCamera={{
              latitude: 37.48943025,
              longitude: 126.77881105,
              zoom: 17,
            }}
          >
            {/* 지도 마커들 */}
            {building.map((buildingName, index) => (
              <NaverMapMarkerOverlay
                key={index}
                latitude={latitude[index]} // Use latitude array
                longitude={longitude[index]} // Use longitude array
                onTap={() => toggleInfoDataVisibility(buildingName)}
                anchor={{ x: 0.5, y: 1.0 }}
                caption={{
                  text: buildingName,
                  textSize: 14, // Change the text size
                  color: 'black', // Change the text color
                  
                }}
                subCaption={{
                  text: selectedCampus ?? "", 
                  textSize: 10,
                  color: 'gray'
                }}
                width={32}
                height={32}
              >
                <IconA name="location-dot" size={32} color="black" />
              </NaverMapMarkerOverlay>
            ))}
          </NaverMapView>
        </View>
        <View style={styles.logoArea}>
          <Image style={styles.logo} source={bcuimage} />
          <Text style={styles.logoText}>(031-432-789)</Text>
          {/* 캠퍼스 선택 Picker */}
          <Picker
            selectedValue={selectedCampus}
            onValueChange={(itemValue, itemIndex) => setSelectedCampus(itemValue)}
            style={{ width: '35%', alignSelf: 'center' }}
          >
            <Picker.Item label="본캠퍼스" value="본캠퍼스" />
            <Picker.Item label="소사캠퍼스" value="소사캠퍼스" />
          </Picker>
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
    flex: 1
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    marginLeft: 5,
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
});

export default SchoolInfoScreen;
