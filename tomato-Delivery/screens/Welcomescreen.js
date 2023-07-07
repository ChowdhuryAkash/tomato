import { StyleSheet, Text, View, Image,TouchableOpacity ,StatusBar,PermissionsAndroid} from 'react-native'
import React,{useState,useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
// import GetLocation from 'react-native-get-location';

const Welcomescreen = ({navigation}) => {



  // const requestLocationPermission = async () => {
  //   try {
  //     await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: 'Cool Photo App Camera Permission',
  //         message:
  //           '' +
  //           '',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //     //   console.log('guranted');
  //     // } else {
  //     //   console.log('location permission denied');
  //     // }
  //     console.log('guranted')
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
        // alert(value)
      if (value == "400") {
        // navigation.navigate("homescreen")

      }
      else {
        if(value.length>0){
          navigation.replace("main");
        }
      }
    } catch (e) {
      // error reading value
    }
  }

//   AsyncStorage.setItem('email', "400");
  useEffect(()=>{
    // requestLocationPermission();
    
    getData();

  },[])

  // const location=()=>{
  //   GetLocation.getCurrentPosition({
  //     enableHighAccuracy: true,
  //     timeout: 60000,
  // })
  // .then(location => {
  //     console.log(location);
  // })
  // .catch(error => {
  //     const { code, message } = error;
  //     console.warn(code, message);
  // })

  // }
  
  return (
    <View style={styles.main}>
      <StatusBar
                backgroundColor="#4FB548"
                barStyle="light-content"
            />
      <Text style={styles.welcometext}>Welcome to Tomato Delivery</Text>
      <Image style={styles.welcomepagelogo} source={require("../assets/logo.png")} ></Image>
      <View style={styles.hr}></View>
      <Text style={styles.minitext}>Deliver food in your know area of your town and earn a good amount </Text>
      <View style={styles.hr}></View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('signup')}>
          <Text style={styles.buttontext}>
            Sign up
          </Text>
        </TouchableOpacity >

        <TouchableOpacity style={styles.button} onPress={()=> navigation.navigate('login')}>
          <Text style={styles.buttontext}>
            Log in
          </Text>
        </TouchableOpacity >

        {/* <TouchableOpacity style={styles.button} onPress={()=> location()}>
          <Text style={styles.buttontext}>
            Location
          </Text>
        </TouchableOpacity > */}
        

      </View>
    </View>
  )
}

export default Welcomescreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#4FB548',
    width: '100%',
    alignItems: 'center',
  },
  welcometext: {
    marginTop: 20,
    fontSize: 40,
    fontStyle:"italic",
    color: "#eee",
    width: "100%",
    textAlign: "center",
    fontWeight: 300,
  },
  welcomepagelogo: {
    width: "100%",
    height: 270,
  },
  hr: {
    width: "80%",
    borderBottomColor: "rgba(200,200,200,.3)",
    borderBottomWidth: 2,
    backgroundColor: "transparent",
    marginVertical:20
  },
  minitext: {
    marginTop: 10,
    fontSize: 20,
    color: "#eee",
    width: "85%",
    textAlign: "center",
    fontWeight: 300,

  },
  buttons:{
    width:"100%",
    flexDirection:"row",
    marginTop:10,
    justifyContent:"space-between",
    paddingHorizontal:"12%",

  },
  button:{
    backgroundColor:"#FFF",
    width:120,
    height:40,
    padding:5,
    justifyContent:"center",
    alignItems:"center",
    borderRadius:10

  },
  buttontext:{
    textAlign:"center",
    color:"#4FB548",
    fontWeight:600,
    fontSize:22,
    
  }
})