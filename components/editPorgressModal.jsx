import { View, Modal } from 'react-native'
import React from 'react'

export default function EditProgressModal({isOpen, children}) {
  return (
    <Modal
    visible= {isOpen}
    transparent
    animationType='fade'
    >
        <View className='flex-1 items-center justify-end mb-[90px]'>
            {children}
        </View>

    </Modal>
  )
}