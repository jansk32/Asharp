import React, { useState, useEffect, Component } from 'react';
import { View, PanResponder, Dimensions, ToastAndroid, TextInput, StyleSheet, Text, Alert, ActivityIndicator, } from 'react-native';
import axios from 'axios';

export default function LoadingScreen({ isLoading, navigation }) {
    return(
        <>  
        <View style={styles.container}>
            <ActivityIndicator size={50} color="#EC6268" />
            <Text style={styles.text}>Sending Artefact</Text>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        textAlignVertical:'center',
        flex:1,
    },
    text:{
        fontSize: 20,
        fontWeight:'bold',
        justifyContent:'center',
        alignSelf:'center',
        marginTop: 10,

    },
});


