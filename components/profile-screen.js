import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';


export default function ProfileScreen() {
    return (
        <>
            <Text style={{ fontSize: 42 }}>This is the profile screen</Text>
        </>
    );
}

ProfileScreen.navigationOptions = {
    title: 'Profile'
};