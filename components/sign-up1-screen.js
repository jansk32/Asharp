import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker, TouchableOpacity,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  title: {
    fontSize: 30,
  },
  text: {
    fontSize: 20,
  },
  whiteText: {
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
  whiteButton: {
    backgroundColor: 'white',
    borderColor: '#EC6268',
    borderWidth: 1,
    paddingVertical: 9,
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
    alignContent: 'center',
    marginTop: 10,
    padding: 2,
    paddingLeft: 10,
  },
  inputElem: {
    marginBottom: 40,
  }
}
)

export default function LoginScreen({ navigation }) {
  const { navigate } = navigation;

  // so that sign in screen signups and sends axios req
  const pressed = (text) =>{
    navigate('SignUp2');
    onPressedEffect(text);
  }

  // axios 
  function onPressedEffect(email) {
    axios.post("http://localhost:3000/user/create/1", {
        email: email
      }
    )
  // useEffect(() => {
  //   axios.get("http://localhost:3000/user/create/1", {
  //     body :{
  //       email: 'batman@localStorage'
  //     }
  //   })
  // })
}
  return (
    <>
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.title}>Sign Up</Text>
        </View>
        <View style={styles.inputBox}>
          <View style={styles.inputElem}>
            <Text style={styles.text}>Email</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter Email'
                onChangeText={(text) => this.email= text}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <View style={styles.redButton}>
            <TouchableOpacity
              onPress={() => pressed(this.email) }>
              <Text
                style={styles.whiteText}>
                Next</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.whiteButton}>
            <TouchableOpacity
              onPress={() => navigate('Welcome')}>
              <Text
                style={styles.text}>
                Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}