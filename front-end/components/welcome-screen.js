import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ToastAndroid, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { axiosLocal } from './log-in-screen';


// Welcome screen to go to login and sign in
export default function WelcomeScreen({ navigation }) {
    const { navigate } = navigation;
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        async function rememberLogin() {
            const email = await AsyncStorage.getItem('email');
            const password = await AsyncStorage.getItem('password');
            // Check if both email and password were stored previously before sending request
            if (email && password && await axiosLocal({ email, password }) === 200) {
                ToastAndroid.show('Successfully logged in with stored credentials', ToastAndroid.SHORT);
                navigate('Home');
            } else {
                // Email and password are invalid, clear them
                AsyncStorage.multiRemove(['email', 'password']);
                setLoading(false);
            }
        }
        rememberLogin();
    }, []);

    return (
        <View style={styles.container}>
            <Image style={styles.title} source={require('../TEXT.png')} />
            <Image style={styles.image}
                source={require('../reverse-icon.png')} />
            {
                !isLoading &&
                (
                    <View style={styles.buttonBox}>
                        <TouchableOpacity onPress={() => navigate('SignUp1')}>
                            <LinearGradient colors={['#06beb6', '#48b1bf']} style={styles.yellowButton}>
                                <Text style={styles.buttonText}>I am a new user </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigate('Login')}>
                            <View style={styles.whiteButton}>
                                <Text style={styles.buttonText2}>I am an existing user</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        marginTop: 60,
        marginBottom: 50,
        width: 300,
        height: 60,
        alignSelf: 'center'
    },
    image: {
        width: Dimensions.get('window').width / 1.5,
        height: Dimensions.get('window').width / 1.5,
        alignSelf: 'center',
        justifyContent: 'center',
        marginBottom: 0,
        marginTop: 20,
    },
    yellowButton: {
        textAlign: 'center',
        borderRadius: 50,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop:50
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
        marginTop:20
    },
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    buttonBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 30,
    },
    buttonText: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: 'white',
    },
    buttonText2: {
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: 'black',
    },
});
