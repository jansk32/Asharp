import React, { useState, useEffect } from 'react';
import { Text, Image, View, StyleSheet, Button, TouchableHighlight, TouchableOpacity } from 'react-native';



export default function ItemDetailScreen({navigation}) {

    const {navigate} = navigation;

    return(
        <>
            <View style={styles.container}>
                <Text></Text>
                <Image
                    style={styles.image} 
                    source={require('../tim_derp.jpg')}
                />
                <Text>Name: </Text>
                <Text>Date: </Text>
                <Text>Owner: </Text>
                <Text>Value: </Text>
                <Text>Description: </Text>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    image:{
        width: 350,
        height:350
    },
    container:{
        flex: 1, 
        alignItems: "center", 
        justifyContent: "center" 
    }
})

