import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../constants/colors.js'

export default function Safescreen({ children }) {
    const insets = useSafeAreaInsets();
     
  return <View style={[ styles.container, { paddingTop: insets.top } ]}>{ children }</View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    }
})