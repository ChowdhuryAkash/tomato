import { StyleSheet, Text, View, TextInput, TouchableOpacity, AsyncStorage, ScrollView, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import Loader from '../components/Loader';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { db, storage ,firebase} from '../Firebase/firebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();


const Signup = ({ navigation }) => {
    useEffect(() => {
        getData();
    
        
    
      }, [])
    const [loading, setLoading] = useState(false)
    const [emailcolor, setEmailcolor] = useState(false);
    const [namecolor, setNamecolor] = useState(false);
    const [phonecolor, setPhonecolor] = useState(false);
    const [passwordcolor, setpasswordcolor] = useState(false);
    const [cpasswordcolor, setcpasswordcolor] = useState(false);

    const [passshow, setpassshow] = useState(true);
    const [cpassshow, setcpassshow] = useState(true);

    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [name, setName] = useState(null);
    const [phone, setPhone] = useState(null);

    const [registered, setRegistered] = useState(false)

    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('email')
            alert(value);
          if (value == "400" || value == null) {
            // navigation.navigate("homescreen")
    
          }
          else {
            if(value.length>0){
              navigation.replace("homescreen");
            }
          }
        } catch (e) {
          // error reading value
        }
      }
    
    

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(1);


        // console.log(url)
        // setFoodImageUrl(url)

        const userData = {
            name,
            email,
            password,
            phone,
        }
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                // alert("Rregistered successfuly!");
                // setRegistered(true);
                try {
                    const docRef = addDoc(collection(db, "DeliveryBoy"), userData);
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
            <StatusBar
                backgroundColor="#4FB548"
            />
            <View style={styles.main}>
                <Text style={styles.signuptext}>Signup</Text>
                <View style={styles.inputs}>
                    <View style={styles.input}>
                        <AntDesign name="user" size={24} color={namecolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={name} placeholder="Enter your Name" onFocus={() => {
                            setNamecolor(true);
                            setEmailcolor(false);
                            setpasswordcolor(false)
                            setcpasswordcolor(false)
                            setPhonecolor(false);
                        }}
                            onChange={(e) => setName(e.nativeEvent.text)}></TextInput>
                    </View>
                    <View style={styles.input}>
                        <MaterialIcons name="email" size={24} color={emailcolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={email} placeholder="Enter your Email" onFocus={() => {
                            setEmailcolor(true);
                            setNamecolor(false);
                            setpasswordcolor(false)
                            setcpasswordcolor(false)
                            setPhonecolor(false);
                        }}
                            onChange={(e) => setEmail(e.nativeEvent.text)}></TextInput>
                    </View>

                    <View style={styles.input}>
                        <AntDesign name="lock1" size={24} color={passwordcolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={password} secureTextEntry={passshow} placeholder="Enter password here" onFocus={() => {
                            setEmailcolor(false);
                            setNamecolor(false);
                            setpasswordcolor(true)
                            setcpasswordcolor(false)
                            setPhonecolor(false);
                        }}
                            onChange={(e) => setPassword(e.nativeEvent.text)}></TextInput>
                        <FontAwesome name={passshow ? "eye" : "eye-slash"} style={styles.eye} size={24} color="gray" onPress={() => setpassshow(!passshow)} />
                    </View>

                    <View style={styles.input}>
                    <Feather name="phone" size={24} color={phonecolor ? "#4FB548" : "gray"} />
                        <TextInput style={styles.textinput} value={phone} placeholder="Enter your phone number"
                            onChange={(e) => setPhone(e.nativeEvent.text)}
                            onFocus={() => {
                                setEmailcolor(false);
                                setpasswordcolor(false)
                                setcpasswordcolor(false)
                                setPhonecolor(true);
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
                        <AntDesign name="google" size={24} color="#4FB548" />

                    </View>
                    <View style={styles.gficon}>
                        <EvilIcons name="sc-facebook" size={34} color="blue" />

                    </View>

                </View>
                <View style={styles.hr}></View>
                <Text>Already have an account? <Text style={{ color: "#4FB548" }} onPress={() => navigation.navigate('login')}>Sign In</Text></Text>

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