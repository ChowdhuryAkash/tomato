import { StyleSheet, Text, View, StatusBar, TextInput, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { SliderBox } from "react-native-image-slider-box";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import { collection, doc, getDocs, setDoc, updateDoc, where } from "firebase/firestore";
import Loader from '../components/Loader';
import { firebase } from '../Firebase/firebaseConfig'
import * as Location from 'expo-location';

const Homescreen = ({ navigation }) => {
    const [images, setImages] = useState([
        require('../assets/OfferSliderImages/img1.png'),
        require('../assets/OfferSliderImages/img2.png'),
        require('../assets/OfferSliderImages/img3.png')
    ]);


    const [search, setSearch] = useState('');



    const [loading, setLoading] = useState(1)
    const [foodData, setFoodData] = useState([]);
    const [VegData, setVegData] = useState([]);

    const [searchVal, setSearchVal] = useState("");
    const [NonVegData, setNonVegData] = useState([]);
    const [origin, setOrigin] = useState({ latitude: 22.5219843, longitude: 88.3929623 });
    const [restaurantData, setRestaurantData] = useState([]);
    const [showrestaurantData, setShowrestaurantData] = useState([]);
    const restaurantRef = firebase.firestore().collection('Restaurants');


    useEffect(() => {
        restaurantRef.onSnapshot(snapshot => {
            setRestaurantData(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


    }, [])


    const foodRef = firebase.firestore().collection('FoodData');

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
        getLocation();
    }, [])

    useEffect(() => {
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )
        LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
    }, [])

    useEffect(() => {
        setVegData(foodData.filter((item) => item.foodType == 'veg'))
        setNonVegData(foodData.filter((item) => item.foodType == 'non-veg'))
        setLoading(0)
    }, [foodData])



    const foods = [
        { id: 1, image: require('../assets/FoodImages/biryani.png'), name: "Biryani", title: "biryani" },
        { id: 11, image: require('../assets/FoodImages/chicken.png'), name: "Chicken", title: "chicken" },
        { id: 12, image: require('../assets/FoodImages/mutton.png'), name: "Mutton", title: "mutton" },
        { id: 2, image: require('../assets/FoodImages/pizza.png'), name: "Pizza", title: "pizza" },
        { id: 3, image: require('../assets/FoodImages/burger.png'), name: "Burger", title: "burger" },
        { id: 4, image: require('../assets/FoodImages/paneer.png'), name: "Paneer", title: "paneer" },
        { id: 5, image: require('../assets/FoodImages/momo.png'), name: "Momo", title: "momo" },
        { id: 6, image: require('../assets/FoodImages/fish.png'), name: "Fish", title: "fish" },
        { id: 7, image: require('../assets/FoodImages/chowmein.png'), name: "Noodles", title: "chowmein" },
        { id: 8, image: require('../assets/FoodImages/coffee.png'), name: "Coffee", title: "coffee" },
        { id: 9, image: require('../assets/FoodImages/cake.png'), name: "Cake", title: "cake" },
        { id: 10, image: require('../assets/FoodImages/fried-rice.png'), name: "Fried Rice", title: "rice" },
        { id: 13, image: require('../assets/FoodImages/icecream.png'), name: "Ice Cream", title: "cream" },
        { id: 14, image: require('../assets/FoodImages/colddrink.png'), name: "Soft drinks", title: "drink" },
    ]

    const orderRef = firebase.firestore().collection('Orders');
    const userRef = firebase.firestore().collection('users');
    // const orderRef = firebase.firestore().collection('Orders').where("userEmailId", "==", email);

    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);

    useEffect(() => {
        orderRef.onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )

        userRef.onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


    }, [])

    const getData = async () => {
        try {
            const EMAIL = await AsyncStorage.getItem('email')
            setOrder(orders.filter((item) => item.userEmailId.includes(EMAIL)))

        } catch (e) {
            // error reading value
        }
    }

    const getUser = async () => {
        try {
            const EMAIL = await AsyncStorage.getItem('email')
            //   console.warn(EMAIL)
            setUser(users.filter((item) => item.email.includes(EMAIL)))

        } catch (e) {
            // error reading value
        }
    }
    useEffect(() => {
        getData();

    }, [orders])
    useEffect(() => {
        getUser();
        // console.warn(users)
    }, [users])
    useEffect(() => {
        // getUser();
        // console.warn("user :"+user[0])
    }, [user])



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




    return (
        <ScrollView style={styles.main}>
            <StatusBar
                backgroundColor="#ff4242"
                barStyle="light-content"
            />
            <View style={styles.nav}>

                <EvilIcons name="user" size={40} color="#ff4242" onPress={() => navigation.replace("profile")} />
                <View style={styles.locationbox}>

                    {
                        user.length > 0 ?
                            <Text style={styles.foodietext}>Welcome, {user[0].name}</Text>
                            :
                            <Text style={styles.foodietext}>Welcome</Text>
                    }
                </View>

                <TouchableOpacity onPress={() => { navigation.navigate("social") }}>
                    <Text style={styles.specialtext2}>Social</Text>
                </TouchableOpacity>


            </View>

            <View style={styles.searchbox}>
                <AntDesign name="search1" size={24} color="#FF4242" />
                <TextInput style={styles.searchitem} value={search} placeholder='Search Food or Restaurant' onChangeText={(e) => {
                    setSearch(e)
                }} />
                {
                    search != "" ?
                        <Text style={{}} onPress={() => { setSearch("") }}><Entypo name="circle-with-cross" size={24} color="black" /></Text>
                        :
                        ""
                }


            </View>
            {search != '' && <View style={styles.seacrhresultsouter}>
                <FlatList style={styles.searchresultsinner} data={foodData} renderItem={
                    ({ item }) => {
                        if (item.foodName.toLowerCase().includes(search.toLowerCase())) {
                            return (
                                <>
                                    {
                                        restaurantData.map((restaurant) => {
                                           if(restaurant.restaurantEmail == item.restaurantEmail && distance(origin.latitude, restaurant.lat, origin.longitude, restaurant.long) < 10){
                                            return (
                                                <View style={styles.searchresult} >
                                                    <AntDesign name="arrowright" size={24} color="black" />
                                                    <Text style={styles.searchresulttext} onPress={() => {
                                                        setSearch("");
                                                        navigation.navigate('searchedfood', item.foodName.toLowerCase())
                                                    }}>{item.foodName}</Text>

                                                </View>
                                            )
                                                }

                                        })
                                    }
                                </>

                            )
                        }
                        if (item.restaurantName.toLowerCase().includes(search.toLowerCase())) {
                            return (
                                <>
                                    {
                                        restaurantData.map((restaurant) => {
                                           if(restaurant.restaurantEmail == item.restaurantEmail && distance(origin.latitude, restaurant.lat, origin.longitude, restaurant.long) < 10){
                                            return (
                                                <View style={styles.searchresult} >
                                                    <AntDesign name="arrowright" size={24} color="black" />
                                                    <Text style={styles.searchresulttext} onPress={() => {
                                                        setSearch("");
                                                        navigation.navigate('restaurant', item.id)
                                                    }}>{item.foodName} | {item.restaurantName}</Text>

                                                </View>
                                            )
                                                }

                                        })
                                    }
                                </>

                            )
                        }
                    }
                } />
            </View>}
            {/* <View style={styles.categories}>
                <Text style={styles.categorytext}>Categories</Text>
                <ScrollView style={styles.outer} horizontal={true}>


                    <View style={styles.scrollelement}>
                        <FontAwesome5 name="hamburger" size={24} color="#aa3030" />
                        <Text style={styles.scrollelementtext}>Burger</Text>
                    </View>

                    <View style={styles.scrollelement}>
                        <FontAwesome5 name="pizza-slice" size={24} color="#aa3030" />
                        <Text style={styles.scrollelementtext}>Pizza</Text>
                    </View>

                    <View style={styles.scrollelement}>
                        <MaterialCommunityIcons name="noodles" size={24} color="#aa3030" />
                        <Text style={styles.scrollelementtext}>Noodles</Text>
                    </View>

                    <View style={styles.scrollelement}>
                        <MaterialCommunityIcons name="bottle-soda-classic" size={24} color="#aa3030" />
                        <Text style={styles.scrollelementtext}>Drink</Text>
                    </View>


                </ScrollView>

            </View> */}


            <SliderBox
                images={images}
                style={styles.slider}
                autoplay={true}
                loop={true}
            />

            <Text style={styles.specialtext}>----- What's in your mind ? -----</Text>
            <ScrollView horizontal={true} style={styles.Items}>
                <View style={styles.ItemsInner}>
                    {foods.map((item) => {
                        return (

                            <TouchableOpacity style={styles.foodBox} key={item.id} onPress={() => navigation.navigate('searchedfood', item.title)}>
                                <Image
                                    style={styles.foodImage}
                                    source={item.image}
                                />
                                <Text style={styles.foodName}>{item.name}</Text>
                            </TouchableOpacity>

                        )

                    })}




                </View>


            </ScrollView>
            <View style={styles.namastebox}>
                <Image
                    style={styles.namasteImage}
                    source={require('../assets/namaste.png')}
                />

            </View>

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

                                    <TouchableOpacity style={styles.orderTrackBtn} onPress={() => navigation.navigate('trackorder', item.id)}><Text style={styles.orderTrackBtnText}>View</Text></TouchableOpacity>

                                </TouchableOpacity>

                            )
                    })
                }



            </ScrollView>




            {loading ?
                <Loader />
                : ""}


        </ScrollView>
    )
}

