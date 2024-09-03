import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { StackNavigationProp } from '@react-navigation/stack';

const FullScreenCamera: React.FC<any> = ({ navigation }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const device = useCameraDevice('back');

  const isValidQRCode = (code: string): boolean => {
    return code.startsWith("myApp_");
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (!hasScanned) {
        setHasScanned(true);
        const validQRCode = codes.find(code => code.value && isValidQRCode(code.value));
        if (validQRCode) {
          setIsCameraActive(false);  // 네비게이션 전에 카메라 비활성화
          navigation.navigate('AttendanceScreen', { scannedCode: validQRCode.value });
        } else {
          Alert.alert("허용되지 않은 QR 코드입니다.");
          navigation.goBack();
        }
      }
    },
  });

  useEffect(() => {
    setHasScanned(false);
    return () => {
      setIsCameraActive(false); // 컴포넌트 언마운트 시 카메라 비활성화
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isCameraActive && device && (
        <Camera
          style={{ flex: 1 }}
          device={device}
          photo={true}
          video={false}
          audio={false}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}

      <TouchableOpacity
        style={{ position: 'absolute', top: 20, right: 20 }}
        onPress={() => {
          setIsCameraActive(false); // 카메라 비활성화
          navigation.navigate('AttendanceScreen');
        }}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};


export default FullScreenCamera;
