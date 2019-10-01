import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { axiosLocal } from './log-in-screen';

const styles = StyleSheet.create({
    title: {
        marginTop: '20%',
        textAlign: 'center',
        fontSize: 50,
        marginBottom: '75%',
        flexDirection: 'row',
    },
    yellowButton: {
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 50,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderColor: '#fbc074',
        backgroundColor: '#fbc074',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    whiteButton: {
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 50,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderColor: '#fbc074',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    buttonBox: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: '5%',
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

// Welcome screen to go to login and sign in
export default function WelcomeScreen({ navigation }) {
    const { navigate } = navigation;

    useEffect(() => {
        async function rememberLogin() {
            ToastAndroid.show('Retrieving stored credentials', ToastAndroid.SHORT);
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            if (await axiosLocal({email, password})) {
                ToastAndroid.show('Successfully logged in with stored credentials', ToastAndroid.SHORT);
                navigate('Home');
            } else {
                alert('Stored credentials are no longer valid, please log in again');
            }
        }
        rememberLogin();
    });

    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>mementos</Text>
                <View style={styles.buttonBox}>
                    <TouchableOpacity onPress={() => navigate('SignUp1')}>
                        <View style={styles.yellowButton}>
                            <Text style={styles.buttonText}>I am a new user </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigate('Login')}>
                        <View style={styles.whiteButton}>
                            <Text style={styles.buttonText}>I am an existing user</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}