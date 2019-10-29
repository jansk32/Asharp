import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { FlatList } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';

import { BACK_END_ENDPOINT, BLANK_PROFILE_PIC_URI, KinshipEnum } from '../constants';

export default function UserSearchBox({ navigation }) {
	// parameters:
	// - onPress of TouchableOpacity of search result
	// - disabled
	// OR just renderItem

	const { linkedNode, fetchFamilyMembers, kinship } = navigation.state.params;

	const [nameQuery, setNameQuery] = useState('');
	const [nonFamilials, setNonFamilials] = useState([]);
	const [searchedUsers, setSearchedUsers] = useState([]);

	useEffect(() => {
		async function fetchNonFamilials() {
			const res = await axios.get(`${BACK_END_ENDPOINT}/family-tree/non-familial/${await AsyncStorage.getItem('userId')}`);
			let nonFamilials = res.data;
			if (kinship === KinshipEnum.SPOUSE) {
				// If adding spouse, filter non-familials who are of opposite gender
				// and don't have spouses already
				nonFamilials = nonFamilials.filter(person => person.gender !== linkedNode.gender && !person.spouse);
			} else if (kinship === KinshipEnum.CHILD) {
				// If adding a child, the child must not have parents
				nonFamilials = nonFamilials.filter(person => !person.father && !person.mother);
			} else if (kinship === KinshipEnum.PARENT) {
				// If adding a parent, the parent must have a spouse already
				nonFamilials = nonFamilials.filter(person => person.spouse);
			}
			setNonFamilials(nonFamilials);
		}
		fetchNonFamilials();
	}, []);

	// Name searching
	useEffect(() => {
		setSearchedUsers(nonFamilials.filter(person => person.name.toLowerCase().includes(nameQuery.toLowerCase())));
	}, [nameQuery, nonFamilials]);


	function renderSearchResult({ item: { _id, name, pictureUrl } }) {
		// const disabled = linkedNode._id === parentId || !spouse || spouse && linkedNode.spouse === parentId;
		return (
			<TouchableOpacity
				onPress={() => {
					Alert.alert(
						`Add ${kinship}`,
						`Are you sure you would like to add ${name} as your ${kinship}?`,
						[
							{
								text: 'Cancel'
							},
							{
								text: 'OK',
								onPress: async () => {
									if (kinship === KinshipEnum.SPOUSE) {
										await axios.put(`${BACK_END_ENDPOINT}/user/add-spouse`, {
											personId: linkedNode._id,
											spouseId: _id,
										});
									} else if (kinship === KinshipEnum.CHILD) {
										await axios.put(`${BACK_END_ENDPOINT}/user/add-child`, {
											personId: linkedNode._id,
											childId: _id,
										});
									} else if (kinship === KinshipEnum.PARENT) {
										await axios.put(`${BACK_END_ENDPOINT}/user/add-parent`, {
											childId: linkedNode._id,
											parentId: _id,
										});
									}
									fetchFamilyMembers();
									navigation.goBack();
								}
							}
						]
					);
				}
				}
			>
				<View style={{ flexDirection: 'row', marginHorizontal: 30, marginTop: 10, marginBottom: 20, }}>
					<Image
						source={{ uri: pictureUrl || BLANK_PROFILE_PIC_URI }}
						style={{ height: 60, width: 60, marginRight: 30, borderRadius: 50, }} />
					<Text style={{ fontSize: 20, fontWeight: 'bold' }}>{name}</Text>
				</View>
			</TouchableOpacity>
		);
	}

	return (
		<>
			<View style={styles.searchContainer}>
				<Icon name="md-search" size={30} color={'#2d2e33'} />
				<TextInput
					placeholder="Search by name"
					style={styles.searchInput}
					value={nameQuery}
					onChangeText={setNameQuery}
				/>
			</View>
			<Text style={styles.results}>Search results:</Text>
			<FlatList
				data={searchedUsers}
				renderItem={renderSearchResult}
				keyExtractor={item => item._id}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	allContainer: {
		backgroundColor: '#f5f7fb'
	},
	textInput: {
		borderBottomColor: 'black',
		borderBottomWidth: 1,
		alignContent: 'center',
		marginTop: 10,
		padding: 5,
		paddingLeft: 10,
		marginLeft: '5%',
		marginRight: '5%',
	},
	searchContainer: {
		flexDirection: 'row',
		padding: 5,
		paddingHorizontal: 20,
		borderRadius: 10,
		borderWidth: 1,
		marginLeft: '5%',
		marginRight: '5%',
		backgroundColor: 'white',
		borderColor: 'white'
	},
	searchInput: {
		flex: 1,
		marginLeft: 15,
		padding: 5
	},
	header: {
		padding: 10,
		fontSize: 20,
	},
	manualHeader: {
		// marginTop: '10%',
		padding: 10,
		fontSize: 20,
	},
	container: {
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
		backgroundColor: 'white',
		paddingBottom: 30,
	},
	title: {
		fontSize: 35,
		color: '#2d2e33',
		paddingBottom: '8%',
		fontWeight: 'bold',
		marginLeft: 10,
	},
	results: {
		fontSize: 15,
		color: '#2d2e33',
		marginLeft: 20,
		fontWeight: 'bold',
		marginTop: 15,
	},
	add: {
		fontSize: 25,
		color: '#2d2e33',
		marginLeft: 10,
		marginTop: 10,
	},
	inputContainer: {
		marginTop: '10%',
		backgroundColor: 'white',
		borderRadius: 25,
		padding: '10%',
		marginHorizontal: 15,
	},
	buttonText: {
		fontSize: 15,
		textAlign: 'center',
		paddingTop: 30,
		color: 'white'
	},
	button: {
		backgroundColor: '#EC6268',
		borderColor: '#EC6268',
		borderWidth: 1,
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginTop: '20%',
		marginBottom: '30%'
	},
});