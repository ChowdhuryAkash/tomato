import { StyleSheet, Text, View } from 'react-native'
import React ,{useEffect} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('email', value)
    } catch (e) {
      // saving error
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('email')
      // alert(value)
      if(value =="400") {
        navigation.replace("login")
       
      }
      else{
        // navigation.replace("homescreen")
      }
    } catch(e) {
      // error reading value
    }
  }
      useEffect(()=>{
        getData();
        // import AsyncStorage from '@react-native-async-storage/async-storage';
        const value =  AsyncStorage.getItem('email')
        //  cheching authication and redirect
          if(value =="400") {
            navigation.replace("homescreen")
           
          }
    },[])
  return (
    <View>
      <Text>Profile</Text>
      <Text style={styles.logout} onPress={()=>{
        storeData("400");
        getData();
        

      }}>Logout</Text>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
    logout:{
        color:"red",
        fontSize:30,
        textAlign:"center",
        marginTop:30
    }
})