import { StyleSheet, Text, View, StatusBar, TouchableOpacity, } from 'react-native'
import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
// firebase imports
import { db, storage,firebase } from '../Firebase/firebaseConfig'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
  } from "firebase/firestore";
  import AsyncStorage from '@react-native-async-storage/async-storage';



  import { AntDesign } from '@expo/vector-icons';
  import { Feather } from '@expo/vector-icons';
  import { Entypo } from '@expo/vector-icons';
  import { Ionicons } from '@expo/vector-icons';
const Profile = ({navigation}) => {

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
          // alert(value)
          if(value =="400") {
            navigation.replace("login")
           
          }
          else{
            // navigation.replace("homescreen")
          }
        } catch(e) {
          // error reading value
        }
      }
          useEffect(()=>{
            getData();
            // import AsyncStorage from '@react-native-async-storage/async-storage';
            const value =  AsyncStorage.getItem('email')
            //  cheching authication and redirect
              if(value =="400") {
                navigation.replace("homescreen")
               
              }
        },[])

  return (
    <View style={styles.main}>
         <StatusBar
                backgroundColor="#4FB548"
                barStyle="light-content"
            />
      <Text style={styles.maintext}>Profile</Text>
      <Text style={styles.logout} onPress={()=>{
        storeData("400");
        getData();
        

      }}>Logout</Text>

      <View style={styles.nav}>
      <View style={styles.maainBox}>
            <TouchableOpacity  onPress={() => { navigation.navigate("homescreen") }}>
                <View style={styles.navTab}>
                    <AntDesign name="home" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Home</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => { navigation.navigate("history") }}>
                <View style={styles.navTab}>
                    <Feather name="list" size={24} color="#fff" />
                    <Text style={styles.navTabText}>History</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { navigation.navigate("findorder") }}>
                <View style={styles.navTab}>
                    <Entypo name="magnifying-glass" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Find Order</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { navigation.replace("profile") }}>
                <View style={styles.navTab}>
                    <Ionicons name="person-circle" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Profile</Text>
                </View>
            </TouchableOpacity>
        </View>

        </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  maintext: {
    fontSize: 20,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30
},
    main:{
        flex:1,
    }
    ,logout:{
        color:"red",
        fontSize:30,
        textAlign:"center",
        marginTop:30
    },
    nav:{
        position:"absolute",
        bottom:0,
        left:0,
        width:"100%",
        height:60,

    },
    maainBox: {
        width: "100%",
        height: 60,
        backgroundColor: "#4FB548",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    navTab: {
        justifyContent: "center",
        alignItems: "center",
    },
    navTabText: {
        textAlign: "center",
        color: "#fff",
    }
})