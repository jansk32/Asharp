import React, { useState, useEffect } from 'react';
import {
  Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
  FlatList, SectionList, ToastAndroid, Picker,
} from 'react-native';
import { NavigationEvents } from 'react-navigation';
import axios from 'axios';

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

  // axios + navigate ==> learn about cookies bruh
  const pressed = (obj) => {
    navigate('SignUp3');
    onPressedEffect(obj);
  }

  // axios 
  function onPressedEffect(body) {
    axios.post("http://localhost:3000/user/create/2", {
          firstName: "LOL",
          dob: "1976-03-04",
          userName: body.userName,
          password: body.password
        }
      )
    // useEffect(() => {
    //   axios.get("http://localhost:3000/user/create/2", {
    //     body :{
    //       name: "LOL",
    //       dob: "1976-03-04",
    //       userName: body.userName,
    //       password: body.password
    //     }
    //   })
    // })
  }

  return (
    <>
      <React.Fragment>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Sign In</Text>
        </View>
        <View style={styles.loginBox}>
          <Text style={styles.text}>Username</Text>
          <TextInput
            placeholder='Enter Username'
            onChangeText={(text) => this.userName = text}
          />
          <Text style={styles.text}>Password</Text>
          <TextInput
            placeholder='Enter Username'
            onChangeText={(text) => this.password = text}
          />
        </View>
        <Button
          title='->'
          onPress={() => pressed({password: this.password, userName: this.userName})}
        />
        <Button
          title='<-'
          onPress={() => navigate('SignUp1')}
        />
      </React.Fragment>
    </>
  );
}