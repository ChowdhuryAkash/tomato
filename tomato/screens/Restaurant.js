import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../Firebase/firebaseConfig'
import { AntDesign } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import Loader from '../components/Loader';

const Restaurant = ({ navigation, route }) => {
    const foodid = route.params;
    // const foodid = 1685722176138
    const fooddata = "peri peri";
    let a = 0;



    const [loading, setLoading] = useState(1)
    const [foodData, setFoodData] = useState([]);
    const [showData, setShowData] = useState([]);
    const [mainData, setMainData] = useState([[{ "restaurantEmail": "" }]]);
    const [resName, setResName] = useState();
    const [order, setOrder] = useState([]);


    const foodRef = firebase.firestore().collection('FoodData');

    useEffect(() => {
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )


    }, [])

    useEffect(() => {
        // import AsyncStorage from '@react-native-async-storage/async-storage';
        const value = AsyncStorage.getItem('email')
        //  cheching authication and redirect
        if (value == "400") {
            navigation.replace("homescreen")

        }
    }, [])

    useEffect(() => {
        setMainData([foodData.filter((item) => item.id.includes(foodid))])
        // setResName(mainData[0].restaurantEmail);

    }, [foodData])

    useEffect(() => {
        // console.warn(mainData[0][0].restaurantEmail);
        // [[{"foodAddon": "Extra cheese", "foodAddonPrice": "30", "foodCategory": "veg", "foodDescription": "Chicken Burger", "foodImageUrl": "https://firebasestorage.googleapis.com/v0/b/tomato-996be.appspot.com/o/FoodImages%2Fburger.jpg?alt=media&token=3d202b58-b967-4fb2-8345-958a8ca30a13", "foodName": "Burger", "foodPrice": "100", "foodType": "non-veg", "id": "1685722176138", "mealType": "dinner", "restaurantEmail": "ssh@gmail.com", "restaurantName": "SSH restaurant"}]]

        setShowData(foodData.filter((item) => item.restaurantEmail.includes(mainData[0][0].restaurantEmail) && !(item.id.includes(foodid))))


    }, [mainData])
    useEffect(() => {
        // console.warn(order);
    }, [order])



    const increment = (index) => {
        var arr = order;
        var obj = arr[index];
        var num = obj.quantity;
        arr[index].quantity = num + 1;
        // num++;
        // obj.quantity=num;
        // arr[index]=obj;
        setOrder([...arr])
    }
    const decrement = (index) => {
        var arr = order;
        var obj = arr[index];
        var num = obj.quantity;
        if (num > 0) {
            arr[index].quantity = num - 1;
        }

        // obj.quantity=num;
        // arr[index]=obj;
        setOrder([...arr])
    }
    useEffect(() => {
        // if(order.length==0){
        mainData[0].map((item, index) => {

            var id = item.id;
            var arr = order;
            arr.pop();
            arr.pop();


            arr.push({ id, quantity: 1 })


            setOrder(arr)



            LogBox.ignoreLogs(['Each child in a list should have a unique "key" prop'])
        })

        showData.map((item, index) => {
            if (order.length < 4) {

                var id = item.id;
                var arr = order;

                arr.push({ id, quantity: 0 })


                setOrder(arr)

            }

            setLoading(0)
        })
    }, [showData])
    const [restaurantData, setRestaurantData] = useState([]);
    const [proceed, setProceed] = useState(false);
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



    return (
        <ScrollView style={styles.main}>


            {

                mainData[0].map((item, index) => {




                    return (
                        <>
                            {
                                restaurantData.map((restaurant) => {

                                    if (restaurant.restaurantEmail == item.restaurantEmail && restaurant.open) {
                                        // setProceed(true);
                                        return (
                                            <>
                                                <View key={item.id}>
                                                    <Image style={styles.mainfoodimage} source={{ uri: item.foodImageUrl }} />
                                                    <Text style={styles.foodnametext}>{item.foodName}</Text>

                                                    <View style={styles.mainbox}>
                                                        <Text style={styles.pricetext}>Rs: {item.foodPrice}/-</Text>
                                                        <View style={styles.quantitybox}>
                                                            <AntDesign style={styles.quantityicon} name="minus" size={24} color="black" onPress={
                                                                () => {
                                                                    decrement(0);
                                                                }
                                                            } />
                                                            <Text style={styles.quantitytext}>{order[index] == null ? 1 : order[index].quantity}</Text>
                                                            <AntDesign style={styles.quantityicon} name="plus" size={18} color="black" onPress={
                                                                () => {
                                                                    increment(0);
                                                                }
                                                            } />







                                                        </View>

                                                    </View>

                                                    <Text style={styles.resnametext}>{item.restaurantName}</Text>
                                                </View>
                                                <TouchableOpacity style={styles.boxbutton} onPress={() => navigation.navigate('checkout', order)}>
                                                    <Text style={styles.boxbuttontext}>Proceed</Text>

                                                </TouchableOpacity>
                                            </>
                                        )
                                    }
                                    else if (restaurant.restaurantEmail == item.restaurantEmail && !restaurant.open) {
                                        // setProceed(false);
                                        return (
                                            <>
                                                <View key={item.id}>
                                                    <Image style={styles.grayimg} source={{ uri: item.foodImageUrl }} />
                                                    <Text style={styles.foodnametext}>{item.foodName}</Text>
                                                    <Text style={styles.closedText}>Restaurant is closed</Text>

                                                    <View style={styles.mainbox}>
                                                        <Text style={styles.pricetext}>Rs: {item.foodPrice}/-</Text>
                                                        <View style={styles.quantitybox}>
                                                            <AntDesign style={styles.quantityicon} name="minus" size={24} color="black" onPress={
                                                                () => {
                                                                    decrement(0);
                                                                }
                                                            } />
                                                            <Text style={styles.quantitytext}>{order[index] == null ? 1 : order[index].quantity}</Text>
                                                            <AntDesign style={styles.quantityicon} name="plus" size={18} color="black" onPress={
                                                                () => {
                                                                    increment(0);
                                                                }
                                                            } />







                                                        </View>

                                                    </View>

                                                    <Text style={styles.resnametext}>{item.restaurantName}</Text>
                                                </View>
                                            </>

                                        )

                                    }


                                })
                            }
                        </>





                    )
                    a++;
                })}



            <Text style={styles.othertext}>Other Items of This Restaurant</Text>

            <View style={styles.hr}></View>
            <View>
                {showData.map((item, index) => {

                    // var id = item.id;
                    // var arr = order;

                    // arr.push({ id, quantity: 0 })

                    // if (order.length<2) {
                    //     setOrder(arr)

                    // }

                    return (
                        <View key={item.id} style={styles.box}>
                            <View style={styles.productimageouter}>
                                <Image source={{ uri: item.foodImageUrl }} style={styles.img}></Image>

                            </View>

                            <View style={styles.itemdetails}>
                                <Text style={styles.foodname}>{item.foodName}</Text>
                            </View>
                            <View style={styles.mainbox}>
                                <Text style={styles.pricetext}>Rs:{item.foodPrice}/-</Text>
                                <View style={styles.quantitybox}>
                                    <AntDesign style={styles.quantityicon} name="minus" size={24} color="black" onPress={
                                        () => {
                                            decrement(index + 1);
                                        }
                                    } />
                                    <Text style={styles.quantitytext}>{order[index + 1] == null ? 0 : order[index + 1].quantity}</Text>
                                    <AntDesign style={styles.quantityicon} name="plus" size={18} color="black" onPress={
                                        () => {
                                            increment(index + 1);
                                        }
                                    } />




                                </View>

                            </View>

                        </View>
                    )
                    a++;
                })}
            </View>


        </ScrollView>

    )
}

