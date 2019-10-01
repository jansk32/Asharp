// Profile setting
import React, { useState, useEffect } from 'react';
import {
	Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions, Image, ScrollView,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { SCHEMES } from 'uri-js';

/*
TODO
- Create Page ✓
- Link in navigation bar ✓
- Create function

*/ 

// Edit user details: Name, DOB, password, profile picture
export default function ProfileSettingScreen({ navigation }) {
  const { navigate } = navigation;
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');

  // Validate  name and new password
  function validateInput(){
		if(!(name) || name === ""){
			alert("Please insert name");
			return false;
		}
		if(password.length < 6){
				alert("Password must be at least 6 characters long");
				return false
	}
	return true;
  }
  return (
    <>
    <ScrollView>
			<View style={styles.container}>
      <Image source={image} style={styles.imageStyle} />
      <View style={styles.buttonBox}>
        <TouchableOpacity
          onPress={async () => setImage(await pickImage())}>
            <View style={styles.picButton}>
              <Text
              style={styles.text}>
              Pick Picture
              </Text>
            </View>
        </TouchableOpacity>
      </View>
				<View style={styles.inputBox}>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Name</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter Full Name'
								onChangeText={setName}
								value={name}
							/>
						</View>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Date of Birth</Text>

							<DatePicker
								style={styles.dateInput}
								date={dob}
								mode="date"
								placeholder="select date"
								format="YYYY-MM-DD"
								minDate="1900-01-01"
								maxDate="2019-01-01"
								confirmBtnText="Confirm"
								cancelBtnText="Cancel"
								androidMode = "spinner"
								customStyles={{
									dateIcon: {
										position: 'absolute',
										left: 0,
										top: 4,
										marginLeft: 0
										},
										dateInput: {
										marginLeft: 36
										}
								}}
								onDateChange={setDob}
								value={dob}
      						/>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Password</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter Old Password'
								secureTextEntry={true}
								onChangeText={setPassword}
								value={password}
							/>
						</View>
					</View>
					<View style={styles.inputElem}>
						<Text style={styles.text}>Password</Text>
						<View style={styles.textInput}>
							<TextInput
								placeholder='Enter New Password'
								secureTextEntry={true}
								onChangeText={setPassword}
								value={password}
							/>
						</View>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => navigation.goBack()}>
					<View style={styles.redButton}>
						<Text
							style={styles.whiteText}>
							Next
							</Text>
					</View>
				</TouchableOpacity>
      </View>
    </ScrollView>
      
		</>
	);
}

// Stylesheets for formatting and designing layout
const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
		fontSize: 16,
		color: 'black',
		textAlign: 'center',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	picButton: {
		backgroundColor: '#fff',
		borderWidth: 1,
		borderColor: '#FBC074',
		width: Dimensions.get('window').width / 3,
		height: Dimensions.get('window').width / 11,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
		marginBottom: 80,
	},
	finishButton: {
		backgroundColor: '#FBC074',
		borderWidth: 1,
		borderColor: '#FBC074',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	imageStyle: {
		margin: 2,
		marginTop: '20%',
		width: Dimensions.get('window').width / 4,
		height: Dimensions.get('window').width / 4,
		alignSelf: 'center',
		borderColor: '#233439',
		borderWidth: 1,
		borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2,
	},
	buttonBox: {
		backgroundColor: '#fff',
		marginTop: '5%',
		justifyContent: 'space-between',
		flex: 1,
		marginBottom: '7.5%',
  },
  container: {
		backgroundColor: 'white',
		flex: 1,
	},
	text: {
    fontSize: 18,
    alignSelf: 'center',
	},
	whiteText: {
		fontSize: 20,
		color: 'white',
		textAlign: 'center',
	},
	inputBox: {
		justifyContent: 'space-between',
		padding: 40,
	},
	redButton: {
		backgroundColor: '#EC6268',
		width: Dimensions.get('window').width / 1.75,
		height: Dimensions.get('window').width / 8,
		borderRadius: 50,
		justifyContent: 'center',
		alignSelf: 'center',
	},
	textInput: {
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 3,
		alignContent: 'center',
		marginTop: 10,
		paddingLeft: 10,
	},
	dateInput: {
		alignContent: 'center',
		marginTop: 10,
		width: 330,
	},
	inputElem: {
		marginBottom: 18,
	}
}
)