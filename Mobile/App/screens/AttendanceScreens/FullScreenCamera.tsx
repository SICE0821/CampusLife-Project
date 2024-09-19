import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

const FullScreenCamera: React.FC<any> = ({ navigation }) => {
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [hasScanned, setHasScanned] = useState(false);
  const [isDelayActive, setIsDelayActive] = useState(false); // 인식 지연 상태 관리
  const device = useCameraDevice('back');

  const isValidQRCode = (code: string): boolean => {
    return code.startsWith("CampusLife_");
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      if (isCameraActive && !hasScanned && !isDelayActive) {
        const validQRCode = codes.find(code => code.value && isValidQRCode(code.value));
        if (validQRCode) {
          setIsDelayActive(true);  // 인식 지연 상태 활성화

          // 1초 지연을 준 후에 실제로 QR 코드 처리
          setTimeout(() => {
            setHasScanned(true);
            setIsCameraActive(false); // 카메라 비활성화
            navigation.navigate('AttendanceScreen', { scannedCode: validQRCode.value });
            setIsDelayActive(false);  // 지연 상태 초기화
          }, 1500);  // 1000ms = 1초

        } else {
          Alert.alert("허용되지 않은 QR 코드입니다.");
          navigation.goBack();
        }
      }
    },
  });

  // 컴포넌트가 마운트될 때 스캔 상태 초기화
  useEffect(() => {
    setHasScanned(false);
    return () => {
      setIsCameraActive(false); // 컴포넌트 언마운트 시 카메라 비활성화
    };
  }, []);

  useEffect(() => {
    if (hasScanned) {
      setIsCameraActive(false); // 스캔 완료 시 카메라 비활성화
    }
  }, [hasScanned]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: 'black', width: '100%', height: 40, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: '15%', alignItems: 'center',  }}></View>
        <View style={{ width: '70%', alignItems: 'center',  }}>
          <Text style={{ color: 'white', fontSize: 20 }}>출석체크</Text>
        </View>
        <TouchableOpacity
          style={{ width: '15%', alignItems: 'center' }}
          onPress={() => {
            setIsCameraActive(false); // 카메라 비활성화
            navigation.navigate('AttendanceScreen', { scannedCode: null });
          }}
        >
          <Text style={{ color: 'white', fontSize: 20 }}>닫기</Text>
        </TouchableOpacity>
      </View>
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

      {/* 중앙에 흰색 네모 추가 */}
      <View style={styles.scannerFrame}>
        <View style={styles.scannerBox} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  scannerFrame: {
    position: 'absolute',
    top: '30%', // 화면 중앙에 위치시키기 위해 조정
    left: '20%',
    right: '20%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerBox: {
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'white',
    borderRadius: 10,
  }
});

export default FullScreenCamera;
