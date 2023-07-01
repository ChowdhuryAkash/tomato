import { StyleSheet, Text, View, StatusBar,Image,TouchableOpacity } from 'react-native'
import React, { useState,useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../components/Loader';

import { db, storage, firebase } from '../Firebase/firebaseConfig'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
    or,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import * as ImagePicker from 'expo-image-picker';


import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


const Profile = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const[ID,setID]=useState('')
  const [image, setImage] = useState(null);
  
  const [profilePic, setProfilePic] = useState(' ');
  const [loading, setLoading] = useState(false);


  const [users, setUsers] = useState([]);
  const [user, setUser] = useState([]);
  const userRef = firebase.firestore().collection('users');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
    });
    setImage(result.assets[0]);
};

const uploadImage = async () => {
  setLoading(true);
  const fileName = image.uri.split('/').pop();
  const response = await fetch(image.uri)
  // console.log(response)
  
  const blob = response.blob()
  console.log("blob", blob)
  const imageRef = ref(storage, `ProfileImages/${fileName}`)
  uploadBytes(imageRef, blob._j)
      .then(async () => {
          getDownloadURL(imageRef)
              .then(async (url) => {
                  const PostData = {
                     profilePic: url,
                  }

                  const userDoc = doc(db, "users", ID);
                  
                  await updateDoc(userDoc, PostData).catch((error) => {
                      setLoading(false);
                      console.log("Error updating document: ", error);
                  });
                  setLoading(false);
                  alert("Profile picture updated successfully");
                  setImage(null)
              
                        
                      
              })
      })
}

  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('email', value)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
      setEmail(value);
      // alert(value)
      if (value == "400") {
        navigation.replace("login")

      }
      else {
        // navigation.replace("homescreen")
      }
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    getData();
    // import AsyncStorage from '@react-native-async-storage/async-storage';
    const value = AsyncStorage.getItem('email')
    //  cheching authication and redirect
    if (value == "400") {
      navigation.replace("homescreen")

    }


    userRef.onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
  }
  )
  }, [])
  useEffect(() => {
    setUser(users.filter((item) => item.email.includes(email)))

}, [users])
useEffect(() => {
  if(user.length>0){
    setName(user[0].name)
    setPhone(user[0].phone)
    setAddress(user[0].address)
    setPassword(user[0].password)
    setID(user[0].ID)
    setProfilePic(user[0].profilePic)
    
  }

}, [user])
  return (
    <View style={styles.main}>
      <StatusBar
        backgroundColor="#ff4242"
        barStyle="light-content"
      />
      <TouchableOpacity onPress={()=>{
      navigation.navigate("homescreen")
      }}>
      <Ionicons name="arrow-back" size={24} color="#555"style={{marginLeft:20,marginTop:20,backgroundColor:"#fff",padding:6,borderRadius:80,width:35,height:38,alignItems:"center",justifyContent:"center"}} />
      </TouchableOpacity>

{
  image!=null?
  <TouchableOpacity onPress={()=>{
    uploadImage();
    }}>
     <Text style={{ fontSize: 12, fontWeight: "bold", marginTop: 0,marginLeft:200,backgroundColor:"#fff",padding:10,width:140,borderRadius:10 }}>Save Profile Picture</Text>
     </TouchableOpacity>
  :null

}
      




      <View style={styles.profileBox}>
        <View style={styles.profileBoxLeft}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 20 }}>{name}</Text>
          <Text style={{ fontSize: 15, fontWeight: 400, marginTop: 4 }}>{email}</Text>

        </View>
        <View style={styles.profileBoxRight}>
        <TouchableOpacity onPress={()=>{
          pickImageAsync();
        }}>
        <Image style={styles.welcomepagelogo} source={{uri:profilePic}} ></Image>
        </TouchableOpacity>
        

        </View>

      </View>
      <View style={styles.activities}>
      <TouchableOpacity onPress={()=>{
       
       navigation.navigate("history")
         
 
       }}>
        <View style={styles.activity}>
        <MaterialCommunityIcons name="notebook-outline" size={24} color="#555"style={{marginRight:20,backgroundColor:"#eee",padding:6,borderRadius:80}} />
        <Text style={{ fontSize: 16, fontWeight: 500, textAlign:"left",marginRight:10,color:"#333",width:200 }}>Your Orders</Text>
        <EvilIcons name="arrow-right" size={34} color="#555" />
        </View>
        </TouchableOpacity>
        <View style={styles.hr}/>

        <TouchableOpacity onPress={()=>{
       
       navigation.navigate("editprofile",{ID:ID,name:name,email:email,address:address,phone:phone})
         
 
       }}>
        <View style={styles.activity}>
        <Feather name="edit" size={24} color="#555"style={{marginRight:20,backgroundColor:"#eee",padding:6,borderRadius:80}} />
        <Text style={{ fontSize: 16, fontWeight: 500, textAlign:"left",marginRight:10,color:"#333",width:200 }}>Edit profile</Text>
        <EvilIcons name="arrow-right" size={34} color="#555" />
        </View>
        </TouchableOpacity>
        <View style={styles.hr}/>

        <View style={styles.activity}>
        <AntDesign name="message1" size={24} color="#555"style={{marginRight:20,backgroundColor:"#eee",padding:6,borderRadius:80}} />
        <Text style={{ fontSize: 16, fontWeight: 500, textAlign:"left",marginRight:10,color:"#333",width:200 }}>Complaint</Text>
        <EvilIcons name="arrow-right" size={34} color="#555" />
        </View>
       
        

      </View>

<TouchableOpacity onPress={()=>{
        storeData("400");
        getData();
        

      }}>
      <View style={styles.activities}>
        <View style={styles.activity}>
        <Feather name="power" size={24} color="#555"style={{marginRight:20,backgroundColor:"#eee",padding:6,borderRadius:80}} />
        <Text style={{ fontSize: 16, fontWeight: 500, textAlign:"left",marginRight:10,color:"#333",width:200 }}>Log out</Text>
        {/* <EvilIcons name="arrow-right" size={34} color="#555" /> */}
        </View>
        
       
        

      </View>
      </TouchableOpacity>

      
      
      {/* <Text>Profile</Text> */}
      {/* <Text style={styles.logout} onPress={()=>{
        storeData("400");
        getData();
        

      }}>Logout</Text> */}
       {loading ?
        <Loader />
        : ""}
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#eee",
  },
  profileBox: {
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  welcomepagelogo: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginTop: 0,
    padding: 10,
    borderColor: "#ff4242",
    borderWidth: 2,
  },
  activities:{
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 20,
    padding: 10,

  },
  activity:{
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems:"center",

  },
  hr:{
    height: 1,
    width: "100%",
    backgroundColor: "#eee",
    marginTop:5,
    marginLeft:0,
    marginBottom:10,

  },







  logout: {
    color: "red",
    fontSize: 30,
    textAlign: "center",
    marginTop: 30
  }
})