import { View, Modal, Keyboard, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BlurView } from 'expo-blur';

export default function EditProgressModal({isOpen, children}) {
  const [showKeyboardBlur, setShowKeyboardBlur] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setShowKeyboardBlur(true)
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        // Verzögere das Ausblenden des Blurs leicht, damit das Modal Zeit hat sich zu positionieren
        setTimeout(() => setShowKeyboardBlur(false), 252);
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
    >
      <View className='flex-1 items-center justify-end mb-[90px]'>
        {children}
        {/* Zusätzlicher BlurView nur für den Bereich unter dem Modal */}
        {showKeyboardBlur && (
  <BlurView 
    intensity={50} 
    tint="light" 
    className="overflow-hidden rounded-lg w-full"
    style={{
      position: 'absolute',
      bottom: -90,
      left: 0,
      right: 0,
      height: 400,
      zIndex: -1,
      backgroundColor: 'rgba(255, 255, 255, 1)'
        }}
  >
    <View className='p-6 w-full bg-white flex flex-col'>
      
    </View>
  </BlurView>
)}
      </View>
    </Modal>
  )
}
