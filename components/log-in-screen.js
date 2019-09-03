import React, { useState, useEffect } from 'react';
import {
	Text, View, Image, StyleSheet, TextInput, Button, ScrollView,
	FlatList, SectionList, ToastAndroid, Picker
} from 'react-native';

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

export default function LoginScreen() {
  return (
      <>
          <React.Fragment>
             <View style={styles.loginBox}>
               <Text style={styles.loginText}>LOGIN</Text>
             </View>
						 <View style={styles.loginBox}>
               <Text style={styles.loginText}>Username</Text>
               <Text style={styles.loginText}>Password</Text>
             </View>
						 <Button
							 title='Login'
							 />
          </React.Fragment>
      </>
  );
}