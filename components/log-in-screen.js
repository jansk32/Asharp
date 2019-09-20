import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker, TouchableHighlight,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

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
    paddingHorizontal: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignSelf: 'center',
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
  const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');


  // axios authentication
  function axiosLocal(objData) {
    console.log(objData);
    axios.post("http://localhost:3000/login/local",objData)
    .catch((err) => console.log(err));
  };

  // axios third party authentication
  function axiosThirdParty(obj){
    axios.get("http://localhost:3000/login/facebook")
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>LOGIN</Text>
        </View>
        <View style={styles.inputBox}>
          <View style={styles.usernameBox}>
            <Text style={styles.text}>Username</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter Username'
                onChangeText={setUserName}
              />
            </View>
          </View>
          <View style={styles.passwordBox}>
            <Text style={styles.text}>Password</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter Password'
                onChangeText={setPassword}
              />
            </View>
          </View>
        </View>
        <View style={styles.buttonBox}>
          <View style={styles.loginButton}>
            <TouchableHighlight
              onPress={() => axiosLocal({userName: userName, password: password })}>
              <Text
                style={styles.loginButtonText}>
                Login</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.signInButton}>
            <TouchableHighlight
              onPress={() => navigate('SignUp1')}>
              <Text
                style={styles.text}>
                Sign Up</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </>
  );
}