import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';


export default function WelcomeScreen({navigation}) {
    const { navigate } = navigation;
    return (
        <>
            <Text style={{ fontSize: 42 }}>mementos</Text>
            <Button
				title="Login"
				onPress={() => {
					navigate('Login');
				}} />
            <Button
				title="Sign in"
				onPress={() => {
					navigate('Sign In');
				}} />
        </>
    );
}

const styles = StyleSheet.create({})