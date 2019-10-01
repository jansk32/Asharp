// Profile setting
import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, TextInput, TouchableOpacity, ToastAndroid, Dimensions, Image, ScrollView,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import { SCHEMES } from 'uri-js';
import { pickImage, uploadImage } from '../image-tools';
import axios from 'axios';
import Moment from 'moment';

Moment.locale('en');



/*
TODO
- Create Page ✓
- Link in navigation bar ✓
- Create function

*/

// Edit user details: Name, DOB, password, profile picture
export default function ProfileSettingScreen({ navigation }) {
  const { navigate } = navigation;
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState({});

  // Validate name and new password
  function validateInput() {
    if (!(name) || name === "") {
      alert("Please insert name");
      return false;
    }
    // Check if old password is the same as the new password
    if (use.password !== oldPassword) {
      alert("Old password does not match! >:)");
      return false;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return false
    }
    return true;
  }

  // Get profile
  async function obtainProfile() {
    await axios.get("http://localhost:3000/user")
      .then((result) => {
        console.log(result.data);
		setUser(result.data);
      });
    // await console.log(user);
  }

  // Post profile
  async function updateProfile() {
    await validateInput();
    // Upload current image
    let data = {};
    await name !== '' ? data.name = name : name;
    await dob !== '' ? data.dob = dob : dob;
    await password !== '' ? data.password = password : password;
    await image !== {} ? async function () {
      let newImage = await uploadImage(image.uri);
      data.pictureUrl = newImage;
    } : image;

    let updatedData = await axios.post("http://localhost:3000/user/update", data)
    console.log(updatedData);
  }

  // Get user details
  useEffect(() => {
    obtainProfile();
  }, [])

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Image source={{ uri: user.pictureUrl }} style={styles.imageStyle} />
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
            <View style={styles.inputElem}>
              <Text style={styles.text}>Name</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder={user.name}
                  onChangeText={setName}
                  value={name}
                />
              </View>
            </View>
            <View style={styles.inputElem}>
              <DatePicker
                style={styles.dateInput}
                date={dob}
                mode="date"
                placeholder={Moment(user.dob).format('L')}
                format="DD-MM-YYYY"
                minDate="1900-01-01"
                maxDate="2019-01-01"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                androidMode="spinner"
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
              <Text style={styles.text}>Old Password</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder={'Enter Old Password'}
                  secureTextEntry={true}
                  onChangeText={setPassword}
                  value={password}
                />
              </View>
            </View>
            <View style={styles.inputElem}>
              <Text style={styles.text}> New Password</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Enter New Password'
                  secureTextEntry={true}
                  onChangeText={setPassword}
                  value={password}
                />
              </View>
            </View>
          <TouchableOpacity
            onPress={() => {
              updateProfile();
              navigation.goBack()
            }}>
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
    alignItems: 'center',
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
    paddingLeft: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
  },
  dateInput: {
    alignContent: 'center',
    marginTop: 10,
    width: 330,
  },
  inputElem: {
    // marginBottom: 18,
    flexDirection: 'row',
  }
}
)