import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { db, storage ,firebase} from '../Firebase/firebaseConfig'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
    or,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword,updatePassword } from "firebase/auth";
//

const auth = getAuth();


const Editprofile = ({ navigation, route }) => {
    const data = route.params;
    const [loading, setLoading] = useState(false)
    const [emailcolor, setEmailcolor] = useState(false);
    const [phonecolor, setPhonecolor] = useState(false);

    const [namecolor, setNamecolor] = useState(false);
    const [passwordcolor, setpasswordcolor] = useState(false);
    const [cpasswordcolor, setcpasswordcolor] = useState(false);

    const [passshow, setpassshow] = useState(true);
    const [cpassshow, setcpassshow] = useState(true);

    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [ID, setID] = useState(null);

    const [registered, setRegistered] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(1);
        const cuser = firebase.auth().currentUser;
        const newPassword = password;
        cuser.updatePassword(newPassword).then(async() => {
            // Update successful.
            const userDoc = doc(db, "DeliveryBoy", ID);
            const userData = {
                name,
                phone,
            }
            await updateDoc(userDoc, userData).catch((error) => {
                console.log("Error updating document: ", error);
            });
            alert("Profile updated successfully");
            setLoading(0);
            navigation.navigate("main")
        }).catch((error) => {
            // An error occurred
            // ...
        });
       

    }






    useEffect(() => {
        if (registered) {
            navigation.navigate("login")


        }
    }, [registered])

    useEffect(() => {
        setName(data.name);
        setEmail(data.email);
        setAddress(data.address);
        setPhone(data.phone);
        setID(data.ID);
    }, [])
    return (
        <ScrollView style={styles.scrollmain}>
            <View style={styles.main}>
                <Text style={styles.signuptext}>Edit Profile</Text>
                <View style={styles.inputs}>
                    <View style={styles.input}>
                        <AntDesign name="user" size={24} color={namecolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={name} placeholder="Enter your Name" onFocus={() => {
                            setNamecolor(true);
                            setEmailcolor(false);
                            setpasswordcolor(false)
                            setcpasswordcolor(false);
                            setPhonecolor(false);
                        }}
                            onChange={(e) => setName(e.nativeEvent.text)}></TextInput>
                    </View>

                    <View style={styles.input}>
                        <Feather name="phone" size={24} color={phonecolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={phone} placeholder="Enter your phone number" onFocus={() => {
                            setNamecolor(false);
                            setEmailcolor(false);
                            setpasswordcolor(false)
                            setcpasswordcolor(false)
                            setPhonecolor(true);
                        }}
                            onChange={(e) => setPhone(e.nativeEvent.text)}></TextInput>
                    </View>


                    <View style={styles.input}>
                        <AntDesign name="lock1" size={24} color={passwordcolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={password} secureTextEntry={passshow} placeholder="Enter new password" onFocus={() => {
                            setEmailcolor(false);
                            setNamecolor(false);
                            setpasswordcolor(true)
                            setcpasswordcolor(false)
                            setPhonecolor(false);
                        }}
                            onChange={(e) => setPassword(e.nativeEvent.text)}></TextInput>
                        <FontAwesome name={passshow ? "eye" : "eye-slash"} style={styles.eye} size={24} color="gray" onPress={() => setpassshow(!passshow)} />
                    </View>


                    {/* <View style={styles.input}>
                        <TextInput style={styles.textinput} value={address} placeholder="Enter your Address"
                            onChange={(e) => setAddress(e.nativeEvent.text)}
                            onFocus={() => {
                                setEmailcolor(false);
                                setpasswordcolor(false)
                                setcpasswordcolor(false)
                                setNamecolor(false);
                            }}></TextInput>
                    </View> */}

                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttontext}>
                            Save changes
                        </Text>
                    </TouchableOpacity>


                </View>

                {loading ?
                    <Loader />
                    : ""}
            </View>
        </ScrollView>

    )
}

export default Editprofile

const styles = StyleSheet.create({

    scrollmain: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
    },
    main: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center',
    },
    signuptext: {
        fontSize: 20,
        color: "#4FB548",
        marginTop: 60,
        fontWeight: 500,
        fontSize: 30,

    },
    inputs: {
        width: "100%",
        alignItems: "center",
        marginTop: 40,

    },
    input: {
        width: "85%",
        height: 50,
        padding: 10,
        backgroundColor: "#fff",
        elevation: 20,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20

    },
    textinput: {
        marginHorizontal: 10,
        width: 260,
        height: 50,

    },
    eye: {
        position: "absolute",
        right: 10,
    },
    enteraddress: {
        color: "#888",
        fontSize: 15,
        marginBottom: 20
    },
    or: {
        color: "#4FB548",
        fontWeight: 500,
        marginBottom: 20,
    },
    signin: {
        color: "#999",
        fontWeight: 500,
        fontSize: 20,
        marginBottom: 20
    },
    gficons: {
        width: 100,
        flexDirection: "row",
        justifyContent: "space-between"
    },
    gficon: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 20,

    },
    hr: {
        width: "80%",
        borderBottomColor: "rgba(200,200,200,.3)",
        borderBottomWidth: 2,
        backgroundColor: "transparent",
        marginVertical: 20
    },
    button: {
        backgroundColor: "#4FB548",
        width: 220,
        height: 40,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20

    },
    buttontext: {
        textAlign: "center",
        color: "#fff",
        fontWeight: 600,
        fontSize: 22,

    }
})