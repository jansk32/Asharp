import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Button } from 'react-native';
import Axios from 'axios';

this.axios = Axios.create({
    withCredentials: false,
    headers:{
      "Accept": "application/json"
    },
    baseURL: 'http://localhost:3000/'
  });

export default function ProfileScreen() {
    const [profile, setProfile] = useState("");

    useEffect(() => {
        console.log('Sending request');
        axios.get("/user")
        .then((resp) => {
            // setProfile(resp);
            // console.log(resp);
            console.log("FOUND");
        })
        .catch(error => console.error(error));
    }, []);

    return (
        <>
            <Text style={{ fontSize: 42 }}>This is the profile screen</Text>
            <Text>{profile} hello</Text>
        </>
    );
}

// ProfileScreen.navigationOptions = {
//     title: 'Profile'
// };