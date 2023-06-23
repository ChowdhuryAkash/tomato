import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Welcomescreen from "./screens/Welcomescreen"
import Signup from "./screens/Signup"
import Login from "./screens/Login"
import Homescreen from "./screens/Homescreen"

import Searchedfood from "./screens/Searchedfood"
import Restaurant from "./screens/Restaurant"
import Profile from "./screens/Profile"
import Checkout from "./screens/Checkout"
import TrackOrder from "./screens/TrackOrder"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';



const Stack = createNativeStackNavigator();
const App = () => {
  return (

    <NavigationContainer>
      <Stack.Navigator>

      


        
      <Stack.Screen name="welcomescreen" component={Welcomescreen}
          options={{
            headerShown: false,
          }} />


        <Stack.Screen name="login" component={Login}
          options={{
            headerShown: false,
          }} />


        <Stack.Screen name="signup" component={Signup}
          options={{
            headerShown: false,
          }} />


        

        <Stack.Screen name="homescreen" component={Homescreen}
          options={{
            headerShown: false,
          }} />

        <Stack.Screen name="searchedfood" component={Searchedfood}
          options={{
            headerShown: false,
          }} />






        <Stack.Screen name="restaurant" component={Restaurant}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen name="checkout" component={Checkout}
          options={{
            headerShown: false,
          }} />
          <Stack.Screen name="trackorder" component={TrackOrder}
          options={{
            headerShown: false,
          }} />

        


        <Stack.Screen name="profile" component={Profile}
          options={{
            headerShown: false,
          }} />






      </Stack.Navigator>
    </NavigationContainer>

  )
}

export default App

const styles = StyleSheet.create({})