import React from 'react';
// Importing all existing screens for navigation
import HomeScreen from './components/home-screen';
import FamilyTreeScreen from './components/family-tree-screen';
import ProfileScreen from './components/profile-screen';
import TimelineScreen from './components/timeline-screen';
import ItemDetailScreen from './components/item-detail-screen';
import WelcomeScreen from './components/welcome-screen';
import LoginScreen from './components/log-in-screen';
import SignUp1Screen from './components/sign-up1-screen';
import SignUp2Screen from './components/sign-up2-screen';
import SignUp3Screen from './components/sign-up3-screen';
import AddImageDetailsScreen from './components/add-image-details-screen';
import ProfileSettingScreen from './components/profile-setting';
import NotificationScreen from './components/notification-screen';
import AddFamilyMemberScreen from './components/add-family-member-screen';
import ViewFamilyMemberScreen from './components/view-family-member-screen';
import AddParentsScreen from './components/add-parents-screen';
import AddParentsManually from './components/add-parents-manually-screen';


import { MenuProvider } from 'react-native-popup-menu';



// Import react navigation tools
import {
	createBottomTabNavigator,
	createAppContainer,
	createSwitchNavigator,
	createStackNavigator,
} from 'react-navigation';

// Import icons
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Entypo';

// Import Firebase.
import * as firebase from 'firebase';
import { Dimensions, Text } from 'react-native';
import { HeaderTitle } from 'react-navigation-stack';
import OneSignal from 'react-native-onesignal';
import AddParentsManuallyScreen from './components/add-parents-manually-screen';

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

// OneSignal
const ONESIGNAL_APP_ID = 'f9de7906-8c82-4674-808b-a8048c4955f1';
OneSignal.init(ONESIGNAL_APP_ID);
// Incoming notifications are displayed in the notification bar and not as an alert box
// when the app is open
OneSignal.inFocusDisplaying(2);
OneSignal.addEventListener('received', () => console.log('RECEIVED ONESIGNAL'));

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
			tabBarIcon: ({ tintColor }) => <Icon2 name="tree" color={tintColor} size={30} />
		},
		header: 'Family Tree',
	},
	Home: {
		screen: HomeScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-add" color={tintColor} size={30} />
		},
	},
	Notification: {
		screen: NotificationScreen,
		navigationOptions: {
			tabBarIcon: ({ tintColor }) => <Icon name="md-notifications-outline" color={tintColor} size={30} />
		},
	},
	Profile: {
		// screen: ProfileDrawer,
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
			inactiveTintColor: '#525151',
			showLabel: true,
			showIcon: true,
			// Edit the tab bar style and UI
			style: {
				backgroundColor: '#f5f7fb',
				borderTopColor: '#f5f7fb',
				 adfndnnkfnkdnkfnkdfnk: .5,
				height: Dimensions.get('window').height / 14,
				paddingTop: 5,
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
},
	{
		navigationOptions: {
			header: null,
		},
	});

// Authentication stack navigator for sign up
const SignUpStack = createStackNavigator({
	SignUp1: { screen: SignUp1Screen },
	SignUp2: {
		screen: SignUp2Screen,
		navigationOptions: ({ navigation }) => ({
			title: 'Enter details',
			headerTitleStyle: { color: '#EC6268' },
		}),
	},
	SignUp3: {
		screen: SignUp3Screen,
		navigationOptions: ({ navigation }) => ({
			title: 'Choose profile picture!',
			headerTitleStyle: { color: '#EC6268' }
		}),
	},
});

const familyStack = createStackNavigator({
	MainNavigator,
	ViewFamilyMember: {screen: ViewFamilyMemberScreen},
	AddFamilyMember: {screen: AddFamilyMemberScreen},
	AddParentsManually: {screen:AddParentsManuallyScreen},
	AddParents: {screen:AddParentsScreen},
});

// Stack navigator for looking at item details from gallery
const itemStack = createStackNavigator({
	MainNavigator,
	Profile: { screen: ProfileScreen },
	ProfileSetting: {screen: ProfileSettingScreen},
	Timeline: { screen: TimelineScreen },
	Notification: { screen: NotificationScreen },
	ItemDetail: { screen: ItemDetailScreen },
});

const sendFamilyStack = createStackNavigator({
	ItemDetail: { screen: ItemDetailScreen },	
	FamilyTree: {screen: FamilyTreeScreen},
});

const Stack = createSwitchNavigator({
	Welcome: { screen: WelcomeScreen },
	SignUpStack,
	Login: { screen: LoginScreen },
	itemStack,
	sendFamilyStack,
	uploadArtefactStack,
	familyStack,
});

const NavigationContainer = createAppContainer(Stack);

const App = () => (
	<MenuProvider>
		<NavigationContainer />
	</MenuProvider>
);

export default App;