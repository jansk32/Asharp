import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default function WelcomeScreen({navigation}) {
    const { navigate } = navigation;
    return (
        <>
        <View style = {styles.container}>
            <Text style={ styles.title }>mementos</Text>
            {/* <Icon name="camera" size={30} color="black" /> */}
            <TouchableOpacity onPress={() => navigate('SignUp1')}>
                <Text style={styles.signInButton}>
                    I am a new user
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigate('Login')}>
                <Text style={styles.loginButton}>
                    I am an existing user
                </Text>
            </TouchableOpacity>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    title:{
        marginTop: '20%',
        textAlign: 'center',
        fontSize: 50
    },
    signInButton: {
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 50,
        width: '50%',
        padding: 15,
        borderColor: '#fbc074',
        backgroundColor: '#fbc074',
        marginLeft: '20%',
        marginTop: '80%',

    },
    loginButton:{
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 50,
        width:'50%',
        padding: 15,
        borderColor:'#fbc074', 
        backgroundColor: 'white', 
        marginLeft:'20%',
        marginTop: '10%',
        marginBottom:'30%',

    },
    container:{
        backgroundColor:'white',
        flex:1,
    }
})