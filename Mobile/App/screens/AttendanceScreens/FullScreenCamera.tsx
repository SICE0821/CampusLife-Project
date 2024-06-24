import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const FullScreenCamera = ({ navigation } : any) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const device = useCameraDevice('back'); // 후면 카메라를 사용하도록 가정

  const isValidQRCode = (code : string) => {
    /*
    // 현재 날짜와 시간을 포함하는 정규식 패턴 생성
    const now = new Date();
    const currentSeconds = now.getSeconds();
    const tolerance = 1; // 1초의 유예 시간

    for (let i = -tolerance; i <= tolerance; i++) {
      const seconds = currentSeconds + i;
      
      // 초가 60을 넘어갈 경우 분에 반영하고 초를 조정
      const adjustedSeconds = seconds >= 60 ? seconds - 60 : (seconds < 0 ? seconds + 60 : seconds);
      const adjustedDate = new Date(now.getTime());
      adjustedDate.setSeconds(adjustedSeconds);
      
      const timestamp = `${adjustedDate.getFullYear()}-${(adjustedDate.getMonth() + 1).toString().padStart(2, '0')}-${adjustedDate.getDate().toString().padStart(2, '0')} ${adjustedDate.getHours().toString().padStart(2, '0')}:${adjustedDate.getMinutes().toString().padStart(2, '0')}:${adjustedDate.getSeconds().toString().padStart(2, '0')}`;
      const regex = new RegExp(`^myApp_${timestamp}$`);
      
      if (regex.test(code)) {
        return true;
      }
    }
    return false;
    */
    return code.startsWith("myApp_");
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (!hasScanned) {
        setHasScanned(true);
        //console.log("인식된 QR 코드 목록:", codes);
        const validQRCode = codes.find(code => code.value && isValidQRCode(code.value));
        if (validQRCode) {
          //console.log("유효한 QR 코드입니다 : ", validQRCode.value);
          navigation.navigate('AttendanceScreen', { scannedCode: validQRCode.value });
        } else {
          Alert.alert("허용되지 않은 QR 코드입니다.");
          navigation.goBack();
        }
        setIsCameraActive(false); // QR 코드 스캔 후 카메라 비활성화
      }
    },
  });
  
  useEffect(() => {
    setHasScanned(false); // Reset the scan state when the component mounts
  }, []);

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
          navigation.navigate('AttendanceScreen');
          setIsCameraActive(false); // 닫기 버튼을 누를 때 카메라 비활성화
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FullScreenCamera;
