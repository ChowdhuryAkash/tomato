import { StyleSheet, Text, View, StatusBar, TouchableOpacity,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
// firebase imports
import { db, storage, firebase } from '../Firebase/firebaseConfig'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";



import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';




import Homescreen from './Homescreen';
import Createpost from './Createpost';
import Profile from './Profile';

const Main = ({navigation}) => {
    const [page, setPage] = useState("homescreen");

const logout = () => {

    AsyncStorage.setItem('email', "400");
    navigation.replace("login");
}




  return (
    <View style={styles.main}>
      {/* <Text>Main</Text> */}
      {
        page === "homescreen" ? <Homescreen navigating={(page,value)=>{navigation.navigate(page,value)}} /> : null
      }
      {
        page === "createpost" ? <Createpost history={()=>{alert("history")}} navigating={(page,value)=>{navigation.navigate(page,value)}}/> : null
      }
      {
        page === "profile" ? <Profile logout={logout} navigating={(page,value)=>{navigation.navigate(page,value)}}/> : null
      }
     

      






      <View style={styles.nav}>
    <View style={styles.maainBox}>
        <TouchableOpacity onPress={() => { setPage("homescreen") }}>
            <View style={styles.navTab}>
                <AntDesign name="home" size={24} color="#fff" />
                <Text style={styles.navTabText}>Home</Text>
            </View>
        </TouchableOpacity>

       
        <TouchableOpacity onPress={() => { setPage("createpost") }}>
            <View style={styles.navTab}>
            <AntDesign name="pluscircleo" size={44} color="#fff" />
                <Text style={styles.navTabText}>Create post</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setPage("profile") }}>
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

export default Main

const styles = StyleSheet.create({
    main: {
        flex: 1,
    },
    nav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 70,

    },
    maainBox: {
        width: "100%",
        height: 75,
        backgroundColor: "#ff3d00",
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
    },
})