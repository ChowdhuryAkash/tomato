import { StyleSheet, Text, View, StatusBar, Image, PermissionsAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { firebase } from '../Firebase/firebaseConfig'
import { TouchableOpacity } from 'react-native';
import call from 'react-native-phone-call';

import { db, storage } from '../Firebase/firebaseConfig'
import {
  addDoc, collection, getDocs, query, where, updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import * as Location from 'expo-location';

const Delivery = ({ navigation, route }) => {
  // const orderId = "84480d65-d9be-4401-9ce8-ed377279a919";
  const orderId = route.params;
  if (orderId == null) {
    navigation.replace('main');
  }
  // console.warn(orderId);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([[]]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [status, setStatus] = useState("");


  const [partnerFound, setPartnerFound] = useState(false);


  const [customer, setCustomer] = useState({ latitude: 22.572646, longitude: 88.363895 });
  const [restaurant, setRestaurant] = useState({ latitude: 22.577800, longitude: 88.375895 });
  const [bike, setBike] = useState({ latitude: 22.583400, longitude: 88.365895 });
  const GOOGLE_MAPS_APIKEY = '…';
  var hasLocationPermission;

  let orderRef = firebase.firestore().collection('Orders');



  // const requestCameraPermission = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //     )
  //     if (granted == PermissionsAndroid.RESULTS.GRANTED) {
  //       // console.warn(Geolocation);
  //     } else {
  //       console.log("Location permission denied")
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }
  const getLocation = async () => {

    let { status } = await Location.requestForegroundPermissionsAsync().catch((error) => {
      console.error("Error updating document: ", error);
    });
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({}).catch((error) => {
      console.error("Error updating document: ", error);  
    });
    setBike({ latitude: location.coords.latitude, longitude: location.coords.longitude })
    // console.warn(location.coords.latitude);
    // console.warn(location.coords.longitude);
    if (order.length > 0) {
      const orderDoc = doc(db, "Orders", order[0].ID);
      const newFields = { deliveryBoyLat: location.coords.latitude, deliveryBoyLon: location.coords.longitude };
      await updateDoc(orderDoc, newFields).catch((error) => {
        console.error("Error updating document: ", error);
      });
      console.log("updated");
    }
  }



  useEffect(() => {
    orderRef.onSnapshot(snapshot => {
      setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
    }
    )

    var currentdate = new Date();
    var datetime = currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();
    // console.log(datetime)
    currentdate.setMinutes(currentdate.getMinutes() + 50);
    var nexttime = currentdate.getHours() + ":"
      + currentdate.getMinutes() + ":"
      + currentdate.getSeconds();


    // console.log(nexttime)


    // requestCameraPermission();


    getLocation();
    // myTimeout();






  }, [])


  useEffect(() => {
    setOrder(orders.filter((item) => item.id.includes(orderId)))
    // setResName(mainData[0].restaurantEmail);
    // console.log(order)

  }, [orders])
  useEffect(() => {

    console.log(order)

  }, [order])


  useEffect(() => {
    // console.log(order)
    if (order.length > 0) {
      setCustomer({ latitude: order[0].DeliveryLat, longitude: order[0].DeliveryLon });
      setRestaurant({ latitude: order[0].RestaurantLat, longitude: order[0].RestaurantLon });
    }


  }, [order])
  const myTimeout = () => {
    setTimeout(() => {
      getLocation();
    }, 10000)
  };
  const updateStatement = async (id, status) => {
    if (status == "delivered") {
      navigation.replace("main");
    }
    else {
      const orderDoc = doc(db, "Orders", id);
      var newFields;
      switch (status) {
        case "gotpartner":
          newFields = { status: "partnerreachedrestaurant" };
          break;
        case "handovered":
          newFields = { status: "reached" };
          break;
        case "reached":
          newFields = { status: "delivered" };
          break;
      }



      // const newFields = { deliveryBoyLat: location.coords.latitude, deliveryBoyLon: location.coords.longitude};
      await updateDoc(orderDoc, newFields).catch((error) => { console.error("Error updating document: ", error); }) 
      console.log("updated");
    }


  };

  // setInterval(()=>{
  //   orderRef = firebase.firestore().collection('Orders');
  //   orderRef.onSnapshot(snapshot => {
  //     setOrders(snapshot.docs.map(doc => doc.data()))
  //   })

  // }, 10000);

  // orderRef = firebase.firestore().collection('Orders');
  // orderRef.onSnapshot(snapshot => {
  //   setOrders(snapshot.docs.map(doc => doc.data()))
  // })

  if (order.length > 0) {
    var startTime = new Date();
    var endTime = new Date(order[0].dateTimeStamp);
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    // console.log(resultInMinutes)
    // console.warn(order[0].status)
    return (
      <View style={styles.main}>
        <View>
          <StatusBar
            backgroundColor="#4FB548"
            barStyle="light-content"
          />

        </View>
        <View style={styles.greenBox}>
          <Text style={styles.smallText}>ORDER ID <AntDesign name="down" size={14} color="white" /></Text>
          <Text style={styles.restaurantName}>{order[0].ID}</Text>

          <Text style={styles.status}>Have a safe journey!</Text>
          {
            resultInMinutes > 0 ?
              <Text style={styles.restaurantName}>
                Arive in {resultInMinutes} minutes</Text>
              :
              <Text style={styles.restaurantName}>
                slightly delay</Text>
          }


        </View>
        <MapView
        provider={PROVIDER_GOOGLE}
         style={styles.map}
          initialRegion={{
            ...bike,
            latitudeDelta: 0.1002,
            longitudeDelta: 0.0281,
          }}
        >

          {/* <MapViewDirections
            origin={origin}
            destination={destination}
            apikey="AIzaSyD4Sy5Ks6OqomH0Tr6u_ew6uCswErq-2Q0"
          /> */}
          {/* <Marker coordinate={bike}
            pinColor={"#ff4242"} // any color
            title={"title"}
            description={"description"} /> */}

          {(order[0].status == "gotpartner" || order[0].status == "partnerreachedrestaurant") ?
            <>
              <Polyline
                coordinates={[
                  { ...restaurant }, // optional
                  { ...bike }, // optional
                ]}
                strokeWidth={4}
              />
              <Marker coordinate={bike}
                pinColor={"purple"} // any color
                title={"title"}
                description={"description"} >
                <Image source={require('../assets/delivery_boy.png')} style={{ height: 35, width: 35 }} />
              </Marker>

              <Marker coordinate={restaurant}
                pinColor={"purple"} // any color
                title={"title"}
                description={"description"} >
                <Image source={require('../assets/restaurant.png')} style={{ height: 35, width: 35 }} />
              </Marker>

            </>

            : ""

          }

          {(order[0].status == "handovered" || order[0].status == "reached") ?
            <>
              <Polyline
                coordinates={[
                  { ...customer }, // optional
                  { ...bike }, // optional
                ]}
                strokeWidth={4}
              />
              <Marker coordinate={bike}
                pinColor={"purple"} // any color
                title={"title"}
                description={"description"} >
                <Image source={require('../assets/delivery_boy.png')} style={{ height: 35, width: 35 }} />
              </Marker>

              <Marker coordinate={customer}
                pinColor={"purple"} // any color
                title={"title"}
                description={"description"} >

              </Marker>

            </>

            : ""

          }




        </MapView>


        <View style={styles.deliveryBoy}>
          {
            (order.length > 0) ?
              <>

                {(order[0].status == "gotpartner" || order[0].status == "partnerreachedrestaurant") ?

                  <View style={styles.deliveryBoyTop}>
                    <Image
                      style={styles.delivery_boy}
                      source={require('../assets/restaurant.png')}
                    />
                    <View style={styles.deliveryBoyNames}>
                      <Text style={styles.name}>Call {order[0].restaurantName} Restaurant </Text>

                    </View>
                    <View style={styles.deliveryBoyContect}>
                      <TouchableOpacity onPress={() => {
                        call({
                          number: order[0].Restaurantphone, // String value with the number to call
                          prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
                          skipCanOpen: true // Skip the canOpenURL check
                        }).catch(console.error)
                      }}>
                        <Feather style={styles.phone} name="phone" size={24} color="red" />
                      </TouchableOpacity>

                    </View>

                  </View> : ""}


                {(order[0].status == "handovered" || order[0].status == "reached") ?

                  <View style={styles.deliveryBoyTop}>
                    {/* <Image
               style={styles.delivery_boy}
               source={require('../assets/restaurant.png')}
             /> */}
                    <View style={styles.deliveryBoyNames}>
                      <Text style={styles.name}>Call customer </Text>

                    </View>
                    <View style={styles.deliveryBoyContect}>
                      <TouchableOpacity onPress={() => {
                        call({
                          number: order[0].phone, // String value with the number to call
                          prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
                          skipCanOpen: true // Skip the canOpenURL check
                        }).catch(console.error)
                      }}>
                        <Feather style={styles.phone} name="phone" size={24} color="red" />
                      </TouchableOpacity>

                    </View>

                  </View> : ""}


                <View >
                  {(order[0].status == "delivered") ?
                    <Text style={styles.deliveryCompletedText}>Delivery completed</Text>
                    : ""

                  }

                  <TouchableOpacity style={styles.deliveryBoyBottomBtn} onPress={() => { updateStatement(order[0].ID, order[0].status) }}>
                    {(order[0].status == "gotpartner") ?
                      <Text style={styles.deliveryBoyBottomBtnText}>Reached restaurant</Text>
                      : ""

                    }
                    {(order[0].status == "partnerreachedrestaurant" || order[0].status == "handovered") ?
                      <Text style={styles.deliveryBoyBottomBtnText}>Reached delivery location</Text>
                      : ""

                    }
                    {(order[0].status == "reached") ?
                      <Text style={styles.deliveryBoyBottomBtnText}>Delivered</Text>
                      : ""

                    }
                    {(order[0].status == "delivered") ?
                      <Text style={styles.deliveryBoyBottomBtnText}>Go Back</Text>
                      : ""

                    }
                  </TouchableOpacity>
                </View>





              </>
              : ""}




        </View>
      </View>
    )

  }

}


export default Delivery

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#F5F5F5",
  },
  greenBox: {
    height: "auto",
    width: "100%",
    backgroundColor: "#4FB548",
    paddingBottom: 20
  },
  smallText: {
    textAlign: "center",
    color: "#eee",
    fontSize: 13,
    marginTop: 10

  },
  restaurantName: {
    textAlign: "center",
    color: "#fff",
    fontSize: 18,
    lineHeight: 24

  },
  status: {
    textAlign: "center",
    color: "#fff",
    fontSize: 30,
    fontWeight: 700,
    marginTop: 20

  },
  map: {
    height: 400,
  },
  deliveryBoy: {
    height: 220,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 10,

  },
  deliveryBoyTop: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    // backgroundColor:"green",

  },
  delivery_boy: {
    width: 50,
    height: 50,
    padding: 5,
    borderRadius: 200,
    borderColor: "#ff4242",
    borderWidth: 1,
  },
  deliveryBoyNames: {
    width: "70%",
    height: 50,
    // backgroundColor:"red"

  },
  name: {
    fontSize: 15,
    fontWeight: 700,
    color: "#000",
    textAlign: "center"
  },
  namemini: {
    fontSize: 12,
    fontWeight: 500,
    color: "#222",
    textAlign: "left"
  },
  deliveryBoyContect: {
    width: 40
  },
  phone: {
    borderRadius: 200,
    borderColor: "gray",
    borderWidth: 1,
    padding: 5,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  deliveryBoyBottomBtn: {
    width: "80%",
    height: 50,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#4FB548",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  deliveryBoyBottomBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: 700,
  },
  deliveryCompletedText: {
    color: "#000",
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
  },

})