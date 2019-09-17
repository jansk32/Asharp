import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker, TouchableHighlight, ImagePicker,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import * as firebase from 'firebase';
const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

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
  loginButtonText: {
    fontSize: 20,
    color: 'white',
  },
  loginBox: {
    justifyContent: 'space-evenly',
    textAlign: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingBottom: 10,
  },
  inputBox: {
    justifyContent: 'space-between',
    padding: 40,
    // justifyContent: 'center',
  },
  loginButton: {
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
    paddingHorizontal: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonBox: {
    backgroundColor: '#fff',
    marginTop: 40,
    // justifyContent:'space-between',
  },
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    alignContent: 'center',
    marginTop: 10,
    padding: 5,
    paddingLeft: 10,
  },
  usernameBox: {
    marginBottom: 40,
  }
}
)

export default function LoginScreen({ navigation }) {
  const { navigate } = navigation;

  async function uploadImage(uri) {
    const mime = 'image/jpg';
    const uploadUri = uri;
    const sessionId = new Date().getTime();
    let uploadBlob = null;
    const imageRef = firebase.storage().ref('images').child(sessionId.toString());
  
    const data = await fs.readFile(uploadUri, 'base64');
    const blob = await Blob.build(data, { type: `${mime};BASE64` });
    uploadBlob = blob;
    await imageRef.put(blob, { contentType: mime });
    uploadBlob.close();
    const url = await imageRef.getDownloadURL();
    console.log(url);
    ToastAndroid.show('Image uploaded', ToastAndroid.SHORT);
  }

  async function downloadImage(filename) {
    const imageRef = firebase.storage().ref('images/test.jpg');
  }

   // axios + navigate ==> learn about cookies bruh
   // TIMMYY!! HOW TO SAVE IMAGE PLS PASS AS ARGUMENT TO ONPRESSEDEFFECT
   const pressed = () => {
    navigate('Home');
    onPressedEffect();
  }

  // axios 
  function onPressedEffect() {
    axios.post("http://localhost:3000/user/create/3", {
         file: "ablah.com"
      })
  }

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputBox}>
            <View style={styles.usernameBox}>
              <Text style={styles.text}>Choose Picture</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Picure preview'
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonBox}>
            <View style={styles.signInButton}>
              <TouchableHighlight>
                <Text
                  style={styles.text}>
                  Upload Picture</Text>
              </TouchableHighlight>
            </View>
            <View style={styles.loginButton}>
              <TouchableHighlight
                onPress={() => pressed()}>
                <Text
                  style={styles.loginButtonText}>
                  Finish</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}