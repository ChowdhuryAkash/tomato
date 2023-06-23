import { StyleSheet, Text, View,Image } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    <View style={{backgroundColor:"#fff",width:"50%",height:170,position:"absolute",left:"25%",top:250,elevation:80,justifyContent:"center",alignItems:"center",borderRadius:6}}>
    <Image style={{width:80,height:80,}} source={require('../assets/loader.gif')} />
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})