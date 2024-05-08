import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const FullScreenCamera = ({navigation}: any) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const device = useCameraDevice('back'); // 후면 카메라를 사용하도록 가정합니다.

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      navigation.navigate('AttendanceScreen', { scannedCode: codes[0] });
      
    }
  })
  return (
    <View style={{ flex: 1 }}>
      {/* 전체 화면 카메라 표시 */}
      {isCameraActive && device && (
        <Camera
          style={{ flex: 1 }} // 화면을 꽉 채우도록 스타일을 지정합니다.
          device={device}
          photo={true}
          video={false}
          audio={false}
          isActive={true}
          codeScanner={codeScanner}
          // 필요한 경우에 따라 다른 속성을 추가할 수 있습니다.
        />
      )}
      
      {/* 닫기 버튼 */}
      <TouchableOpacity
        style={{ position: 'absolute', top: 20, right: 20 }}
        onPress={() => {
          setIsCameraActive(false);
          navigation.navigate('AttendanceScreen');
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FullScreenCamera;