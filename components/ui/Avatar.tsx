import { View, Text } from 'react-native'
import React, { FC } from 'react'
import tw from 'twrnc'

interface Avatar {
    children?: React.ReactNode,
    name?: string | null,
    size?: 'small' | 'large'
}


const Avatar:FC<Avatar> = ({name, size = 'small'}) => {
    const isSmall = size ==='small'

    return (
        <View style={tw`rounded-full bg-gray-300 ${isSmall ? 'w-9 h-9 mr-3' : 'w-12 h-12'} items-center justify-center`}>
            <Text style={tw`text-white ${isSmall? 'text-lg' : 'text-xl'} font-medium`}>{name?.slice(0,1)}</Text>
        </View>
    )
    }

export default Avatar