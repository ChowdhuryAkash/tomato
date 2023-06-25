import { StyleSheet, Text, View, StatusBar, TouchableOpacity,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';

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

import { createOpenLink } from 'react-native-open-maps';



import Homescreen from './Homescreen';
import Findorder from './Findorder';
import Delivery from './Delivery';
import History from './History';
import Profile from './Profile';

const Main = ({navigation}) => {
    const [page, setPage] = useState("homescreen");

const logout = () => {

    AsyncStorage.setItem('email', "400");
    navigation.replace("login");
}
const navigatetohistory = () => {
    // setPage("history");
    alert("history")
}




  return (
    <View style={styles.main}>
      {/* <Text>Main</Text> */}
      {
        page === "homescreen" ? <Homescreen navigating={(page,value)=>{navigation.navigate(page,value)}} /> : null
      }
      {
        page === "findorder" ? <Findorder history={()=>{alert("history")}} navigating={(page,value)=>{navigation.navigate(page,value)}}/> : null
      }
      {
        page === "profile" ? <Profile logout={logout} navigating={(page,value)=>{navigation.navigate(page,value)}}/> : null
      }
      {
        page === "history" ? <History /> : null
      }


      






      <View style={styles.nav}>
    <View style={styles.maainBox}>
        <TouchableOpacity onPress={() => { setPage("homescreen") }}>
            <View style={styles.navTab}>
                <AntDesign name="home" size={24} color="#fff" />
                <Text style={styles.navTabText}>Home</Text>
            </View>
        </TouchableOpacity>

        <TouchableOpacity  /*onPress={openYosemite}*/ onPress={() => { setPage("history") }}>
            <View style={styles.navTab}>
                <Feather name="list" size={24} color="#fff" />
                <Text style={styles.navTabText}>History</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setPage("findorder") }}>
            <View style={styles.navTab}>
                <Entypo name="magnifying-glass" size={24} color="#fff" />
                <Text style={styles.navTabText}>Find Order</Text>
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
        height: 60,

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
    },
})