import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView,Image } from 'react-native'
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
const HomeScreen = (props) => {


    const yosemite = { latitude: 37.865101, longitude: -119.538330 };
    const openYosemite = createOpenLink(yosemite);


    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);
    const[todayOrder,setTodayOrder]=useState([]);

    const [numberOfOrders, setNumberOfOrders] = useState(0);
    const [totalEarning, setTotalEarning] = useState(0);
    const[totalTime,setTotalTime]=useState(0);


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
        var currentdate = new Date();
        var date = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear();
        setOrder(orders.filter((item) => (item.deliveryBoyEmail.includes(email) && item.status != "delivered")))
        setTodayOrder(orders.filter((item) => (item.deliveryBoyEmail.includes(email) && (item.status == "delivered" || item.status == "gotpayment" || item.status == "paid") && item.date==date)))  

    }, [orders, email])

    useEffect(() => {
        setNumberOfOrders(todayOrder.length);
        setTotalEarning(todayOrder.length*70);
        setTotalTime(todayOrder.length*30);
        
    }, [todayOrder])


    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#4FB548"
                barStyle="light-content"
            />
            <Text style={styles.maintext} >Welcome, Akash Chowdhury</Text>
            <Text style={styles.activitytext} >----- Today's activity -----</Text>
            <View style={styles.activitySection}>
                <View style={styles.activityBox}>
                    <Text style={styles.activityBoxText1}>Total Orders</Text>
                    <Text style={styles.activityBoxText2}>{numberOfOrders}</Text>
                </View>

                <View style={styles.activityBox}>
                    <Text style={styles.activityBoxText1}>Total Earning</Text>
                    <Text style={styles.activityBoxText2}>{totalEarning}</Text>
                </View>
                <View style={styles.activityBox}>
                    <Text style={styles.activityBoxText1}>Total minute</Text>
                    <Text style={styles.activityBoxText2}>{totalTime} </Text>
                </View>

                <View style={styles.activityBox}>
                    <Text style={styles.activityBoxText1}>Doing Well</Text>
                    <Text style={styles.activityBoxText2}>👍</Text>
                </View>

            </View>

            <Image
                    style={styles.namasteImage}
                    source={require('../assets/delivery.png')}
                />



            <ScrollView horizontal={true} style={styles.orderTrackSection}>



                {
                    order.map((item) => {
                        if (item.status != "delivered" && item.status != "gotpayment" && item.status != "paid")
                            return (

                                <TouchableOpacity style={styles.orderTrackBox} key={item.id} onPress={() => props.navigating('delivery', item.id)}>
                                    {item.status == "pending" ? <Text>pending</Text> : ""}
                                    {item.status == "accepted" ? <Text>processing food</Text> : ""}
                                    {item.status == "gotpartner" ? <Text>processing food</Text> : ""}
                                    {item.status == "partnerreachedrestaurant" ? <Text>packing</Text> : ""}
                                    {item.status == "handovered" ? <Text>on the way</Text> : ""}
                                    {item.status == "reached" ? <Text>reached to customer</Text> : ""}

                                    <TouchableOpacity style={styles.orderTrackBtn} onPress={() => props.navigating('delivery', item.id)}><Text style={styles.orderTrackBtnText}>View</Text></TouchableOpacity>

                                </TouchableOpacity>

                            )
                    })
                }



            </ScrollView>




























        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    
    main: {
        flex: 1,
    },
    maintext: {
        fontSize: 20,
        color: "#555",
        textAlign: "left",
        marginTop: 10,
        marginBottom: 30,
        marginLeft: 12,
    },
    activitytext: {
        fontSize: 16,
        color: "#555",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 12,

    },
    activitySection: {
        width: "90%",
        height: "auto",
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        flexWrap: "wrap",
    },
    activityBox: {
        width: "46%",
        height: "auto",
        alignItems: "center",
        backgroundColor: "rgba(222,255,221, 1)",
        opacity: 0.9,
        elevation: 15,
        borderRadius: 5,
        marginBottom: 30,
        padding: 10,

    },
    activityBoxText1: {
        fontSize: 22,
        color: "#888",
        textAlign: "center",
        marginTop: 0,
        marginBottom: 2,

    },
    activityBoxText2: {
        fontSize: 19,
        color: "#444",
        textAlign: "center",
        marginBottom: 10,
        fontWeight: "bold",

    },
    namasteImage: {
        height: 130,
        width: 150,
        alignSelf: "center",



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
        marginBottom: 30,


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
        marginBottom: 10,

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