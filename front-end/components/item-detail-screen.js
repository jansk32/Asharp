import React, { useState, useEffect } from 'react';
import { Platform, Text, TextInput, ActivityIndicator, Image, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity, Button, ToastAndroid, Alert } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT, DATE_FORMAT } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, withMenuContext, renderers } from 'react-native-popup-menu';
import LinearGradient from 'react-native-linear-gradient';
const { SlideInMenu } = renderers;
import DateTimePicker from '@react-native-community/datetimepicker';

moment.locale('en');


// See the details of each individual artefact
function ItemDetailScreen({ navigation, ctx }) {
	const { navigate } = navigation;
	const { artefactId } = navigation.state.params;
	const [owner, setOwner] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState();
	const [isEditing, setIsEditing] = useState(false);
	const [artefact, setArtefact] = useState({});
	const [showDatePicker, setShowDatePicker] = useState(false);

	/* Editing the input when the edit button is pressed */
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [value, setValue] = useState('');
	const [date, setDate] = useState(moment());

	useEffect(() => {
		// Get a specific artefact
		async function fetchArtefact() {
			const res = await axios.get(`${BACK_END_ENDPOINT}/artefact/find/${artefactId}`);
			const artefact = res.data;
			setArtefact(artefact);

			setLoading(false);
			const ownerRes = await axios.get(`${BACK_END_ENDPOINT}/user/artefact`, {
				params: {
					_id: res.data.owner
				}
			});
			if (ownerRes.data) {
				setOwner(ownerRes.data.name);
			}
		}
		fetchArtefact();

		async function fetchCurrentUser() {
			const res = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem('userId')}`);
			setCurrentUser(res.data);
		}
		fetchCurrentUser();

		setLoading(false);
	}, []);

	// Update artefact attribute states when artefact changes
	useEffect(() => {
		setName(artefact.name);
		setDescription(artefact.description);
		setValue(artefact.value);
		setDate(moment(artefact.date));
	}, [artefact]);

	return (
		<ScrollView>
			<View style={styles.container}>
				<Image
					style={styles.image}
					source={{ uri: artefact.file }}
				/>
				{
					isLoading &&
					<ActivityIndicator size="large" color="#0000ff" animating={isLoading} />
				}
				<View style={styles.headerCont}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
						<TextInput
							style={[styles.title, { color: isEditing ? 'gray' : 'black' }]}
							value={name}
							onChangeText={setName}
							editable={isEditing}
						/>
						<View style={{ justifyContent: 'center' }}>
							<Icon
								name="navicon" size={40} color={'#2d2e33'}
								onPress={() => ctx.menuActions.openMenu('itemMenu')}
							/>
						</View>
					</View>
					<Menu name="itemMenu" renderer={SlideInMenu}>
						<MenuTrigger>
						</MenuTrigger>
						<MenuOptions customStyles={{ optionText: styles.menuText, optionWrapper: styles.menuWrapper, optionsContainer: styles.menuStyle }}>
							<MenuOption onSelect={() => setIsEditing(true)} text="Edit Artefact" />
							<MenuOption onSelect={() => {
								Alert.alert('Delete artefact', 'Are you sure you would like to delete this artefact?', [
									{
										text: 'Cancel'
									},
									{
										text: 'OK',
										onPress: async () => {
											await axios.delete(`${BACK_END_ENDPOINT}/artefact/delete/${artefactId}`);
											ToastAndroid.show('Artefact deleted', ToastAndroid.SHORT);
											navigation.goBack();
										}
									}
								]);
							}} text="Delete Artefact" />
						</MenuOptions>
					</Menu>
					<View style={styles.headerDesc}>
						<Text style={styles.owner}>Owned by {owner}</Text>
					</View>
					<TouchableOpacity onPress={() => setShowDatePicker(true)} disabled={!isEditing}>
						<Text style={{borderWidth: isEditing ? 1 : 0, borderColor: 'red', padding: 15}}>Date owned: {date.format(DATE_FORMAT)}</Text>
					</TouchableOpacity>
					{showDatePicker &&
						<DateTimePicker
							value={date.toDate()}
							maximumDate={moment().toDate()}
							onChange={(event, newDate) => {
								newDate = newDate || date;
								setShowDatePicker(Platform.OS === 'ios' ? true : false);
								setDate(moment(newDate));
							}} />
					}
				</View>
				<View style={styles.desc}>
					<Text style={styles.boldHeader}>Description:</Text>
					<TextInput
						style={[styles.descriptionStyle, { borderColor: isEditing ? 'red' : 'black' }]}
						value={description}
						onChangeText={setDescription}
						editable={isEditing}
						multiline={true}
					/>
				</View>
				<View style={styles.desc}>
					<Text style={styles.boldHeader}>Value:</Text>
					<TextInput
						style={[styles.descriptionStyle, { borderColor: isEditing ? 'red' : 'black' }]}
						value={value}
						onChangeText={setValue}
						editable={isEditing}
						multiline={true}
					/>
				</View>
				{
					// If the artefact owner is the current user, allow them to send the artefact
					currentUser && artefact.owner === currentUser._id &&
					<View style={styles.buttonBox}>
						{isEditing ?
							(
								<TouchableOpacity
									onPress={async () => {
										setIsEditing(false);
										setLoading(true);
										const newArtefactRes = await axios.put(`${BACK_END_ENDPOINT}/artefact/update/${artefactId}`, {
											name,
											description,
											value,
											date,
										});
										const newArtefact = newArtefactRes.data;
										setLoading(false);
										setArtefact(newArtefact);
									}}
									style={styles.sendButton}>
									<Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
										Finish Editing
                                    </Text>
								</TouchableOpacity>
							)
							:
							(
								<TouchableOpacity
									onPress={() => navigate('SendFamilyTree', { isSendingArtefact: true, artefactId })}
									style={styles.sendButton}>
									<LinearGradient colors={['#ff2870', '#ffe148']}
										start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
										style={styles.sendButton}>
										<Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
											Send Artefact
                                        </Text>
									</LinearGradient>
								</TouchableOpacity>
							)
						}
					</View>
				}
			</View>
		</ScrollView>
	);

}

{/* ItemDetailScreen.navigationOptions = ({ navigation }) => {
	return {
		title: 'item detail title',
		headerRight: () => (
			<Button onPress={() => alert('Header button pressed')} />
		),
	};
}; */}

ItemDetailScreen.navigationOptions = {
	title: 'my title'
};

const styles = StyleSheet.create({
	image: {
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').width,
		alignSelf: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
	},
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	headerCont: {
		paddingHorizontal: '8%',
		paddingTop: '5%',
		borderBottomEndRadius: 30,
		borderBottomStartRadius: 30,
		justifyContent: 'space-between',
	},
	headerDesc: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 10,
	},
	desc: {
		marginHorizontal: '8%',
		marginBottom: 40,
		justifyContent: 'space-between',
	},
	descriptionStyle: {
		marginTop: 5,
		padding: 10,
		paddingBottom: 30,
		borderRadius: 5,
		borderColor: 'black',
		borderWidth: 0.5,
		color: 'black'
	},
	title: {
		color: 'black',
		fontSize: 50,
		fontWeight: 'bold',
	},
	owner: {
		color: 'black',
		fontSize: 18,
	},
	dateStyle: {
		borderLeftColor: '#fff',
		// alignSelf: 'flex-end',
	},
	boldHeader: {
		fontWeight: 'bold',
		fontSize: 20,
	},
	value: {
		fontSize: 20,
	},
	buttonBox: {
		justifyContent: 'center',
		marginHorizontal: 20,
		marginVertical: 20,
	},
	sendButton: {
		backgroundColor: '#EC6268',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	menuStyle: {
		borderTopEndRadius: 20,
		borderTopStartRadius: 20,
		borderColor: 'black',
		borderWidth: 0.5,
		paddingTop: 20,
		justifyContent: 'space-between',
		paddingBottom: 80,
	},
	menuWrapper: {
		paddingVertical: 15,
		borderBottomColor: 'black',
		borderBottomWidth: 0.5,
		marginHorizontal: 50,
	},
	menuText: {
		textAlign: 'left',
		fontSize: 20,
	},
});

export default withMenuContext(ItemDetailScreen);