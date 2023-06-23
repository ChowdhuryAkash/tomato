import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'

import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const Nav = ({navigation}) => {
    return (
        <View style={styles.maainBox}>
            <TouchableOpacity  onPress={() => { navigation.navigate("homescreen") }}>
                <View style={styles.navTab}>
                    <AntDesign name="home" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Home</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => { navigation.navigate("history") }}>
                <View style={styles.navTab}>
                    <Feather name="list" size={24} color="#fff" />
                    <Text style={styles.navTabText}>History</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { navigation.navigate("findorder") }}>
                <View style={styles.navTab}>
                    <Entypo name="magnifying-glass" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Find Order</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => { navigation.navigate("profile") }}>
                <View style={styles.navTab}>
                    <Ionicons name="person-circle" size={24} color="#fff" />
                    <Text style={styles.navTabText}>Profile</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default Nav

const styles = StyleSheet.create({
    maainBox: {
        width: "100%",
        height: 60,
        backgroundColor: "#4FB548",
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    navTab: {
        justifyContent: "center",
        alignItems: "center",
    },
    navTabText: {
        textAlign: "center",
        color: "#fff",
    }
})

// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Homescreen from '../screens/Homescreen';

// const Tab = createBottomTabNavigator();

// export default function Nav() {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen name="Home" component={Homescreen} />
//     </Tab.Navigator>
//   );
// }