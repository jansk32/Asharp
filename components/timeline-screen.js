import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';


export default function TimelineScreen() {
    return (
        <>
            <Text style={{ fontSize: 42 }}>This is the timeline screen</Text>
        </>
    );
}

TimelineScreen.navigationOptions = {
    title: 'Timeline'
};