export default Restaurant

const styles = StyleSheet.create({
    main: {
    },
    hr: {
        width: "80%",
        borderBottomColor: "rgba(200,200,200,.4)",
        borderBottomWidth: 2,
        backgroundColor: "transparent",
        marginLeft: "12%",
        marginTop: 10
    },
    mainfoodimage: {
        width: "100%",
        height: 300,
    },
    foodnametext: {
        color: "#555",
        fontSize: 20,
        margin: 10,
        fontWeight: 700
    },
    resnametext: {
        color: "#222",
        fontSize: 25,
        margin: 10,
        fontWeight: 700

    },
    mainbox: {
        flexDirection: "row",
        width: "90%",
        marginLeft: "5%",
        justifyContent: "space-between"
    },
    pricetext: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#333",

    },
    quantitybox: {
        flexDirection: "row"
    },
    quantityicon: {
        backgroundColor: "#ff4242",
        padding: 5,
        borderRadius: 5,
        color: "#fff",
        width: 30,
        height: 30,
        textAlign: "center"
    },
    quantitytext: {
        backgroundColor: "transparent",
        padding: 5,
        color: "#000",
        width: 38,
        height: 30,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 18
    },
    othertext: {
        color: "#ff4242",
        fontSize: 14,
        marginTop: 20,
        marginLeft: 10,
        fontWeight: 400,
        textAlign: "center"

    },
    box: {
        width: "90%",
        height: 300,
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
        width: "100%",
        height: 300,
        opacity: 0.2
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
        borderRadius: 10
        ,
    },
    boxbuttontext: {
        textAlign: "center",
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 4
    },
})