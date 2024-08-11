import { View, Text } from 'react-native'
import React, { FC } from 'react'
import tw from 'twrnc'

const Padding:FC <{children: React.ReactNode,style?: any}> = ({children, style={}}) => {
  return (
    <View style={{...tw`px-4`, ...style}}>
      {children}
    </View>
  )
}

export default Padding