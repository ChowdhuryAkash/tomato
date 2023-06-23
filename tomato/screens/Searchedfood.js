import { StyleSheet, Text, View, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
    addDoc, collection, getDocs, query, where, updateDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../Firebase/firebaseConfig'
// import {Grayscale} from 'react-native-color-matrix-image-filters';

const Searchedfood = ({ navigation, route }) => {
    const fooddata = route.params;
    // const fooddata = "butter paneer";


    const [foodData, setFoodData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [gotFood, setGotFood] = useState(false);
    const [loading, setLoading] = useState(1)


    const foodRef = firebase.firestore().collection('FoodData').where("availablity", "==", true);




    const [restaurantData, setRestaurantData] = useState([]);
    const [showrestaurantData, setShowrestaurantData] = useState([]);
    const restaurantRef = firebase.firestore().collection('Restaurants');


    useEffect(() => {
        restaurantRef.onSnapshot(snapshot => {
            setRestaurantData(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


    }, [])

    useEffect(() => {
        console.log(restaurantData);


    }, [restaurantData])







    useEffect(() => {
        // import AsyncStorage from '@react-native-async-storage/async-storage';
        const value = AsyncStorage.getItem('email')
        //  cheching authication and redirect
        if (value == "400") {
            navigation.replace("homescreen")

        }
    }, [])

    useEffect(() => {
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )
    }, [])

    useEffect(() => {
        setShowData(foodData.filter((item) => item.foodName.toLowerCase().includes(fooddata)))
        setLoading(0);
    }, [foodData])

    useEffect(() => {
        if (showData.length > 0) {
            setGotFood(true)

        }
    }, [showData])




    if (gotFood) {
        return (
            <ScrollView>
                <StatusBar
                    backgroundColor="#ff4242"
                    barStyle="light-content"
                />
                <Text style={styles.maintext}>All resturants who serve {fooddata}</Text>
                {showData.map((item) => {
                    return (
                        <View key={item.id}>

                            {restaurantData.map((restaurant) => {
                                if (restaurant.restaurantEmail == item.restaurantEmail && restaurant.open) {
                                    return (
                                        <View key={item.id} style={styles.box}>
                                            <View style={styles.productimageouter}>
                                                <Image source={{ uri: item.foodImageUrl }} style={styles.img}></Image>

                                            </View>
                                            <View style={styles.resdetails}>
                                                <Text style={styles.resname}>Restaurant : {item.restaurantName}</Text>

                                            </View>
                                            <View style={styles.itemdetails}>
                                                <Text style={styles.foodname}>{item.foodName}</Text>
                                                <Text style={styles.foodprice}>RS: {item.foodPrice} /-</Text>
                                            </View>
                                            <TouchableOpacity style={styles.boxbutton} onPress={() => navigation.navigate('restaurant', item.id)}>
                                                <Text style={styles.boxbuttontext}>View</Text>

                                            </TouchableOpacity>

                                        </View>


                                    )

                                }
                                else if (restaurant.restaurantEmail == item.restaurantEmail && !restaurant.open) {
                                    return (
                                        <View key={item.id} style={styles.box}>
                                            <View style={styles.productimageouter}>
                                                {/* <Grayscale> */}
                                                <Text style={styles.closedText}>Restaurant is closed</Text>
                                                <Image source={{ uri: item.foodImageUrl }} style={styles.grayimg} />

                                                {/* </Grayscale> */}


                                            </View>
                                            <View style={styles.resdetails}>
                                                <Text style={styles.resname}>Restaurant : {item.restaurantName}</Text>

                                            </View>
                                            <View style={styles.itemdetails}>
                                                <Text style={styles.foodname}>{item.foodName}</Text>
                                                <Text style={styles.foodprice}>RS: {item.foodPrice} /-</Text>
                                            </View>
                                            <TouchableOpacity style={styles.boxbutton} onPress={() => navigation.navigate('restaurant', item.id)}>
                                                <Text style={styles.boxbuttontext}>View</Text>

                                            </TouchableOpacity>

                                        </View>


                                    )

                                }


                            })}
                        </View>




                    )
                })}
                {loading ?
                    <Loader />
                    : ""}
            </ScrollView>
        )

    }
    else {
        return (
            <Text style={styles.sorry}>Sorry no restaurant is delivering {fooddata} right now</Text>
        )
    }

}

export default Searchedfood

const styles = StyleSheet.create({
    maintext: {
        fontSize: 16,
        color: "#999",
        textAlign: "center",
        marginTop: 20,
        textDecorationColor: "#ff4242",
    },
    box: {
        width: "90%",
        height: 350,
        elevation: 10,
        margin: "5%",
        backgroundColor: "#FFF",
        borderRadius: 10,
    },
    productimageouter: {
        width: "100%",
        height: 200,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    img: {
        height: "100%",
        width: "100%",
        borderRadius: 10,
    },
    closedText: {
        position: "absolute",
        top: 100,
        width: "100%",
        textAlign: "center",
        fontSize: 30
    },
    grayimg: {
        height: "100%",
        width: "100%",
        borderRadius: 10,
        opacity: 0.1
    },
    resdetails: {
        width: "100%",
        height: 50,
        padding: 10,

    },
    itemdetails: {
        width: "100%",
        height: 50,
        padding: 10,
        flexDirection: "row",
    },
    resname: {
        fontWeight: 500,
        color: "#555",
        fontSize: 20,

    },
    foodname: {
        fontWeight: 500,
        color: "#999",
        fontSize: 16,

    },
    foodprice: {
        marginLeft: 20,
        fontWeight: 500,
        color: "#FFF",
        fontSize: 17,
        backgroundColor: "#ff4242",
        textAlign: "center",
        padding: 4,
        borderRadius: 10,
    },
    boxbutton: {
        width: "90%",
        height: 40,
        backgroundColor: "#ff4242",
        marginLeft: "5%",
        alignItems: "center",
        borderRadius: 15
        ,
    },
    boxbuttontext: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 4
    },
    sorry: {
        textAlign: "center",
        marginTop: 100,
        fontSize: 20,
        color: "#777"
    }
})