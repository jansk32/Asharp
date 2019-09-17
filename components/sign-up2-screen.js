import React, { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, TextInput, TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
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
  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 3,
    alignContent: 'center',
    marginTop: 10,
    paddingLeft: 10,
  },
  inputElem: {
    marginBottom: 18,
  }
}
)

export default function LoginScreen({ navigation }) {
  const { navigate } = navigation;
  return (
    <>
      <View style={styles.container}>
        <View style={styles.inputBox}>
          <View style={styles.inputElem}>
            <Text style={styles.text}>First Name</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter First Name'
              />
            </View>
          </View>
          <View style={styles.inputElem}>
            <Text style={styles.text}>Last Name</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter Last Name'
              />
            </View>
          </View>
          <View style={styles.inputElem}>
            <Text style={styles.text}>Date of Birth</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter DOB'
              />
            </View>
          </View>
          <View style={styles.inputElem}>
            <Text style={styles.text}>Password</Text>
            <View style={styles.textInput}>
              <TextInput
                placeholder='Enter Password'
              />
            </View>
          </View>
        </View>
        <View style={styles.redButton}>
          <TouchableOpacity
            onPress={() => navigate('SignUp3')}>
            <Text
              style={styles.buttonText}>
              Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}