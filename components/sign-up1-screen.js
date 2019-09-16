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
      <React.Fragment>
        <View style={styles.loginBox}>
          <Text style={styles.loginText}>Sign In</Text>
        </View>
        <View style={styles.loginBox}>
          <Text style={styles.text}>Email</Text>
          <TextInput
            placeholder='Enter Email'
            onChangeText={(text) => this.email= text}
          />
        </View>
        <Button
          title='->'
          onPress={() => pressed(this.email) }
        />
        <Button
          title='<-'
          onPress={() => navigate('Welcome')}
        />
      </React.Fragment>
    </>
  );
}