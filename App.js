import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';

import HomeScreen from './components/home-screen';
import FamilyTreeScreen from './components/family-tree-screen';
import ProfileScreen from './components/profile-screen';
import TimelineScreen from './components/timeline-screen';
import GalleryScreen from './components/gallery-screen';
import WelcomeScreen from './components/welcome-screen';
import Login from './components/log-in-screen';
import SignUp1 from './components/sign-up1-screen';
import SignUp2 from './components/sign-up2-screen';
import SignUp3 from './components/sign-up3-screen';


import { createBottomTabNavigator, 
	createAppContainer, 
	createSwitchNavigator, 
	createStackNavigator,
	NavigationScreenOption, } from 'react-navigation';
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

const MainNavigator = createBottomTabNavigator({
	Timeline: { screen: TimelineScreen },
	FamilyTree: {screen: FamilyTreeScreen},
	Home: { screen: HomeScreen },
	Gallery: { screen: GalleryScreen },
	Profile: { screen: ProfileScreen },
	},
    {
		initialRouteName: 'Home',
        tabBarOptions: {
            activeTintColor: 'white',
            inactiveTintColor: 'black',
            showLabel: true,
            showIcon: false,
            style: {
				backgroundColor: '#47B39D',
            }
        }
    }

);

const SignUpStack = createStackNavigator({
	SignUp1:{screen:SignUp1},
	SignUp2:{screen:SignUp2},
	SignUp3:{screen:SignUp3},

})

const Stack = createSwitchNavigator({
	Welcome: {screen: WelcomeScreen},
	Login: { screen: Login },
	SignUpStack,
	MainNavigator,
})

const App = createAppContainer(Stack);

// export default RootSwitch;
export default App;