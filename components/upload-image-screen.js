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

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.inputBox}>
            <View style={styles.upperBox}>
              <Text style={styles.text}>Item Name:</Text>
              <View style={styles.textInputUpper}>
                <TextInput
                  placeholder='Enter Item Name'
                />
              </View>
            </View>
            <View style={styles.usernameBox}>
              <Text style={styles.text}>Date</Text>
              <View style={styles.textInputUpper}>
                <TextInput
                  placeholder='Date this item is retrieved'
                />
              </View>
            </View>
            <View style={styles.usernameBox}>
              <Text style={styles.text}>Desription</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Describe the item.'
                />
              </View>
            </View>
            <View style={styles.passwordBox}>
              <Text style={styles.text}>Value</Text>
              <View style={styles.textInput}>
                <TextInput
                  placeholder='Write down the memory and value this item holds.'
                />
              </View>
            </View>
          </View>
            <View style={styles.redButton}>
              <TouchableHighlight
                onPress={() => navigate('Home')}>
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