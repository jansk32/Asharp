import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function AddFamilyMemberScreen({ navigation }) {
    const { navigate } = navigation;

    return(
    <>  
        <LinearGradient colors={['#436aac','#43b7b8']} style={styles.container}>
            <Text style={styles.title}>Add family member</Text>
        </LinearGradient>

        <View style={styles.inputContainer}>
            <Text style={styles.header}>Search by email:</Text>
            <View style={styles.searchContainer}>
                <Icon name="md-search" size={30} />
                <TextInput
                    placeholder='Search username'
                    style={styles.searchInput}
                />
            </View>
            
        
            <Text style={styles.manualHeader}>Add details manually</Text>
            <TextInput
                placeholder='Name'
                style={styles.textInput}
            />
            <TextInput
                placeholder='Status'
                style={styles.textInput}
            />

        </View>
        
        <View style={styles.button}>
            <Text style={styles.buttonText}>Add</Text>
        </View>


    </>
)};

const styles = StyleSheet.create({
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth:1,
        alignContent: 'center',
        marginTop: 10,
        padding: 5,
        paddingLeft: 10,
        marginLeft:'5%',
        marginRight:'5%',
      },
    searchContainer: {
        flexDirection:'row',
        padding:5,
        borderRadius:10,
        borderWidth:1,
        marginLeft:'5%',
        marginRight:'5%'

    },
    searchInput: {
       flex: 1,
       marginLeft: 5,    
       padding:5
    },
    header:{
        padding:10,
        fontSize:20,
    },
    manualHeader:{
        marginTop: '10%',
        padding:10,
        fontSize:20,
    },
    container:{
        // borderBottomLeftRadius: 40,
        // borderBottomRightRadius: 40,
    },
    title:{
        fontSize: 25,
		textAlign: 'center',
		color:'white',
		paddingBottom:'8%',
		paddingTop:'8%'
    },
    inputContainer:{
        marginTop: '10%'
    },
    buttonText:{
        fontSize: 15,
        textAlign:'center',
        marginTop: '20%',
        color: 'white'
    },
    button: {
        backgroundColor: '#EC6268',
        borderColor: '#EC6268',
        borderWidth: 1,
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '20%'
      },
});

