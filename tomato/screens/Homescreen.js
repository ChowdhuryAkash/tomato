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


    const foodRef = firebase.firestore().collection('FoodData');



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




    return (
        <ScrollView style={styles.main}>
            <StatusBar
                backgroundColor="#ff4242"
                barStyle="light-content"
            />
            <View style={styles.nav}>
                {/* <Entypo name="location-pin" size={34} color="#ff4242" /> */}
                <View style={styles.locationbox}>
                    {/* <Text style={styles.foodietext}>Home <AntDesign name="down" size={14} color="black" /></Text> */}
                    {
                        user.length > 0 ?
                            <Text style={styles.foodietext}>Welcome, {user[0].name}</Text>
                            :
                            ""
                    }


                </View>
                <EvilIcons name="user" size={36} color="#ff4242" onPress={() => navigation.replace("profile")} />

            </View>

            <View style={styles.searchbox}>
                <AntDesign name="search1" size={24} color="#FF4242" />
                <TextInput style={styles.searchitem} value={search} placeholder='Search Food' onChangeText={(e) => {
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
                                <View style={styles.searchresult} >
                                    <AntDesign name="arrowright" size={24} color="black" />
                                    <Text style={styles.searchresulttext} onPress={() => {
                                        setSearch("");
                                        navigation.navigate('searchedfood', item.foodName.toLowerCase())
                                    }}>{item.foodName}</Text>
                                </View>
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
        height: 60,
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
        fontSize: 18,
    },
    searchbox: {
        flexDirection: "row",
        backgroundColor: "#FFF",
        width: "90%",
        height: 45,
        marginTop: 5,
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
        marginTop: 35,

    },
    seacrhresultsouter: {
        width: '100%',
        marginHorizontal: 0,
        height: 'auto',
        backgroundColor: "white",
        padding: 40,
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
        height: 120,
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
        bottom: 0,
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