import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';

import HomeScreen from './components/home-screen';
import FamilyTreeScreen from './components/family-tree-screen';
import ProfileScreen from './components/profile-screen';

import { createStackNavigator, createAppContainer } from 'react-navigation';
import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
	apiKey: "AIzaSyC4JLE-2HExIPeHTFE0QZmOt7f6koxTqsE",
	authDomain: "mementos-7bca9.firebaseapp.com",
	databaseURL: "https://mementos-7bca9.firebaseio.com",
	projectId: "mementos-7bca9",
	storageBucket: "gs://mementos-7bca9.appspot.com/",
	messagingSenderId: "657679581397",
	appId: "1:657679581397:web:6dbc92e3aa881c59"
};
firebase.initializeApp(firebaseConfig);

// TODO: make home screen the first screen after testing family tree screen
const MainNavigator = createStackNavigator({
	FamilyTree: {screen: FamilyTreeScreen},
	Home: { screen: HomeScreen },
	Profile: { screen: ProfileScreen },
});

const App = createAppContainer(MainNavigator);

export default App;