import { StyleSheet, Text, View, StatusBar, TouchableOpacity,ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react';
import Nav from '../components/Nav';
// firebase imports
import { db, storage,firebase } from '../Firebase/firebaseConfig'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
    or,
  } from "firebase/firestore";
  
import AsyncStorage from '@react-native-async-storage/async-storage';

  import { AntDesign } from '@expo/vector-icons';
  import { Feather } from '@expo/vector-icons';
  import { Entypo } from '@expo/vector-icons';
  import { Ionicons } from '@expo/vector-icons';

  
import * as Location from 'expo-location';

const Findorder = ({navigation}) => {
    
const [email, setEmail] = useState('');

const [users, setUsers] = useState([]);
const [user, setUser] = useState([]);
const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
      setEmail(value);
        // alert(value)
     
    } catch (e) {
      // error reading value
    }
  }


    const getLocation=async () => {
    
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
    
        let location = await Location.getCurrentPositionAsync({});
        setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude })
        // console.warn(location.coords.latitude);
        // console.warn(location.coords.longitude);
      }

// SystemNavigationBar.setNavigationColor('red');
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);
    const orderRef = firebase.firestore().collection('Orders');
    const userRef = firebase.firestore().collection('DeliveryBoy');
    
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });
    useEffect(() => {
        orderRef.onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )

        userRef.onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )
        // bottomColorChange();
        
        // SystemNavigationBar.setNavigationColor('red');

        getData()
        getLocation();
        
    }, [])
    // const bottomColorChange = async () => {
    //     try{
    //         const response = await changeNavigationBarColor('red', true);
    //         console.log(response)// {success: true}
    //     }catch(e){
    //         console.log(e)// {success: false}
    //     }
      
    // };


    useEffect(() => {
        setOrder(orders.filter((item) => item.status.includes("accepted")))

    }, [orders])

    useEffect(() => {
        setUser(users.filter((item) => item.email.includes(email)))

    }, [users])

    useEffect(() => {
        console.log(user)

    }, [user])

    useEffect(() => {
        console.log(order)
    }, [order])
const getOrder=async(ID,id)=>{  
    const orderDoc = doc(db, "Orders", ID);
    const newFields = { deliveryBoyEmail:user[0].email,deliveryBoyName:user[0].name ,deliveryBoyPhone:user[0].phone ,status:"gotpartner",deliveryBoyLat:origin.latitude,deliveryBoyLon:origin.longitude };
    await updateDoc(orderDoc,newFields).catch((error) => {
        console.log("Error updating document: ", error);
    });
    alert("You Got the order");
    navigation.replace('delivery',id)

}
    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#4FB548"
                barStyle="light-content"
            />
            <Text style={styles.maintext}>Find Orders</Text>
            <View style={styles.orders}>
            <ScrollView style={{height:"100%",width:"100%"}}>
                {
                    order.length == 0 ?

                    <>
                    <Text style={{alignSelf:"center",textAlign:"center"}}>No Orders currently found</Text>
                    
                    <Text style={{alignSelf:"center",textAlign:"center"}}>still finding orders...</Text>
                    <Text style={{alignSelf:"center",textAlign:"center"}}>Please wait...</Text>
                    
                    </>
                    :
                    <>
                      {
                    order.map((item) => {

                        return (

                            <View style={styles.order} key={item.ID}>
                                
                                <Text style={styles.ordertext}>Order Id:- {item.ID}</Text>
                                <Text style={styles.ordertext}>Pick up Location:- {item.restaurantName} </Text>
                                <Text style={styles.ordertext}>Delivery Location:- {item.DeliveryAddress}</Text>
                                <Text style={styles.ordertext}>Delivery Price:- {item.DeliveryFee}</Text>
                                <Text style={styles.ordertext}>Delivery by:- {item.deliveryTime}</Text>
                                <TouchableOpacity style={styles.orderbtn} onPress={()=>{
                                    getOrder(item.ID,item.id)
                                }}><Text style={styles.orderbtntext}>Take order</Text></TouchableOpacity>

                            </View>
                        )



                    })
                }

                    
                    </>
                }
                </ScrollView>
              
            </View>
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

export default Findorder

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
    },
    orders: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",

    },
    order: {
        width: "90%",
        height: "auto",
        borderColor: "#aaa",
        borderWidth: 1,
        padding: 10,
        alignSelf: "center",
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