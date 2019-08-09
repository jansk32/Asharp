import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Alert, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';
import axios from 'axios';


export default function App() {
	const [condition, setCondition] = useState('');
	const [newMemento, setNewMemento] = useState('');
	const [mementos, setMementos] = useState([
		{
			id: 0,
			name: 'Harmonica'
		},
		{
			id: 1,
			name: 'Letter'
		},
		{
			id: 2,
			name: 'Photo'
		}
	]);

	return (
		<>
			<TextInput
				placeholder='Add a new memento'
				onChangeText={setNewMemento}
				value={newMemento}
			/>

			<Button
				title='Add memento'
				onPress={() => {
					setMementos(mementos.concat({ id: mementos.length, name: newMemento }));
					ToastAndroid.show('Memento added', ToastAndroid.SHORT);
					setNewMemento('');
				}
				}
			/>

			<Picker
				selectedValue={condition}
				onValueChange={(value, index) => setCondition(value)}
				>
				<Picker.Item label='new' value='new' />
				<Picker.Item label='used' value='used' />
			</Picker>

			<Text>{condition}</Text>

			<FlatList
				data={mementos}
				renderItem={({ item }) => <Text style={{ fontSize: 24, lineHeight: 40 }}>{item.name}</Text>}
				keyExtractor={(item, index) => item.id.toString()}
			/>
		</>
	);
}

function HelloWorldApp() {
	const [text, setText] = useState('');
	const [name, setName] = useState('');
	const styles = StyleSheet.create({
		blue: {
			color: 'blue',
			fontWeight: 'bold',
			fontSize: 30
		}
	});

	useEffect(() => {
		async function fetchData() {
			const res = await axios.get('https://reqres.in/api/users/2', {
				params: {
					delay: 4
				}
			});
			setName(res.data);
		}
		fetchData();
	}, []);

	return (
		<>
			<Text>{name ? JSON.stringify(name) : 'Loading'}</Text>
			<FlatList
				data={[...Array(50).keys()].map(e => ({ key: e.toString() }))}
				renderItem={({ item }) => <Text>{item.key}</Text>}
			/>

			<SectionList
				style={{ backgroundColor: 'pink', marginTop: 30 }}
				sections={[
					{ title: 'D', data: ['Devin'] },
					{ title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie'] }
				]}
				renderItem={({ item }) => <Text>{item}</Text>}
				renderSectionHeader={({ section }) => <Text>{section.title}</Text>}
				keyExtractor={(item, index) => index}
			/>

			<ScrollView>
				<View style={{ flex: 1 }}>
					<View style={{ flex: 1, backgroundColor: 'powderblue' }}>
						<TextInput
							placeholder='Please type some text'
							onChangeText={setText}
							value={text}
							style={{ height: 40 }}
						/>
					</View>
					<View style={{ flex: 2, backgroundColor: 'skyblue' }}>
						<Text style={{ fontSize: 42 }}>{text.toUpperCase()}</Text>
					</View>
					<View style={{ flex: 3, backgroundColor: 'steelblue' }}>
						<Button
							title='my button'
							onPress={() => Alert.alert('Pressed the button')}
							color='green'
						/>
					</View>
				</View>
				<Text style={{ fontSize: 36 }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text>
			</ScrollView>
		</>
	);
}