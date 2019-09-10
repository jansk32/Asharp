import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';
import { NavigationEvents } from 'react-navigation';

const styles = StyleSheet.create({
    loginText: {
			fontSize: 30,

    },
    loginBox: {
        backgroundColor: '#fff',
				flex: 1/4,
				justifyContent: 'space-evenly',
				textAlign: 'center',
				alignItems: 'center',
				// justifyContent: 'center',
		},
  }
)

export default function SigninScreen({navigation}) {
  const {navigate} = navigation;
  return (
      <>
          <React.Fragment>
             <View style={styles.loginBox}>
               <Text style={styles.loginText}>Sign In</Text>
             </View>
						 <View style={styles.loginBox}>
               <Text style={styles.loginText}>Username</Text>
               <Text style={styles.loginText}>Password</Text>
             </View>
						 <Button
               title='Sign In'
               onPress={() => navigate('Home')}
							 />
						 <Button
               title='Login In'
               onPress={() => navigate('Sign In')}
							 />
          </React.Fragment>
      </>
  );
}