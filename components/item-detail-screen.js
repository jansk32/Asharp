import React, { useState, useEffect } from 'react';
import { Text, TextInput, ActivityIndicator, Image, View, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import moment from 'moment';
import { BACK_END_ENDPOINT } from '../constants';
import AsyncStorage from '@react-native-community/async-storage';
import DatePicker from 'react-native-datepicker';
import Icon from 'react-native-vector-icons/EvilIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger, MenuProvider, withMenuContext, renderers } from 'react-native-popup-menu';
const { SlideInMenu } = renderers;

moment.locale('en');

function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState({});

    useEffect(() => {
        async function fetchCurrentUser() {
            const res = await axios.get(`${BACK_END_ENDPOINT}/user`, { withCredentials: true });
            setCurrentUser(res.data);
        }
        fetchCurrentUser();
    }, []);

    return currentUser;
}

// See the details of each individual artefact
function ItemDetailScreen({ navigation, ctx }) {
    const { navigate } = navigation;
    const { artefactId } = navigation.state.params;
    const [owner, setOwner] = useState('');
    const [hide, setHide] = useState(true);
    const [currentUser, setCurrentUser] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [artefact, setArtefact] = useState({});

    /* Editing the input when the edit button is pressed */
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        // Get a specific artefact
        async function fetchArtefact() {
            const res = await axios.get(`${BACK_END_ENDPOINT}/artefact/find/${artefactId}`);
            const artefact = res.data;
            setArtefact(artefact);
            setName(artefact.name);
            setDescription(artefact.description);
            setValue(artefact.value);
            setDate(artefact.date);

            setHide(false);
            const ownerRes = await axios.get(`${BACK_END_ENDPOINT}/user/artefact`, {
                params: {
                    _id: res.data.owner
                }
            });
            if (ownerRes.data) {
                setOwner(ownerRes.data.name);
            }
        }
        fetchArtefact();

        async function fetchCurrentUser() {
            const res = await axios.get(`${BACK_END_ENDPOINT}/user/find/${await AsyncStorage.getItem('userId')}`);
            setCurrentUser(res.data);
        }
        fetchCurrentUser();

        setHide(false);
    }, []);

    return (
        <>
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        style={styles.image}
                        source={{ uri: artefact.file }}
                    />
                    <View style={styles.headerCont}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                            <View style={{ flexDirection: 'row' }}>
                                {isEditing &&
                                    (<View style={{ justifyContent: 'center' }}>
                                        <Icon name="pencil" size={40} color={'gray'} />
                                    </View>)
                                }
                                <TextInput
                                    style={[styles.title, { color: isEditing ? 'gray' : 'black' }]}
                                    value={name}
                                    onChangeText={setName}
                                    editable={isEditing}
                                />
                            </View>

                            <View style={{ justifyContent: 'center' }}>
                                <Icon
                                    name="navicon" size={40} color={'#2d2e33'}
                                    onPress={() => ctx.menuActions.openMenu('itemMenu')}
                                />
                            </View>
                        </View>
                        <Menu name="itemMenu" renderer={SlideInMenu}>
                            <MenuTrigger>
                            </MenuTrigger>
                            <MenuOptions customStyles={{ optionText: styles.menuText, optionWrapper: styles.menuWrapper, optionsContainer: styles.menuStyle }}>
                                <MenuOption onSelect={() => setIsEditing(true)} text="Edit Artefact" />
                                <MenuOption onSelect={() => navigate('Home')} text="Delete Artefact" />
                            </MenuOptions>
                        </Menu>
                        <View style={styles.headerDesc}>
                            <Text style={styles.owner}>Owned by {owner}</Text>
                            <DatePicker
                                disabled={!isEditing}
                                style={styles.dateStyle}
                                date={date}
                                mode="date"
                                placeholder="Select date"
                                format="YYYY-MM-DD"
                                maxDate={moment().format('DD-MM-YYYY')}
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                androidMode="spinner"
                                customStyles={{
                                    dateIcon: {
                                        position: 'absolute',
                                        left: 0,
                                        top: 4,
                                        marginLeft: 0
                                    },
                                    dateInput: {
                                        marginLeft: 0
                                    }
                                }}
                                showIcon={false}
                                onDateChange={setDate}
                                value={moment(date).format('L')}
                            />
                        </View>
                    </View>
                    <ActivityIndicator size="large" color="#0000ff" animating={hide} />
                    <View style={styles.desc}>
                        <View style={{ flexDirection: 'row' }}>
                            {isEditing &&
                                (<View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.boldHeader}>
                                        Edit
                                    </Text>
                                </View>)
                            }
                            <Text style={styles.boldHeader}>()Description:</Text>
                        </View>
                        <TextInput
                            style={[styles.descriptionStyle, { borderColor: isEditing ? 'red' : 'black', color: isEditing ? 'gray' : 'black' }]}
                            value={description}
                            onChangeText={setDescription}
                            editable={isEditing}
                            multiline={true}
                        />
                        {/*<Text style={styles.descriptionStyle}>{artefact.description}</Text>*/}
                    </View>
                    <View style={styles.desc}>
                        <View style={{ flexDirection: 'row' }}>
                            {isEditing &&
                                (<View style={{ justifyContent: 'center' }}>
                                    <Text style={styles.boldHeader}>
                                        Edit
                                    </Text>
                                </View>)
                            }
                            <Text style={styles.boldHeader}>Value:</Text>
                        </View>
                        <TextInput
                            style={[styles.descriptionStyle, { borderColor: isEditing ? 'red' : 'black', color: isEditing ? 'gray' : 'black' }]}
                            value={value}
                            onChangeText={setValue}
                            editable={isEditing}
                            multiline={true}
                        />
                    </View>
                    {
                        // If the artefact owner is the current user, allow them to send the artefact
                        currentUser && artefact.owner === currentUser._id &&
                        (
                            <>
                                <View style={styles.buttonBox}>
                                    {isEditing &&
                                        (<TouchableOpacity
                                            onPress={() => navigate('Home')}
                                            style={styles.sendButton}>
                                            <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
                                                Send Artefact
                                    </Text>
                                        </TouchableOpacity>)
                                    }
                                    <TouchableOpacity
                                        onPress={() => navigate('FamilyTree', { isSendingArtefact: true, artefactId })}
                                        style={styles.sendButton}>
                                        <Text style={{ color: 'white', textAlign: 'center', fontSize: 18 }}>
                                            Send Artefact
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                    }

                </View >
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    image: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').width,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerCont: {
        paddingHorizontal: '8%',
        paddingTop: '5%',
        borderBottomEndRadius: 30,
        borderBottomStartRadius: 30,
        justifyContent: 'space-between',
    },
    headerDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    desc: {
        marginHorizontal: '8%',
        marginBottom: 40,
        justifyContent: 'space-between',
    },
    descriptionStyle: {
        marginTop: 5,
        padding: 10,
        paddingBottom: 30,
        borderRadius: 5,
        borderColor: 'black',
        borderWidth: 0.5,
        color: 'black'
    },
    title: {
        color: 'black',
        fontSize: 50,
        fontWeight: 'bold',
    },
    owner: {
        color: 'black',
        fontSize: 18,
    },
    dateStyle: {
        color: '#579B93',
        borderLeftColor: '#fff',
        alignSelf: 'flex-end',
        fontWeight: 'bold',
    },
    boldHeader: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    value: {
        fontSize: 16,
    },
    buttonBox: {
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    sendButton: {
        backgroundColor: '#EC6268',
        width: Dimensions.get('window').width / 1.75,
        height: Dimensions.get('window').width / 8,
        borderRadius: 50,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    menuStyle: {
        borderTopEndRadius: 20,
        borderTopStartRadius: 20,
        borderColor: 'black',
        borderWidth: 0.5,
        paddingTop: 20,
        justifyContent: 'space-between',
        paddingBottom: 80,
    },
    menuWrapper: {
        paddingVertical: 15,
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
        marginHorizontal: 50,
    },
    menuText: {
        textAlign: 'left',
        fontSize: 20,
    },
});

ItemDetailScreen.navigationOptions = {
    title: 'Edit Artefact Details',
};

export default withMenuContext(ItemDetailScreen);



