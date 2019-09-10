import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, StyleSheet, View, Image } from 'react-native';

const styles = StyleSheet.create({
    profileBox: {
        backgroundColor: '#fff',
        flex: 1/4,
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        textAlign: 'center',
        paddingTop: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 125,
        marginTop: 14,
        marginLeft: 14,
        marginRight: 10,
        marginBottom: 5,
    },
    textBox: {
        // backgroundColor: 'blue',
        flex: 1,
        padding: 8,
        marginLeft: 10,
        justifyContent: "center",
        alignSelf: 'center',
    },
    settingBox: {
        flex: 1/10,
        backgroundColor: '#fff',
        paddingBottom: 5,
    },
    settingButton: {
        backgroundColor: '#fff',
        borderColor: '#F2F2F2',
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        paddingRight: 20,
        paddingLeft: 20,
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        borderBottomLeftRadius: 100,
        borderBottomRightRadius: 100,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    nameText: {
        fontSize: 16,
        justifyContent: 'space-around',
    },
    artefactsBox: {
        backgroundColor: '#fff',
        borderTopColor: '#585858',
        borderTopWidth: 1,
        padding: 20,

    },
})

export default function ProfileScreen() {
    const [profile, setProfile] = useState('');

    useEffect(() => {
        console.log('Sending request');
        axios.get('http://localhost:3000/user')
        .then((res) => {
            // setProfile(resp);
            console.log(res);
            // console.log('FOUND');
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <>
            <React.Fragment>
                <View style={styles.profileBox}>
                    <Image 
                        source={require('../tim_derp.jpg')} 
                        style={styles.image}
                    />
                    <View style={styles.textBox}>
                        <Text style = {styles.nameText}>Name: 'insert name here'</Text>
                        <Text style = {styles.nameText}>Date of Birth: 'insert DOB'</Text>
                    </View>
                </View>
                <View style={styles.settingBox}>
                    <View style={styles.settingButton}>
                        <Text style = {styles.nameText}>Profile Setting</Text>
                    </View>  
                </View>
                <View style={styles.artefactsBox}>
                    <Text style = {styles.nameText}>My Artefacts</Text>
                </View>
            </React.Fragment>
        </>
    );
}

// ProfileScreen.navigationOptions = {
//     title: 'Profile'
// };