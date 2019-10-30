import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Platform } from 'react-native';


export default function LoadingScreen({ navigation }) {
    const { loadingMessage, task } = navigation.state.params;

    useEffect(() => {
        task();
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size={Platform.OS === 'android' ? 50 : 'large'} color="#EC6268" />
            <Text style={styles.text}>{loadingMessage}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        flex: 1,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 10,
    },
});