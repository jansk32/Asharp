import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

export default function AddFamilyMemberScreen({ navigation }) {
    const { navigate } = navigation;

    return(
    <>  
        <View style={styles.allContainer}>

        
            <View style={styles.container}>
                <Text style={styles.add}>Find your</Text>
                <Text style={styles.title}>Family Member</Text>
                <View style={styles.searchContainer}>
                    <Icon name="md-search" size={30} color={'#2d2e33'}/>
                    <TextInput
                        placeholder='Search by email'
                        style={styles.searchInput}
                    />
                </View>
            </View>
        {/* <LinearGradient colors={['#436aac','#43b7b8']} style={styles.container}>
            <Text style={styles.title}>Add family member</Text>
        </LinearGradient> */}

            <View style={styles.inputContainer}>   
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
        </View>

    </>
)};

const styles = StyleSheet.create({
    allContainer:{
        backgroundColor:'#f5f7fb'
    },
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
        paddingHorizontal:20,
        borderRadius:10,
        borderWidth:1,
        marginLeft:'5%',
        marginRight:'5%',
        backgroundColor:'#f5f7fb',
        borderColor:'#f5f7fb'
    },
    searchInput: {
       flex: 1,
       marginLeft: 15,    
       padding:5
    },
    header:{
        padding:10,
        fontSize:20,
    },
    manualHeader:{
        // marginTop: '10%',
        padding:10,
        fontSize:20,
    },
    container:{
       borderBottomLeftRadius: 30,
       borderBottomRightRadius: 30,
       backgroundColor:'white',
       paddingBottom:30,
    },
    title:{
        fontSize: 35,
		color:'#2d2e33',
        paddingBottom:'8%',
        fontWeight:'bold',
        marginLeft:10,
    },
    add:{
        fontSize:25,
        color:'#2d2e33',
        marginLeft:10,
        marginTop:10,
    },
    inputContainer:{
        marginTop: '10%',
        backgroundColor:'white',
        borderRadius:25,
        padding:'10%',
        marginHorizontal: 15,
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
        marginTop: '20%',
        marginBottom:'30%'
      },
});

