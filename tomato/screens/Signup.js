import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { db, storage } from '../Firebase/firebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//

const auth = getAuth();


const Signup = ({ navigation }) => {
    const [loading, setLoading] = useState(false)
    const [emailcolor, setEmailcolor] = useState(false);
    const [namecolor, setNamecolor] = useState(false);
    const [passwordcolor, setpasswordcolor] = useState(false);
    const [cpasswordcolor, setcpasswordcolor] = useState(false);

    const [passshow, setpassshow] = useState(true);
    const [cpassshow, setcpassshow] = useState(true);

    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [address, setAddress] = useState(null);

    const [registered, setRegistered] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(1);


        // console.log(url)
        // setFoodImageUrl(url)

        const userData = {
            name,
            email,
            phone:"",
            password,
            address,
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // alert("Rregistered successfuly!");
                // setRegistered(true);
                try {
                    const docRef = addDoc(collection(db, "users"), userData);
                    setLoading(0);
                    alert("Registration successful", docRef.id);
                    setTimeout(() => { setRegistered(true); }, 2000)

                }
                catch (error) {
                    alert("Error adding document: ", error);
                }
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                setLoading(0);
                const errorMessage = error.message;
                console.log(errorMessage);
                switch (errorMessage) {
                    case "Firebase: Error (auth/email-already-in-use).":
                        alert("Email Id already registered, please register with another emailid");
                }
                // ..
            });

        // console.log(foodData)

        // ======================

    }
    useEffect(() => {
        if (registered) {
            navigation.navigate("login")


        }
    }, [registered])


    return (
        <ScrollView style={styles.scrollmain}>
        <View style={styles.main}>
            <Text style={styles.signuptext}>Signup</Text>
            <View style={styles.inputs}>
                <View style={styles.input}>
                    <AntDesign name="user" size={24} color={namecolor ? "#ff4242" : "gray"} />
                    <TextInput style={styles.textinput} value={name} placeholder="Enter your Name" onFocus={() => {
                        setNamecolor(true);
                        setEmailcolor(false);
                        setpasswordcolor(false)
                        setcpasswordcolor(false)
                    }}
                        onChange={(e) => setName(e.nativeEvent.text)}></TextInput>
                </View>
                <View style={styles.input}>
                    <MaterialIcons name="email" size={24} color={emailcolor ? "#ff4242" : "gray"} />
                    <TextInput style={styles.textinput} value={email} placeholder="Enter your Email" onFocus={() => {
                        setEmailcolor(true);
                        setNamecolor(false);
                        setpasswordcolor(false)
                        setcpasswordcolor(false)
                    }}
                        onChange={(e) => setEmail(e.nativeEvent.text)}></TextInput>
                </View>

                <View style={styles.input}>
                    <AntDesign name="lock1" size={24} color={passwordcolor ? "#ff4242" : "gray"} />
                    <TextInput style={styles.textinput} value={password} secureTextEntry={passshow} placeholder="Enter password here" onFocus={() => {
                        setEmailcolor(false);
                        setNamecolor(false);
                        setpasswordcolor(true)
                        setcpasswordcolor(false)
                    }}
                        onChange={(e) => setPassword(e.nativeEvent.text)}></TextInput>
                    <FontAwesome name={passshow ? "eye" : "eye-slash"} style={styles.eye} size={24} color="gray" onPress={() => setpassshow(!passshow)} />
                </View>

                {/* <View style={styles.input}>
                    <AntDesign name="lock1" size={24} color={cpasswordcolor?"#ff4242":"gray"} />
                    <TextInput style={styles.textinput} secureTextEntry={cpassshow} placeholder="Reenter password here" onFocus={()=>{
                        setEmailcolor(false);
                        setpasswordcolor(false)
                        setcpasswordcolor(true)
                        }}></TextInput>
                    <FontAwesome name={cpassshow?"eye":"eye-slash"} size={24} color="gray" onPress={()=>setcpassshow(!cpassshow)}/>
                </View> */}

                <Text style={styles.enteraddress}>Please enter your address</Text>

                <View style={styles.input}>
                    <TextInput style={styles.textinput} value={address} placeholder="Enter your Address"
                        onChange={(e) => setAddress(e.nativeEvent.text)}
                        onFocus={() => {
                            setEmailcolor(false);
                            setpasswordcolor(false)
                            setcpasswordcolor(false)
                        }}></TextInput>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttontext}>
                        proceed
                    </Text>
                </TouchableOpacity>

                <Text style={styles.or}>OR</Text>
                <Text style={styles.signin}>Sign In With</Text>
            </View>
            <View style={styles.gficons}>
                <View style={styles.gficon}>
                    <AntDesign name="google" size={24} color="#FF4242" />

                </View>
                <View style={styles.gficon}>
                    <EvilIcons name="sc-facebook" size={34} color="blue" />

                </View>

            </View>
            <View style={styles.hr}></View>
            <Text>Already have an account? <Text style={{ color: "#ff4242" }} onPress={() => navigation.navigate('login')}>Sign In</Text></Text>

            {loading ?
                <Loader />
                : ""}
        </View>
        </ScrollView>

    )
}

export default Signup

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
        color: "#ff4242",
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
  eye:{
    position:"absolute",
    right:10,
  },
    enteraddress: {
        color: "#888",
        fontSize: 15,
        marginBottom: 20
    },
    or: {
        color: "#ff4242",
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
        backgroundColor: "#FF4242",
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