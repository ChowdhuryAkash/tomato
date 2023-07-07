import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'

import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { db, storage,firebase } from '../Firebase/firebaseConfig'
import { collection, doc, getDocs, setDoc, updateDoc, where, addDoc  } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


// import firebase from 'firebase/app';
// import 'firebase/storage';

const Createpost = () => {
    const [image, setImage] = useState(null);
    const [uri, setUri] = useState(null)
    const[email,setEmail]=useState("")
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);

    const[name,setName]=useState("")
    const[profilePic,setProfilePic]=useState("")
    const [postText, setPostText] = useState("");
    
  const [loading, setLoading] = useState(false)




    useEffect(() => {   

        getData();
    }, [])

    const userRef = firebase.firestore().collection('users');
    useEffect(() => {
        userRef.onSnapshot(snapshot => {
            setUsers(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


    }, [])
    useEffect(() => {
        setUser(users.filter((item) => item.email.includes(email)))
    }, [users])
    useEffect(() => {
        console.log(user)
        if (user.length > 0) {
            setName(user[0].name)
            setProfilePic(user[0].profilePic)
        }
        

    }, [user])




    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 1,
        });
        setImage(result.assets[0]);

        // if (!result.canceled) {
        //   console.log(result);
        // } else {
        //   alert('You did not select any image.');
        // }
    };
    const getData = async () => {
        try {
          const value = await AsyncStorage.getItem('email')
            // alert(value)
            setEmail(value)
          if (value == "400" || value == null) {
            navigation.navigate("login")
    
          }
        } catch (e) {
          // error reading value
        }
      }
    useEffect(() => {
        console.log(image)
        if (image == null) {
            setUri(" ")
        }
        else {
            setUri(image.uri)
        }

    }, [image])
    const uploadImage = async () => {
        setLoading(true)
        const fileName = uri.split('/').pop();
        const response = await fetch(image.uri)
        // console.log(response)
        
        const blob = response.blob()
        console.log("blob", blob)
        const imageRef = ref(storage, `PostImages/${fileName}`)
        uploadBytes(imageRef, blob._j)
            .then(() => {
                alert('Image uploaded successfully')
                getDownloadURL(imageRef)
                    .then((url) => {
                        const PostData = {
                            name,
                            email,
                            postText:postText,
                            postImage:url,
                            like:[],
                            comment:[],
                            save:[],
                            profilePic,
                            dateTime: new Date(),
                        }
                    
                                try {
                                    const docRef = addDoc(collection(db, "posts"), PostData);
                                    setLoading(0);
                                    alert("Post published");
                                    setImage(null);
                                    setPostText("");
                
                                }
                                catch (error) {
                                    setLoading(0);
                                    alert("Error adding document: ", error);
                                }
                            
                    })
            })
    }






    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#ff3d00"
                barStyle="light-content"
            />
            <View style={styles.header}>
                <View style={styles.header1}>
                    <TouchableOpacity>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <AntDesign name="arrowleft" size={24} color="white" />
                            <Text style={styles.headerText1}>Back</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Create Post</Text>
                    <TouchableOpacity onPress={() => { uploadImage() }}>
                        <Text style={styles.headerText2}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.postTop}>
                <Image
                    style={styles.postProfilePhoto}
                    source={{
                        uri: profilePic,
                    }}
                />
                <View>
                    <Text style={styles.postProfileName}>{name}</Text>
                    {/* <Text style={styles.postProfileTime}>2h ago</Text> */}
                </View>



            </View>


            <View style={styles.postBottom}>
                <TouchableOpacity onPress={() => { pickImageAsync() }}>
                    <View style={styles.postBottomTab}>
                        <Entypo name="image" size={24} color="green" />
                        <Text style={styles.postBottomTabText}>Add Photo</Text>
                    </View>
                </TouchableOpacity>
{image!=null?
    <TouchableOpacity onPress={() => {setImage(null) }}>
                    <View style={styles.postBottomTab}>
                        <Entypo name="image" size={24} color="red" />
                        <Text style={styles.postBottomTabText}> Remove Photo</Text>
                    </View>
                </TouchableOpacity>:null
    


}
                
            </View>
            <View style={styles.postBody}>
                <ScrollView>
                    <TextInput style={styles.postBodyText} value={postText} multiline={true} onChange={(e)=>{
                        setPostText(e.nativeEvent.text)
                    }} placeholder="What's on your mind?" />
                    <Image
                        style={styles.postPhoto}
                        source={{
                            uri: uri
                        }}
                    />


                </ScrollView>

            </View>

            {loading ?
        <Loader />
        : ""}

        </View>
    )
}

export default Createpost

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        width: "100%",
        height: 70,
        backgroundColor: "#ff3d00",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 10,
    },
    header1: {

        width: "100%",
        height: 70,
        backgroundColor: "#ff3d00",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerText: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    headerText1: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    headerText2: {
        color: "#ff3d00",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
        paddingVertical: 6,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    postTop: {
        height: 60,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginTop: 4,
    },
    postProfilePhoto: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 10,
        marginTop: 10,
    },
    postProfileName: {
        fontSize: 16,
        fontWeight: 500,
        color: "#333",
    },
    postProfileTime: {
        fontSize: 12,
        fontWeight: 500,
        color: "#555",
    },
    postBody: {
        height: 480,
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
    },
    postBodyText: {
        fontSize: 18,
        backgroundColor: "#fff",
        color: "#555",
        height: "auto",
        maxHeight: 300,
        width: "100%",
        marginBottom: 10,

    },
    postBottom: {
        height: 60,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginTop: 4,
    },
    postBottomTab: {
        height: 40,
        width: 140,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        padding: 5,
        borderRadius: 10,
        marginRight: 10,
    },
    postPhoto: {
        height: 200,
        width: "100%",
    },

})