export default Homescreen

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
    },
    nav: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    foodietext: {
        color: "#111",
        fontWeight: 500,
        fontSize: 16,
    },
    searchbox: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        width: "90%",
        height: 45,
        marginTop: 15,
        borderRadius: 20,
        elevation: 20,
        padding: 10,
        alignItems: "center",
        marginLeft: "5%"
    },
    searchitem: {
        flex: 1,
        color: "#999",
        marginLeft: 10,
        width: "100%",
        height: 45,
    },
    categories: {
        height: 100,
        width: "90%",
        backgroundColor: "#fff",
        elevation: 20,
        marginTop: 10,
        borderRadius: 10,
        marginLeft: "5%"

    },
    categorytext: {
        color: "#ff4242",
        fontSize: 20,
        textDecorationColor: "#ff4242",
        textDecorationStyle: "solid",
        textAlign: "center",

    },
    outer: {
        width: "96%",
        flexDirection: "row",
        marginRight: 20,
        marginLeft: "2%",
    },
    scrollelement: {
        width: 90,
        height: 40,
        backgroundColor: "#fff",
        elevation: 6,
        marginLeft: 11,
        marginTop: 15,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",



    },
    scrollelementtext: {
        fontWeight: 700,
        color: "#555",

    },
    slider: {
        width: "90%",
        height: 200,
        borderWidth: 4,
        marginLeft: "5%",
        marginTop: 20,
        borderRadius: 20,
        borderWidth: 2,
    },
    foodItems: {
        width: "90%",
        height: 270,
        flexDirection: "row",
        marginLeft: "5%",
    },
    box: {
        width: 240,
        height: 240,
        elevation: 10,
        margin: 10,
        backgroundColor: "#FFF",
        borderRadius: 10,
    },
    productimageouter: {
        width: 240,
        height: 140,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    img: {
        height: "100%",
        width: "100%",
        borderRadius: 10,
    },
    itemdetails: {
        width: "100%",
        height: 50,
        padding: 10,
        flexDirection: "row",
    },
    foodname: {
        fontWeight: 500,
        color: "#555",
        fontSize: 20,

    },
    foodprice: {
        marginLeft: 20,
        fontWeight: 500,
        color: "#888",
        fontSize: 16,
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
    specialtext: {
        textAlign: "center",
        fontSize: 20,
        color: "#666",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,



    },
    specialtext2: {
        textAlign: "center",
        fontSize: 12,
        color: "#fff",
        backgroundColor: "#ff4242",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        fontWeight: "bold",



    },
    seacrhresultsouter: {
        width: '100%',
        marginHorizontal: 0,
        height: 'auto',
        backgroundColor: "white",
        padding: 20,
        marginTop: 20,
    },
    searchresultsinner: {
        width: '100%',
    },
    searchresult: {
        width: '100%',
        flexDirection: 'row',
        // alignItems: 'center',
        padding: 5,
    },
    searchresulttext: {
        marginLeft: 10,
        fontSize: 18,
        color: "red",
    },
    Items: {
        width: "90%",
        height: 220,
        marginLeft: "5%",
    },
    ItemsInner: {
        flexDirection: "column",
        flexWrap: "wrap"

    },
    foodBox: {
        width: 100,
        height: 100,
        flexDirection: "column",
        // borderColor:"green",
        // borderWidth:2,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 5,
        marginLeft: 15

    },
    foodImage: {
        height: 60,
        width: 100,
        padding: 10,

    },
    foodName: {
        textAlign: "center",
        marginTop: 10
    },
    namastebox: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    namasteImage: {
        height: 110,
        width: 100,



    },
    orderTrackSection: {
        width: "90%",
        height: 100,
        marginLeft: "5%",
        position: "absolute",
        paddingTop: 20,
        paddingBottom: 10,
        paddingRight: 10,
        bottom: 20,
        flexDirection: "row",


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
        borderRadius: 10

    },
    orderTrackBtn: {
        width: 50,
        backgroundColor: "#FF4242",
        padding: 5,
        borderRadius: 10
    },
    orderTrackBtnText: {
        textAlign: "center",

    }

})