import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker, TouchableHighlight,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import downloadImage from '../image-tools';
import AsyncStorage from '@react-native-community/async-storage';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loginText: {
    fontSize: 30,
  },
  text: {
    fontSize: 20,
  },
  redButtonText: {
    fontSize: 20,
    color: 'white',
  },
  loginBox: {
    justifyContent: 'space-evenly',
    paddingTop: 20,
    paddingBottom: 10,
  },
  inputBox: {
    justifyContent: 'space-between',
    padding: 40,
  },
  redButton: {
    backgroundColor: '#EC6268',
    borderColor: '#EC6268',
    borderWidth: 1,
    paddingVertical: 9,
    paddingHorizontal: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 30,
  },
  signInButton: {
    backgroundColor: 'white',
    borderColor: '#EC6268',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonBox: {
    backgroundColor: '#fff',
    marginTop: 40,
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    marginTop: 10,
    padding: 20,
    paddingLeft: 10,
  },
  textInputUpper: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    alignContent: 'center',
    marginTop: 2,
    flexDirection:'column',
    flexWrap:'wrap',
  },
  usernameBox: {
    marginBottom: 40,
  },
  upperBox: {
    marginBottom: 10,
  },
}
)

export default function UploadImageScreen({ navigation }) {
  const { navigate } = navigation;
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [image, setImage] = useState();

  // Function to create artefact
  async function createArtefact() {
    // let dataKeys = ['value', 'name', 'date', 'description','pictureUrl'];
    let data = {
      name: name,
      date: date,
      value: value,
      description: description
};
    try {
          data.file = await AsyncStorage.getItem('artefactPictureUrl');
        } catch (e) {
          ToastAndroid.show('Error getting pictureUrl' , ToastAndroid.SHORT);
        }
    await axios.post('http://localhost:3000/artefact/create', data)
    .then((result) => {if(result) {navigate('Home')}});
  }

  // useEffect(async () => {
  //     console.log(await AsyncStorage.getItem('artefactPictureUrl'));
  //     setImage(downloadImage(await AsyncStorage.getItem('artefactPictureUrl')));
  // }, []);

  return (
    <>
      <ScrollView>
        <Image
        source={image}
        style={{height: 200, width: 200}}
        />
        <View style={styles.container}>
          <View style={styles.inputBox}>
            <View style={styles.upperBox}>
              <Text style={styles.text}>Item Name:</Text>
              <View style={styles.textInputUpper}>
                <TextInput
                  placeholder='Enter Item Name'
                  onChangeText = {setName}
                />
              </View>
            </View>
            <View style={styles.usernameBox}>
              <Text style={styles.text}>Date</Text>
              <DatePicker
								style={styles.dateInput}
								date={date}
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
								onDateChange={setDate}
								value={date}
      						/>
            </View>
            <View style={styles.usernameBox}>
              <Text style={styles.text}>Desription</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Describe the item.'
                  onChangeText={setDescription}
                />
              </View>
            </View>
            <View style={styles.passwordBox}>
              <Text style={styles.text}>Value</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Write down the memory and value this item holds.'
                  onChangeText= {setValue}
                />
              </View>
            </View>
          </View>
            <View style={styles.redButton}>
              <TouchableHighlight
                onPress={createArtefact}>
                <Text
                  style={styles.redButtonText}>
                  Upload Artefact</Text>
              </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    </>
  );
}