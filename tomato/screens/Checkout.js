import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Alert, TextInput,PermissionsAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase, db } from '../Firebase/firebaseConfig'
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import uuid from 'react-native-uuid';
import { Audio } from 'expo-av';


import * as Location from 'expo-location';


const Checkout = ({ navigation, route }) => {
    const [sound, setSound] = React.useState();
    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('../assets/zomato.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }



    const order = route.params;
    // console.warn(order);

    const [foodData, setFoodData] = useState([]);
    const [DeliveryAddress, setDeliveryAddress] = useState("");
    const [phone, setPhone] = useState("");
    const DeliveryFee = 70;
    const foodRef = firebase.firestore().collection('FoodData');
    const restaurantRef = firebase.firestore().collection('Restaurants');
    
    // const[totalPrice,setTotalPrice]=useState(0);
    var totalPrice = 0;
    // const[userEmailId,setUserEmailId]=useState("");
    // const[restaurantEmailId,setRestaurantEmailId]=useState("");
    let userEmailId = "";
    let restaurantEmailId = "";
    let restaurantName = "";

    
  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState([]);
  const [origin, setOrigin] = useState({ latitude: 0, longitude: 0 });

    // useEffect(() => {
    //     getData();
    //     foodRef.onSnapshot(snapshot => {
    //         setFoodData(snapshot.docs.map(doc => doc.data()))
    //     }
    //     )

    //     (async () => {

    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //         //   setErrorMsg('Permission to access location was denied');
    //           return;
    //         }
      
    //         let location = await Location.getCurrentPositionAsync({});
    //         setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    //         console.warn(location.coords.latitude);
    //         console.warn(location.coords.longitude);
    //       })();
      
      


    // }, [])
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



    useEffect(() => {
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )

        restaurantRef.onSnapshot(snapshot => {
            setRestaurants(snapshot.docs.map(doc => doc.data()))
        }
        )
    
        getLocation();
    
    
    
    
    
    
      }, [])


      useEffect(() => {
        setRestaurant([restaurants.filter((item) => item.restaurantEmail.includes(restaurantEmailId))])
        // setResName(mainData[0].restaurantEmail);

    }, [restaurants])

    useEffect(() => {
        console.log(restaurant);

    }, [restaurant])



    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            // alert(value);
            userEmailId = value;
        } catch (e) {
            // error reading value
        }
    }
    getData();



    foodData.map((item) => {
        if (item.id == order[0].id) {
            restaurantEmailId = item.restaurantEmail;

        }
    })
    const placeOrder = () => {
        if (DeliveryAddress == "" || phone == "") {
            alert("Please Enter Address and Phone number");
        }
        else {
            // alert(DeliveryAddress+phone)
            var currentdate = new Date();
            var date = currentdate.getDate() + "/"
                + (currentdate.getMonth() + 1) + "/"
                + currentdate.getFullYear();
            var time = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            currentdate.setMinutes(currentdate.getMinutes() + 20);
            var nexttime = currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

                // let diff=getTimeDiff('{nexttime}', '{time}', 'm');
                // console.log(diff);
                
            const orderData = {
                id: uuid.v4(),
                restaurantEmailId,
                restaurantName: restaurantName,
                userEmailId,
                order,
                foodPrice: totalPrice,
                DeliveryFee,
                DeliveryAddress,
                phone,
                DeliveryLat: origin.latitude,
                DeliveryLon: origin.longitude,
                deliveryBoyEmail: "",
                RestaurantLat:restaurant[0][0].lat,
                RestaurantLon:restaurant[0][0].long,
                // Restaurantphone:restaurant[0][0].phone,
                
                Restaurantphone:"9645633037",
                deliveryBoyLat:0,
                deliveryBoyLon:0,
                status: "pending",
                date: date,
                time: time,
                deliveryTime: nexttime,
                dateTimeStamp:currentdate.toString(),


            }
            try {
                const docRef = addDoc(collection(db, "Orders"), orderData).catch((error) => {
                    console.error("Error adding document: ", error);
                });
                // Alert.alert('Hello world!')
                alert("Order placed successfully ");
                playSound();
                navigation.replace('trackorder', orderData.id)
            }
            catch (error) {
                alert("Something went wrong, Please try again!");
                console.warn(error)
            }
        }




    }
    const createTwoButtonAlert = () =>
        Alert.alert('Order Confirmation', 'Do you want to place this order?', [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'place order', onPress: () => { placeOrder() } },
        ]);

    order.map((orderItem) => {
        return (
            <>{
                foodData.map((item) => {
                    if (orderItem.id == item.id && orderItem.quantity) {
                        restaurantName = item.restaurantName;

                    }



                })
            }
            </>
        )

    });




    return (
        <View>
            <StatusBar
                backgroundColor="#ff4242"
                barStyle="light-content"
            />
            <Text style={styles.topText}>Place Order </Text>
            <ScrollView style={styles.allmenu}>
                <View style={{ justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>

                    {


                        order.map((orderItem) => {
                            return (
                                foodData.map((item) => {
                                    if (orderItem.id == item.id && orderItem.quantity) {
                                        var price = totalPrice;
                                        price = price + (item.foodPrice * orderItem.quantity)
                                        totalPrice = price;
                                        return (
                                            <View key={orderItem.id} style={styles.menu}>
                                                <View style={styles.menuTop}>
                                                    <Image
                                                        style={styles.foodImage}
                                                        source={{ uri: item.foodImageUrl }}
                                                    />
                                                    <Text style={styles.nameText}>{item.foodName} </Text>
                                                </View>
                                                <View style={styles.menuMid}>
                                                    <Text style={styles.quantityText}>Quantity : {orderItem.quantity}</Text>
                                                    <Text style={styles.priceText}>Price/unit : {item.foodPrice}</Text>
                                                </View>

                                            </View>

                                        );
                                    }



                                })
                            )


                        })





                    }


                </View>

            </ScrollView>
            <View style={styles.bottom}>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your House number'
                    value={DeliveryAddress}
                    onChange={(e) => {
                        setDeliveryAddress(e.nativeEvent.text);

                    }}>

                </TextInput>
                <TextInput
                    style={styles.input}
                    placeholder='Enter your Phone number'
                    value={phone}
                    onChange={(e) => {
                        setPhone(e.nativeEvent.text);

                    }}>

                </TextInput>
                <Text style={{ fontSize: 20, marginBottom: 6 }}>Food Total Price : {totalPrice} Rs.</Text>
                <Text style={{ fontSize: 20, marginBottom: 6 }}>Delivery Charge :{DeliveryFee} Rs.</Text>
                <Text style={{ fontSize: 32, marginBottom: 20 }}>Total Price : {totalPrice + DeliveryFee} Rs.</Text>
                <View style={styles.btns}>
                    <Text style={{ lineHeight: 40 }}>Payment mode : COD</Text>
                    <TouchableOpacity style={styles.boxbutton} onPress={() => {
                        createTwoButtonAlert()
                    }}>
                        <Text style={styles.boxbuttontext}>Place Order</Text>

                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Checkout

const styles = StyleSheet.create({
    topText: {
        fontSize: 30,
        color: "#777",
        textAlign: "center",
        marginTop: 10

    },
    allmenu: {
        height: "35%",
        marginTop: 0,
        marginBottom: 20
    },
    input: {
        width: "100%",
        height: 50,
        padding: 10,
        backgroundColor: "#fff",
        elevation: 20,
        borderRadius: 7,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20

    },
    menu: {
        width: "80%",
        height: 100,
        borderBottomColor: "#ccc",
        borderBottomWidth: 2,
        padding: 10
    },
    menuTop: {
        flexDirection: "row",
    },
    foodImage: {
        width: 50,
        height: 50,
        marginRight: 20
    },
    menuMid: {
        flexDirection: "row"
    },
    quantityText: {
        fontSize: 20,
        marginRight: 20
    },
    priceText: {
        fontSize: 20,
        marginRight: 20
    },
    nameText: {
        fontSize: 17,
        lineHeight: 50
    },
    bottom: {
        width: "80%",
        marginLeft: "10%"

    },
    btns: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    boxbutton: {
        width: "50%",
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

})