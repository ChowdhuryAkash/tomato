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
    const [loading, setLoading] = useState(1);
    const [origin, setOrigin] = useState({ latitude: 22.5219843, longitude: 88.3929623 });


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


    const distance = (lat1,
        lat2, lon1, lon2) => {

        // The math module contains a function
        // named toRadians which converts from
        // degrees to radians.
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;

        // Haversine formula
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2)
            + Math.cos(lat1) * Math.cos(lat2)
            * Math.pow(Math.sin(dlon / 2), 2);

        let c = 2 * Math.asin(Math.sqrt(a));

        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;

        // calculate the result
        return (c * r);
    }


    const getLocation = async () => {

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
                <Text style={styles.maintext}>All resturants near to you (within 10km) who serve {fooddata}</Text>
                {showData.map((item) => {
                    return (
                        <View key={item.id}>

                            {restaurantData.map((restaurant) => {
                                if (restaurant.restaurantEmail == item.restaurantEmail && restaurant.open && distance(origin.latitude, restaurant.lat, origin.longitude, restaurant.long) < 10) {
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
                                            <Text style={styles.distanceText}>Distance : {parseFloat(distance(origin.latitude, restaurant.lat, origin.longitude, restaurant.long)).toFixed(2)} KM</Text>
                                            
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
        width: "90%",
        alignSelf: "center",
        textDecorationColor: "#ff4242",
    },
    box: {
        width: "90%",
        height: "auto",
        elevation: 10,
        margin: "5%",
        backgroundColor: "#FFF",
        borderRadius: 10,
        paddingBottom: 10,
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
        justifyContent: "space-between",
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
    distanceText:{
        marginLeft:10,
        color:"#999",
        marginBottom:16,
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