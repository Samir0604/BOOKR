import { View, Text, Modal } from 'react-native'
import React from 'react'

export default function BookModal({isOpen, children, ...rest}) {
  return (
    <Modal
    visible = {isOpen}
    transparent
    animationType='fade'
    statusBarTranslucent
    {...rest}
    >

        <View
        className='items-center justify-center flex-1 px-3 bg-blue-500'
        >{children}</View>


    </Modal>
  )
}