import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker,
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
  loginText: {
    fontSize: 30,
  },
  text: {
    fontSize: 16,
  },
  loginBox: {
    backgroundColor: '#fff',
    flex: 1 / 4,
    justifyContent: 'space-evenly',
    textAlign: 'center',
    alignItems: 'center',
    // justifyContent: 'center',
  },
}
)

export default function SigninScreen({ navigation }) {
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
      <React.Fragment>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Sign In</Text>
        </View>
        <View style={styles.loginBox}>
          <Text style={styles.text}>Upload Picture</Text>
          <TextInput
            placeholder='Preview Picture'
          />
          <Button
            title='Upload'
          />
        </View>
        <Button
          title='Finish'
          onPress={() => pressed()}
        />
        <Button
          title='<-'
          onPress={() => navigate('SignUp2')}
        />
      </React.Fragment>
    </>
  );
}