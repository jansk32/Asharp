import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { axiosLocal } from './log-in-screen';

const styles = StyleSheet.create({
    title: {
        marginTop: 60,
        marginBottom: 50,
        width: 300,
        height: 60,
        alignSelf:'center'
    },
    image: {
        width: Dimensions.get('window').width /1.5, 
        height: Dimensions.get('window').width /1.5,
        alignSelf: 'center',
        justifyContent:'center',
        marginBottom: 50,
        marginTop: 20,
    },
    yellowButton: {
        textAlign: 'center',
        // borderWidth: 1,
        borderRadius: 50,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        // borderColor: '#fbc074',
        // backgroundColor: '#fbc074',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    whiteButton: {
        textAlign: 'center',
        borderWidth: 1,
        borderRadius: 50,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderColor: '#579B93',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    buttonBox: {
        // backgroundColor: 'white',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 30,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor:'transparent',
        color:'white',
    },
    buttonText2: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor:'transparent',
        color:'black',
    },
});

// Welcome screen to go to login and sign in
export default function WelcomeScreen({ navigation }) {
    const { navigate } = navigation;
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function rememberLogin() {
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            // Check if both email and password were stored previously before sending request
            if (email && password && await axiosLocal({ email, password })) {
                ToastAndroid.show('Successfully logged in with stored credentials', ToastAndroid.SHORT);
                navigate('Home');
            } else {
                setLoading(false);
            }
        }
        rememberLogin();
    }, []);

    return (
        <>
            <View style={styles.container}>
                <Image style={styles.title} source={require('../TEXT.png')}/>
                <Image style={styles.image}
                source={require('../reverse-icon.png')}/>
                {
                    !isLoading &&
                    (   
                        <View style = {styles.buttonBox}>
                        <TouchableOpacity onPress={() => navigate('SignUp1')}>
                            <LinearGradient colors={['#06beb6', '#48b1bf']} style={styles.yellowButton}>

                            {/* <View style={styles.yellowButton}> */}
                                <Text style={styles.buttonText}>I am a new user </Text>
                            {/* </View> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    



                            
                            <TouchableOpacity onPress={() => navigate('Login')}>
                            <View style={styles.whiteButton}>

                                {/* <View style={styles.whiteButton}> */}
                                    <Text style={styles.buttonText2}>I am an existing user</Text>
                                {/* </View> */}
                                </View>

                            </TouchableOpacity>

                        </View>
                    )
                }
            </View>
        </>
    );
}