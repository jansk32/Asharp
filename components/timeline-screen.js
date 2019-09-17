import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, FlatList, View, Image } from 'react-native';

export default function TimelineScreen() {
    const [mementos, setMementos] = useState([...Array(10).keys()].map(el => ({ id: el, name: 'item' + el })));
    return (
        <>
            <Text style={{ fontSize: 42 }}>Timeline</Text>
            <FlatList
                data={mementos}
                renderItem={({ item }) => <TimelineCard memento={item} />}
                keyExtractor={item => item.id.toString()}
            />
        </>
    );
}

function TimelineCard({ memento }) {
    return (
        <View style={{ backgroundColor: 'thistle', margin: 10, height: 400 }}>
            <Text style={{ fontSize: 30 }}>{memento.name}</Text>
            <Image source={require('../tim_derp.jpg')} style={{ height: 200, width: 200 }} />
        </View>
    );
}

TimelineScreen.navigationOptions = {
    title: 'Timeline'
};