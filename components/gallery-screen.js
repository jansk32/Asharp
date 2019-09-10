import React, { useState, useEffect } from 'react';
import { Text, StyleSheet,View } from 'react-native';


export default function GalleryScreen() {
    return (
    <View style={styles.container}>
        <Text style={styles.header}>Memories left behind</Text>
    </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 10
    },
    header: {
      fontSize: 20,
      textAlign:'center'
    }
  })
  

GalleryScreen.navigationOptions = {
    title: 'Gallery'
};