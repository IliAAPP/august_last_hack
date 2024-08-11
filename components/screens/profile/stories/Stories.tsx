import { View, Text } from 'react-native'
import React, { FC } from 'react'
import { useStories } from './useStories'

const Stories: FC = () => {
    const {} = useStories()

  return (
    <View>
      <Text>Stories</Text>
    </View>
  )
}

export default Stories