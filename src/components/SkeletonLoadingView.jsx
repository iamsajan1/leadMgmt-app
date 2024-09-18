import { View, Text } from 'react-native'
import React from 'react'
import SkeletonPlaceholder from 'react-native-skeleton-placeholder'
import { styles } from '../styles/Stylesheet'

const SkeletonLoadingView = () => {
  return (<SkeletonPlaceholder>
        <SkeletonPlaceholder.Item width={150} height={20} borderRadius={4} />
    </SkeletonPlaceholder>
  )
}
export default SkeletonLoadingView