import { StyleSheet, Text, View, StatusBar, TouchableOpacity, ScrollView } from 'react-native'
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




const History = ({ navigation }) => {



    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);
    const [email, setEmail] = useState('');

    const [foodData, setFoodData] = useState([]);
    const [showData, setShowData] = useState([]);
    const foodRef = firebase.firestore().collection('FoodData');


    const orderRef = firebase.firestore().collection('Orders');
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            setEmail(value);
            // alert(value)

        } catch (e) {
            // error reading value
            alert("error")
        }
    }

    useEffect(() => {
        orderRef.onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


        getData();
    }, [])

    useEffect(() => {
        // alert(email)
        setOrder(orders.filter((item) => (item.userEmailId.includes(email) && item.status == "delivered")))
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )
    }, [orders, email])





    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#ff4242"
                barStyle="light-content"
            />
            <Text style={styles.maintext}>Your Order History</Text>

            <View style={styles.orders}>
                <ScrollView style={{ height: "100%", width: "100%", }}>

                    {
                        order.map((item) => {

                            return (


                                <View style={styles.order} key={item.ID}>
                                    <Text style={styles.ordertext}>Order Id:- {item.ID}</Text>
                                    <Text style={styles.ordertext}>Order Items:- </Text>
                                    {item.order.map((menu) => {
                                        return (
                                            <View style={{marginBottom:10}} key={menu.id}>
                                                {
                                                    foodData.map((food) => {
                                                        if (food.id == menu.id && menu.quantity > 0)
                                                            return (
                                                                <Text key={food.id} style={{marginLeft:20}}>{`${food.foodName} -- ${menu.quantity}`}</Text>
                                                            )

                                                    })
                                                }
                                            </View>

                                        )


                                    })}
                                    <Text style={styles.ordertext}>Order Date:- {item.date}</Text>
                                    <Text style={styles.ordertext}>Order Time:- {item.time}</Text>
                                    <Text style={styles.ordertext}>Restaurant:- {item.restaurantName} </Text>
                                    <Text style={styles.ordertext}>Delivery Location:- {item.DeliveryAddress}</Text>
                                    <Text style={styles.ordertext}>Food Price:- {item.foodPrice}</Text>
                                    <Text style={styles.ordertext}>Delivery Fee:- {item.DeliveryFee}</Text>
                                   

                                </View>





                            )



                        })
                    }
                </ScrollView>
            </View>

















            {/* <View style={styles.nav}>
                <View style={styles.maainBox}>
                    <TouchableOpacity onPress={() => { navigation.navigate("homescreen") }}>
                        <View style={styles.navTab}>
                            <AntDesign name="home" size={24} color="#fff" />
                            <Text style={styles.navTabText}>Home</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { navigation.navigate("history") }}>
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

            </View> */}
        </View>
    )
}

export default History

const styles = StyleSheet.create({
    main: {
        height: "100%",
    },
    maintext: {
        fontSize: 20,
        color: "#555",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 30
    },
    orders: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 80,
        // backgroundColor: "#f00",

    },
    order: {
        width: "90%",
        height: "auto",
        backgroundColor:"#fff",
        padding: 10,
        alignSelf: "center",
        marginTop:20,
        borderRadius: 10,
    },
    ordertext: {
        fontSize: 15,
        color: "#555",
        marginBottom: 5,

    },
    orderbtn: {
        width: "70%",
        alignSelf: "center",
        backgroundColor: "#4FB548",
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    orderbtntext: {
        color: "#fff",
        textAlign: "center",
        fontSize: 20
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
    }
})