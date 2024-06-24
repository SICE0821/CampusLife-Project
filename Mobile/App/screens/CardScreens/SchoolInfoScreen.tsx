import React, { useState, useEffect, useRef } from 'react';
import { Dimensions, Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Table, Row, Rows } from "react-native-table-component";
import { Picker } from '@react-native-picker/picker';
import { NaverMapView, Camera, NaverMapMarkerOverlay } from "@mj-studio/react-native-naver-map";
import IconA from 'react-native-vector-icons/FontAwesome6';
import config from '../../config';

const width = Dimensions.get("window").width * 0.98;

export type SchoolData = {
  department_name: string,
  campus_name: string,
  department_phone: string,
  department_floor: string,
  department_building: string
};

export type SchoolBuildingData = {
  building_name: string,
  campus_place: string,
  latitude: string,
  longitude: string,
};

const info_data_head = ["층", "학과", "학과 사무실 전화번호"];
const widthArrs = [width * 0.2, width * 0.4, width * 0.4];
const tableBorderColor = 'gray';

const SchoolInfoScreen = () => {
  const [visibleBuilding, setVisibleBuilding] = useState<string | null>(null);
  const [schoolData, setSchoolData] = useState<SchoolData[]>([]);
  const [schoolBuildingData, setSchoolBuildingData] = useState<SchoolBuildingData[]>([]);
  const [selectedCampus, setSelectedCampus] = useState('본캠퍼스');
  const [filteredBuildings, setFilteredBuildings] = useState<SchoolBuildingData[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);
  const buildingRefs = useRef<{ [key: string]: View | null }>({});

  const toggleInfoDataVisibility = (buildingName: string) => {
    setVisibleBuilding((prev) => (prev === buildingName ? null : buildingName));
    if (buildingRefs.current[buildingName]) {
      buildingRefs.current[buildingName]?.measureLayout(
        scrollViewRef.current as unknown as number,
        (x, y, width, height) => {
          (scrollViewRef.current as unknown as ScrollView)?.scrollTo({ y: y - 10, animated: true });
        },
      );
    }
  };

  const fetchSchoolData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getSchoolInfo`);
      if (!response.ok) throw new Error('서버 응답 실패');
      const data = await response.json();
      setSchoolData(data);
    } catch (error) {
      //console.error('학교 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const fetchSchoolBuildingData = async () => {
    try {
      const response = await fetch(`${config.serverUrl}/getSchoolBuildingInfo`);
      if (!response.ok) throw new Error('서버 응답 실패');
      const data = await response.json();
      setSchoolBuildingData(data);
    } catch (error) {
      //console.error('학교 건물 정보를 가져오는 중 오류 발생:', error);
    }
  };

  const renderDepartmentList = (buildingName: string) => (
    schoolData
      .filter(item => item.department_building === buildingName)
      .sort((a, b) => parseInt(a.department_floor) - parseInt(b.department_floor))
      .map((item, idx) => (
        <Rows
          key={idx}
          data={[[item.department_floor, item.department_name, item.department_phone]]}
          style={{ width, height: 40 }}
          textStyle={{ textAlign: "center", fontWeight: 'bold', color: 'black' }}
          widthArr={widthArrs}
        />
      ))
  );

  useEffect(() => {
    fetchSchoolData();
    fetchSchoolBuildingData();
  }, []);

  useEffect(() => {
    const filtered = schoolBuildingData.filter(
      building => building.campus_place === selectedCampus && building.building_name !== building.campus_place
    );
    setFilteredBuildings(filtered);
  }, [schoolBuildingData, selectedCampus]);

  const handleCampusChange = (itemValue: string) => {
    setSelectedCampus(itemValue);
    setCamera(itemValue === '본캠퍼스' ? Cameras.campus : Cameras.sosaCampus);
  };

  const Cameras = {
    campus: {
      latitude: 37.48943025,
      longitude: 126.77881105,
      zoom: 16.5,
    },
    sosaCampus: {
      latitude: 37.4635299631291,
      longitude: 126.8038623428179,
      zoom: 16.5,
    },
  };

  const [camera, setCamera] = useState<Camera>(Cameras.campus);

  return (
    <View style={styles.container}>
      <ScrollView ref={scrollViewRef}>
        <NaverMapView style={styles.map} camera={camera}>
          {filteredBuildings.map((building, index) => (
            <NaverMapMarkerOverlay
              key={index}
              latitude={parseFloat(building.latitude)}
              longitude={parseFloat(building.longitude)}
              onTap={() => toggleInfoDataVisibility(building.building_name)}
              anchor={{ x: 0.3, y: 0.5 }}
              caption={{ text: building.building_name }}
              subCaption={{ text: building.campus_place }}
              width={32}
              height={32}
            >
              <IconA name="location-dot" size={32} color="black" />
            </NaverMapMarkerOverlay>
          ))}
        </NaverMapView>
        <View style={{ marginTop: 5, 
          position: 'absolute', 
          alignSelf: 'flex-end',
          borderWidth: 1, 
          elevation: 5, 
          right: 5,
          borderColor: 'gray'}}>
          <Picker
          selectedValue={selectedCampus}
          style={{ height: 50, width: 170, color: 'black', backgroundColor: '#ffffff' }}
          onValueChange={handleCampusChange}
          dropdownIconColor={'black'}
        >
          <Picker.Item label="본캠퍼스" value="본캠퍼스" />
          <Picker.Item label="소사캠퍼스" value="소사캠퍼스" />
        </Picker>
        </View>
        
        {filteredBuildings.map((building, index) => (
          <View
            key={index}
            ref={(el) => { buildingRefs.current[building.building_name] = el; }}
          >
            <TouchableOpacity style={styles.infoArea} onPress={() => toggleInfoDataVisibility(building.building_name)}>
              <Text style={styles.infoText}>{building.building_name}</Text>
            </TouchableOpacity>
            {visibleBuilding === building.building_name && (
              <View style={styles.infodata}>
                <Table borderStyle={{ borderWidth: 1, borderColor: tableBorderColor }}>
                  <Row
                    data={info_data_head}
                    style={{ height: 40, backgroundColor: "#dddddd" }}
                    textStyle={{ textAlign: "center", fontWeight: "bold", color: 'black' }}
                    widthArr={widthArrs}
                  />
                  {renderDepartmentList(building.building_name)}
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
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: 'black'
  },
  infodata: {
    alignSelf: 'center',
  },
});

export default SchoolInfoScreen;
