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
import call from 'react-native-phone-call'

import * as Location from 'expo-location';

const TrackOrder = ({ navigation, route }) => {
  // const orderId = "e698fa2e-add5-4cff-b5a1-411cdaf845a0";
  const orderId = route.params;
  // console.warn(orderId);
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState([[]]);
  const [orderStatus, setOrderStatus] = useState("pending");
  const [status, setStatus] = useState("");


  const [partnerFound, setPartnerFound] = useState(false);


  const [origin, setOrigin] = useState({ latitude: 22.5219843, longitude: 88.3929623});//origin is user
  const [destination, setDestination] = useState({ latitude: 22.5219843, longitude: 88.3929623});//destination is restaurant
  const [bike, setBike] = useState({ latitude: 22.5219843, longitude: 88.3929623});//bike is partner
  // const GOOGLE_MAPS_APIKEY = '';
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



  useEffect(() => {
    orderRef.onSnapshot(snapshot => {
      setOrders(snapshot.docs.map(doc => doc.data()))
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


    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setOrigin({ latitude: location.coords.latitude, longitude: location.coords.longitude })
      // console.warn(location.coords.latitude);
      // console.warn(location.coords.longitude);
    })();






  }, [])

  useEffect(() => {
    setOrder(orders.filter((item) => item.id.includes(orderId)))
    // setResName(mainData[0].restaurantEmail);
    console.log(order)

  }, [orders])
  useEffect(() => {

    console.log(order)

  }, [order])


  useEffect(() => {
    // console.log(order)
    if (order.length > 0) {
      switch (order[0].status) {
        case "pending":
          setStatus("Pending for approval of restaurant");
          break;
        case "accepted":
          setStatus("Food is being processed");
          break;
        case "gotpartner":
          setPartnerFound(true);
          setStatus("Food is being processed");
          break;
        case "partnerreachedrestaurant":
          setPartnerFound(true);
          setStatus("Food is being packed");
          break;
        case "handovered":
          setPartnerFound(true);
          setStatus("Order is on the way");
          break;
        case "reached":
          setPartnerFound(true);
          setStatus("Devilery partner reached to your location");
          break;
        default:
          setStatus("Order is Delivered");

      }
    }
    if(order.length>0){
    setOrigin({ latitude: order[0].DeliveryLat, longitude: order[0].DeliveryLon })
    setDestination({ latitude: order[0].RestaurantLat, longitude: order[0].RestaurantLon })
    setBike({ latitude: order[0].deliveryBoyLat, longitude: order[0].deliveryBoyLon })
    }

  }, [order])
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
          <Text style={styles.smallText}>ORDER FROM <AntDesign name="down" size={14} color="white" /></Text>
          <Text style={styles.restaurantName}>{order[0].restaurantName}</Text>

          <Text style={styles.status}>{status}</Text>
          {
            resultInMinutes > 0 ?
              <Text style={styles.restaurantName}>
                Ariving in {resultInMinutes} minutes</Text>
              :
              <Text style={styles.restaurantName}>
                slightly delay</Text>
          }


        </View>
        <MapView
        provider={PROVIDER_GOOGLE}
         style={styles.map}
          initialRegion={{
            ...origin,
            latitudeDelta: 0.1002,
            longitudeDelta: 0.0281,
          }}
        >
          {
            (order[0].status == "pending" || order[0].status == "accepted" || order[0].status == "gotpartner" || order[0].status == "partnerreachedrestaurant")?
            <Polyline
            coordinates={[
              { ...destination }, // optional
              { ...origin }, // optional
            ]}
            strokeWidth={4}
          />:

          <Polyline
            coordinates={[
              { ...bike }, // optional
              { ...origin }, // optional
            ]}
            strokeWidth={4}
          />
          }
          
         
          <Marker coordinate={origin}
            pinColor={"#ff4242"} // any color
            title={"title"}
            description={"description"} />

          {partnerFound ?
            <Marker coordinate={bike}
              pinColor={"purple"} // any color
              title={"title"}
              description={"description"} >
              <Image source={require('../assets/delivery_boy.png')} style={{ height: 35, width: 35 }} />
            </Marker>
            : ""

          }


          <Marker coordinate={destination}
            pinColor={"purple"} // any color
            title={"title"}
            description={"description"} >
            <Image source={require('../assets/restaurant.png')} style={{ height: 35, width: 35 }} />
          </Marker>

        </MapView>


        <View style={styles.deliveryBoy}>
          {partnerFound ?
            (order.length > 0) ?
              <View style={styles.deliveryBoyTop}>
                <Image
                  style={styles.delivery_boy}
                  source={require('../assets/delivery_boy.png')}
                />
                <View style={styles.deliveryBoyNames}>
                  <Text style={styles.name}>Hello, I'm {order[0].deliveryBoyName} your delivery partner</Text>
                  <Text style={styles.namemini}>Delivered 500+ order on tomato </Text>

                </View>
                <View style={styles.deliveryBoyContect}>
                  <TouchableOpacity onPress={() => {
                    call({
                      number: order[0].deliveryBoyPhone, // String value with the number to call
                      prompt: false, // Optional boolean property. Determines if the user should be prompted prior to the call 
                      skipCanOpen: true // Skip the canOpenURL check
                    }).catch(console.error)
                  }}>
                    <Feather style={styles.phone} name="phone" size={24} color="red" />
                  </TouchableOpacity>

                </View>

              </View>
              : ""
            : ""}
          <View style={styles.deliveryBoyBottom}></View>




        </View>
      </View>
    )

  }

}


export default TrackOrder

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
    flexDirection: "row",
    justifyContent: "space-between"
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
    textAlign: "left"
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

})