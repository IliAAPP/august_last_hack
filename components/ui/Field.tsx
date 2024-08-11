import { View, Text, TextInput } from 'react-native'
import React, { FC } from 'react'
import tw from 'twrnc'

interface IFiled {
    onChange: (val: string) => void
    val: string
    placeholder: string
    isSecure?: boolean
}

const Field:FC<IFiled>  = ({onChange, val, placeholder, isSecure}) => {
  return (
    <TextInput
    showSoftInputOnFocus={true}
    placeholder={placeholder}
    value={val}
    onChangeText={onChange}
    secureTextEntry={isSecure}
    autoCapitalize='none'
    style={tw`rounded-xl bg-gray-100 mt-3 p-3 w-full`}
    />
  )
}

export default Field