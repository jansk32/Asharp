import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker,
} from 'react-native';

// Importing all existing screens for navigation
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
import AddImageDetailsScreen from './components/add-image-details-screen';

// Import react navigation tools.
import {
	createBottomTabNavigator,
	createAppContainer,
	createSwitchNavigator,
	createStackNavigator,
} from 'react-navigation';

var tintColor = 'black';
// Import icons
import Icon from 'react-native-vector-icons/Ionicons';
const icons = 
	{	timelineIcon:<Icon name="md-hourglass" color={tintColor} size={30} />,
		familyTreeIcon: <Icon name="md-airplane" color={tintColor} size={30} />,
		uploadIcon: <Icon name="md-add" color={tintColor} size={30} />,
		galleryIcon: <Icon name="md-images" color={tintColor} size={30} />,
		profileIcon :<Icon name="md-person" color={tintColor} size={30} />,
	};

// Import firebase.
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
	
	Timeline: { 
		screen: TimelineScreen,
		navigationOptions: {
			tabBarIcon: ({tintColor}) => <Icon name="md-hourglass" color={tintColor} size={30} />
		}, 
	},
	FamilyTree: { 
		screen: FamilyTreeScreen,
		navigationOptions: {
			tabBarIcon: ({tintColor}) => <Icon name="md-leaf" color={tintColor} size={30} />
		},
	 },
	Home: { 
		screen: HomeScreen,
		navigationOptions: {
			tabBarIcon: ({tintColor}) => <Icon name="md-add" color={tintColor} size={30} />
		},
	 },
	Gallery: { 
		screen: GalleryScreen,
		navigationOptions: {
			tabBarIcon: ({tintColor}) => <Icon name="md-images" color={tintColor} size={30} />
		},
	},
	Profile: {
		screen: ProfileScreen,
		navigationOptions: {
			tabBarIcon: ({tintColor}) => <Icon name="md-person" color={tintColor} size={30} />
		},
	},
},
	{
		initialRouteName: 'Home',
		tabBarOptions: {
			activeTintColor: 'white',
			inactiveTintColor: 'black',
			showLabel: false,
			showIcon: true,
			style: {
				backgroundColor: '#47B39D',
			}
		},
		navigationOptions: {
			header: null,
		},
	},
);

const uploadArtefactStack = createStackNavigator({
	MainNavigator,
	AddImageDetails: { screen: AddImageDetailsScreen },
});

const SignUpStack = createStackNavigator({
	SignUp1: { screen: SignUp1 },
	SignUp2: {
		screen: SignUp2,
		navigationOptions: ({ navigation }) => ({
			title: 'Enter details',
			headerTitleStyle: { color: '#EC6268' },
		}),
	},
	SignUp3: {
		screen: SignUp3,
		navigationOptions: ({ navigation }) => ({
			title: 'Choose profile picture!',
			headerTitleStyle: { color: '#EC6268' }
		}),
	},
});

const Stack = createSwitchNavigator({
	Welcome: { screen: WelcomeScreen },
	Login: { screen: Login },
	SignUpStack,
	MainNavigator,
	uploadArtefactStack,
});

const App = createAppContainer(Stack);

export default App;