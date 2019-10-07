import React from 'react';
// Importing all existing screens for navigation
import HomeScreen from './components/home-screen';
import FamilyTreeScreen from './components/family-tree-screen';
import ProfileScreen from './components/profile-screen';
import TimelineScreen from './components/timeline-screen';
import GalleryScreen from './components/gallery-screen';
import ItemDetailScreen from './components/item-detail-screen';
import WelcomeScreen from './components/welcome-screen';
import Login from './components/log-in-screen';
import SignUp1 from './components/sign-up1-screen';
import SignUp2 from './components/sign-up2-screen';
import SignUp3 from './components/sign-up3-screen';
import AddImageDetailsScreen from './components/add-image-details-screen';

import { MenuProvider } from 'react-native-popup-menu';

import AddFamilyMemberScreen from './components/add-family-member-screen';
import ViewFamilyMemberScreen from './components/view-family-member-screen';
// Import react navigation tools
import {
	createBottomTabNavigator,
	createAppContainer,
	createSwitchNavigator,
	createStackNavigator,
} from 'react-navigation';

// Import icons
import Icon from 'react-native-vector-icons/Ionicons';

// Import Firebase.
import * as firebase from 'firebase';
import { Dimensions } from 'react-native';
import LoginScreen from './components/sign-up1-screen';

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

// Main bottom tab navigator to navigate the main functionalities of the application
const MainNavigator = createBottomTabNavigator({
	Timeline: {
		screen: TimelineScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-hourglass" color={tintColor} size={30} />
		},
	},
	FamilyTree: {
		screen: FamilyTreeScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-leaf" color={tintColor} size={30} />
		},
		header: 'Family Tree',
	},
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-add" color={tintColor} size={30} />
		},
	},
	Gallery: {
		screen: GalleryScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-images" color={tintColor} size={30} />
		},
	},
	Profile: {
		screen: ProfileScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-person" color={tintColor} size={30} />
		},
	},
},
	// Tab bar configuration
	{
		initialRouteName: 'Home',
		tabBarOptions: {
			activeTintColor: '#579B93',
			inactiveTintColor: 'black',
			showLabel: true,
			showIcon: true,
			// Edit the tab bar style and UI
			style: {
				backgroundColor: 'white',
				borderTopColor: '#579B93',
				borderTopWidth: .5,
				height: Dimensions.get('window').height / 14,
			},
			// Edit the navigation bar label
			labelStyle: {
				fontSize: 12,
			}
		},
		navigationOptions: {
			header: null,
		},
	},
);

// Stack navigator for uploading artefact
const uploadArtefactStack = createStackNavigator({
	MainNavigator,
	AddImageDetails: { screen: AddImageDetailsScreen },
});

// Authentication stack navigator for sign up
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

// Stack navigator for looking at item details from gallery
const itemStack = createStackNavigator({
	MainNavigator,
	ItemDetail: { screen: ItemDetailScreen },
	Gallery: { screen: GalleryScreen },
});

const itemStackProfile = createStackNavigator({
	MainNavigator,
	ItemDetail: { screen: ItemDetailScreen },
	Profile: { screen: ProfileScreen },
});

const itemStackTimeline = createStackNavigator({
	MainNavigator,
	ItemDetail: {screen: ItemDetailScreen},
	Timeline: {screen: TimelineScreen}
})

const addMemberStack = createStackNavigator({
	MainNavigator,
	FamilyTree: {screen: FamilyTreeScreen},
	AddFamilyMember: {screen: AddFamilyMemberScreen},
	ViewFamilyMember: {screen: ViewFamilyMemberScreen},
});

const Stack = createSwitchNavigator({
	Welcome: { screen: WelcomeScreen },
	SignUpStack,
	Login: {screen: LoginScreen},
	addMemberStack,
	uploadArtefactStack,
	itemStack,
	itemStackProfile,
	itemStackTimeline,
	addMemberStack,
},
{
	headerMode: 'none',
});

const NavigationContainer = createAppContainer(Stack);

const App = () => (
	<MenuProvider>
		<NavigationContainer />
	</MenuProvider>
);

export default App;