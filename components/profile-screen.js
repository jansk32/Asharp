import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

<<<<<<< Updated upstream
=======
const styles = StyleSheet.create({
    profileBox: {
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'space-around',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 125,
        marginBottom: 20,
    },
    nameText :{
        fontSize: 30,
        fontWeight: 'bold',
    }
})
>>>>>>> Stashed changes

export default function ProfileScreen() {
    return (
        <>
<<<<<<< Updated upstream
            <Text style={{ fontSize: 42 }}>This is the profile screen</Text>
=======
            <React.Fragment>
                <View style={styles.profileBox}>
                    <Image 
                        source={require('../tim_derp.jpg')} 
                        style={styles.image}
                    />
                    <Text style = {styles.nameText}>Your Name</Text>
                </View>
            </React.Fragment>
>>>>>>> Stashed changes
        </>
    );
}

ProfileScreen.navigationOptions = {
    title: 'Profile'
};