import React from 'react';
import LottieView from 'lottie-react-native';

const Dog = () => {
  return <LottieView
  source={require('../assets/Animation - 1725890615721.json')}
  autoPlay
  onAnimationFinish={() => console.log('애니메이션이 완료되었습니다')}
  loop
  style={{width : 300, height : 300}}
/>;;
};

export default Dog;