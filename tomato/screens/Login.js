import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Loader from '../components/Loader';

import { db, storage } from '../Firebase/firebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();


const Signup = ({ navigation }) => {
  useEffect(() => {
    getData();

    

  }, [])
  const [loading, setLoading] = useState(false)
  const [emailcolor, setEmailcolor] = useState(false);
  const [passwordcolor, setpasswordcolor] = useState(false);
  const [cpasswordcolor, setcpasswordcolor] = useState(false);

  const [passshow, setpassshow] = useState(true);
  const [cpassshow, setcpassshow] = useState(true);

  const [password, setPassword] = useState(null);
  const [email, setEmail] = useState(null);
  const [loggedin, setLoggedin] = useState(false);




  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('email', value)
      setLoggedin(true);
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
        // alert(value)
      if (value == "400") {
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
    e.preventDefault()
    setLoading(1);


    // console.log(url)
    // setFoodImageUrl(url)

    const Restaurantdata = {
      email,
      password
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // console.warn(user.email);
        storeData(user.email);
        setLoading(0);
        getData();

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        switch (errorMessage) {
          case "Firebase: Error (auth/wrong-password).":
            alert("Password Mismatched, try again.");
            break;
          case "Firebase: Error (auth/user-not-found).":
            alert("No Account found with this email id");
            break;
          case "Firebase: Error (auth/invalid-email).":
            alert("Please Enter a valid email id");
            break;

          case "Firebase: Error (auth/missing-email).":
            alert("Please Enter email id");
            break;

            case "Firebase: Error (auth/missing-password).":
            alert("Please Enter apassword");
            break;
            

          default:
            alert("Something went wrong please try again.");
        }
        setLoading(0);
      });

    // console.log(foodData)

    // ======================

  }
  return (
    <ScrollView style={styles.scrollmain}>

    <View style={styles.main}>


      <Text style={styles.signuptext}>Sign In</Text>
      <View style={styles.inputs}>
        <View style={styles.input}>
          <AntDesign name="user" size={24} color={emailcolor ? "#ff4242" : "gray"} />
          <TextInput style={styles.textinput} value={email} placeholder="Enter your Email"
            onChange={(e) => setEmail(e.nativeEvent.text)}
            onFocus={() => {
              setEmailcolor(true);
              setpasswordcolor(false)
              setcpasswordcolor(false)
            }}></TextInput>
        </View>


        <View style={styles.input}>
          <AntDesign name="lock1" size={24} color={passwordcolor ? "#ff4242" : "gray"} />
          <TextInput style={styles.textinput} value={password} secureTextEntry={passshow}
            onChange={(e) => setPassword(e.nativeEvent.text)}
            placeholder="Enter password here" onFocus={() => {
              setEmailcolor(false);
              setpasswordcolor(true)
              setcpasswordcolor(false)
            }}></TextInput>
          <FontAwesome name={passshow ? "eye" : "eye-slash"} style={styles.eye} size={24} color="gray" onPress={() => setpassshow(!passshow)} />
        </View>



        <Text style={styles.enteraddress}>Forgot Password ?</Text>


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
      <TouchableOpacity style={styles.button} onPress={
        handleSubmit
      }>
        <Text style={styles.buttontext}>
          Sign in
        </Text>
      </TouchableOpacity>
      <View style={styles.hr}></View>
      <Text>Don't have an account? <Text style={{ color: "#ff4242" }} onPress={() => { navigation.navigate("signup") }}>Sign Up</Text></Text>
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
    marginTop: 100,
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
    marginBottom: 20,

  },
  textinput: {
    marginHorizontal: 10,
    width: 260,
    height:50,

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
    marginBottom: 30,
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
    marginVertical: 30
  },
  button: {
    backgroundColor: "#FF4242",
    width: 220,
    height: 40,
    padding: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginTop: 30

  },
  buttontext: {
    textAlign: "center",
    color: "#fff",
    fontWeight: 600,
    fontSize: 22,

  }
})