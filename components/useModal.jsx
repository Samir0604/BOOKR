// hooks/useModal.js
import { useRef, useState } from 'react';
import { Animated, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const useModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [bookIndex, setBookIndex] = useState(0);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const openModal = (index) => {
    setModalVisible(true);
    setBookIndex(index);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  return {
    modalVisible,
    bookIndex,
    slideAnim,
    scaleAnim,
    openModal,
    closeModal
  };
};
