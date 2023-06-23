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

//  const goToYosemite=()=> {
//     openMap({ latitude: 37.865101, longitude: -119.538330 });
//   }
const HomeScreen = ({ navigation }) => {


    const yosemite = { latitude: 37.865101, longitude: -119.538330 };
    const openYosemite = createOpenLink(yosemite);


    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);

    const orderRef = firebase.firestore().collection('Orders');

    const [email, setEmail] = useState('');

    const getUser = async () => {
        try {
            const EMAIL = await AsyncStorage.getItem('email')
            //   console.warn(EMAIL)
            setEmail(EMAIL)

        } catch (e) {
            // error reading value
        }
    }



    useEffect(() => {
        orderRef.onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )
        getUser();


    }, [])

    useEffect(() => {
        // alert(email)
        setOrder(orders.filter((item) => (item.deliveryBoyEmail.includes(email) && item.status != "delivered")))
       
    }, [orders, email])


    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#4FB548"
                barStyle="light-content"
            />
            <Text style={styles.maintext} >HomeScreen</Text>



            <ScrollView horizontal={true} style={styles.orderTrackSection}>



                {
                    order.map((item) => {
                        if (item.status != "delivered" && item.status != "gotpayment" && item.status != "paid")
                            return (

                                <TouchableOpacity style={styles.orderTrackBox} key={item.id} onPress={() => navigation.navigate('trackorder', item.id)}>
                                    {item.status == "pending" ? <Text>pending</Text> : ""}
                                    {item.status == "accepted" ? <Text>processing food</Text> : ""}
                                    {item.status == "gotpartner" ? <Text>processing food</Text> : ""}
                                    {item.status == "partnerreachedrestaurant" ? <Text>packing</Text> : ""}
                                    {item.status == "handovered" ? <Text>on the way</Text> : ""}
                                    {item.status == "reached" ? <Text>reached to you</Text> : ""}

                                    <TouchableOpacity style={styles.orderTrackBtn} onPress={() => navigation.navigate('delivery', item.id)}><Text style={styles.orderTrackBtnText}>View</Text></TouchableOpacity>

                                </TouchableOpacity>

                            )
                    })
                }



            </ScrollView>



























            <View style={styles.nav}>
                <View style={styles.maainBox}>
                    <TouchableOpacity onPress={() => { navigation.navigate("homescreen") }}>
                        <View style={styles.navTab}>
                            <AntDesign name="home" size={24} color="#fff" />
                            <Text style={styles.navTabText}>Home</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity  /*onPress={openYosemite}*/ onPress={() => { navigation.navigate("history") }}>
                        <View style={styles.navTab}>
                            <Feather name="list" size={24} color="#fff" />
                            <Text style={styles.navTabText}>History</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("findorder") }}>
                        <View style={styles.navTab}>
                            <Entypo name="magnifying-glass" size={24} color="#fff" />
                            <Text style={styles.navTabText}>Find Order</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.replace("profile") }}>
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

export default HomeScreen

const styles = StyleSheet.create({
    maintext: {
        fontSize: 20,
        color: "#555",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 30
    },
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
     orderTrackSection: {
        width: "90%",
        height: 100,
        marginLeft: "5%",
        position: "absolute",
        paddingTop: 20,
        paddingBottom: 10,
        paddingRight: 10,
        bottom: 0,
        flexDirection: "row",
        marginBottom:30,


    },
    orderTrackBox: {
        height: 50,
        width: 220,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#eee",
        opacity: 0.9,
        elevation: 5,
        flexDirection: "row",
        marginLeft: 30,
        marginRight: 10,
        borderRadius: 10,

    },
    orderTrackBtn: {
        width: 50,
        backgroundColor: "#4FB548",
        padding: 5,
        borderRadius: 10
    },
    orderTrackBtnText: {
        textAlign: "center",

    }

})