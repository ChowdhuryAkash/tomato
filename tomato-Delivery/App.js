import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Homescreen from './screens/Homescreen';
import Findorder from './screens/Findorder';
import Signup from './screens/Signup';
import Login from './screens/Login';
import Delivery from './screens/Delivery';
import Nav from './components/Nav';

import Welcomescreen from "./screens/Welcomescreen"


import History from './screens/History';
import Profile from './screens/Profile';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



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
          <Stack.Screen name="delivery" component={Delivery}
          options={{
            headerShown: false,
          }} />

        <Stack.Screen name="homescreen" component={Homescreen}
          options={{
            headerShown: false,
          }} />

        <Stack.Screen name="findorder" component={Findorder}
          options={{
            headerShown: false,
          }} />
        <Stack.Screen name="history" component={History}
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