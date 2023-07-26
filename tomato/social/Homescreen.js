import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Linking from 'expo-linking';


import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

import { db, storage, firebase } from '../Firebase/firebaseConfig'
import { collection, doc, getDocs, setDoc, updateDoc, where, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Audio } from 'expo-av';

const Homescreen = (props) => {

    const [likes, setLikes] = useState(0);
    const [email, setEmail] = useState("")
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState(" ")

    const [posts, setPosts] = useState([])
    const [post, setPost] = useState([]);
    const postRef = firebase.firestore().collection('posts');


    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);

    const userRef = firebase.firestore().collection('users');
    const [sound, setSound] = React.useState();
    async function playSound() {
        console.log('Loading Sound');
        const { sound } = await Audio.Sound.createAsync(require('../assets/bottle2.mp3')
        );
        setSound(sound);

        console.log('Playing Sound');
        await sound.playAsync();
    }
    useEffect(() => {
        postRef.onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )

        getData();
    }, [])


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


    useEffect(() => {
        setPost(users.filter((item) => item.email.includes(email)))
    }, [posts])

    const likeHandler = async (ID, likes) => {
        const postDoc = doc(db, "posts", ID);
        var postData;

        if (likes.includes(email)) {
            const like = likes;
            let index = like.indexOf(email);
            like.splice(index, 1);
            postData = {
                like: like
            }

        }
        else {
            playSound();
            likes.push(email)
            postData = {
                like: likes
            }
        }
        await updateDoc(postDoc, postData).catch((error) => {
            console.log("Error updating document: ", error);
        });
        // alert("liked successfully");


    }

    const saveHandler = async (ID, saves) => {
        const postDoc = doc(db, "posts", ID);
        var postData;

        if (saves.includes(email)) {
            const save = saves;
            let index = save.indexOf(email);
            save.splice(index, 1);
            postData = {
                save: save
            }

        }
        else {
            // playSound();
            saves.push(email)
            postData = {
                save: saves
            }
        }
        await updateDoc(postDoc, postData).catch((error) => {
            console.log("Error updating document: ", error);
        });



    }
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('email')
            console.log(value)
            setEmail(value)
            if (value == "400" || value == null) {
                navigation.navigate("login")

            }
        } catch (e) {
            // error reading value
        }
    }




    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#ff3d00"
                barStyle="light-content"
            />
            <View style={styles.top}>
                <Text style={styles.topText}>Welcome {name} </Text>
            </View>
            <ScrollView>
                <View style={styles.posts}>

                    {
                        posts.map((item, index) => {

                            return (
                                <View style={styles.post} key={index}>
                                    <View style={styles.postTop}>
                                        <Image
                                            style={styles.postProfilePhoto}
                                            source={{
                                                uri: item.profilePic,
                                            }}
                                        />
                                        <View>
                                            <Text style={styles.postProfileName}>{item.name}</Text>
                                            <Text style={styles.postProfileTime}>2h ago</Text>
                                        </View>


                                    </View>
                                    <View style={styles.postTexts}>
                                        <Text style={styles.postText}>{item.postText}</Text>


                                    </View>
                                    <Image
                                        style={styles.postImage}
                                        source={{
                                            uri: item.postImage,
                                        }}
                                    />
                                    <View style={styles.postReactions}>
                                    </View>
                                    <View style={styles.postReactCounts}>
                                        <Text>{item.like.length} Likes</Text>
                                        <TouchableOpacity
                                            title="Order Grocery"
                                            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.grofers.customerapp')}
                                            style={styles.ordrGroceryButton}

                                        >
                                            <Text style={styles.ordrGroceryButtonText}>Order Grocery</Text>
                                        </TouchableOpacity>
                                        <Text> {item.comment.length} comments</Text>


                                    </View>

                                    <View style={styles.postReact}>
                                        <TouchableOpacity onPress={() => { likeHandler(item.ID, item.like) }}>

                                            {item.like.includes(email) ?
                                                <View style={styles.postReactButton}>

                                                    <AntDesign name="like1" size={24} color="#ff3d00" />
                                                    <Text style={styles.postReactText}>Like</Text>
                                                </View>

                                                :
                                                <View style={styles.postReactButton}>
                                                    <AntDesign name="like2" size={24} color="#888" />
                                                    <Text style={styles.postReactText}>Like</Text>
                                                </View>
                                            }



                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => { props.navigating("comment", { ID: item.ID, comments: item.comment, name: name, email: email, profilePic: profilePic }) }}>
                                            <View style={styles.postReactButton}>
                                                <FontAwesome5 name="comment-alt" size={20} color="#888" />
                                                <Text style={styles.postReactText}>Comment</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => { saveHandler(item.ID, item.save) }}>

                                            {item.save.includes(email) ?
                                                <View style={styles.postReactButton}>
                                                    <Entypo name="save" size={24} color="#ff3d00" />
                                                    <Text style={styles.postReactText}>Unsave</Text>
                                                </View>

                                                :
                                                <View style={styles.postReactButton}>
                                                    <Entypo name="save" size={24} color="#888" />
                                                    <Text style={styles.postReactText}>Save</Text>
                                                </View>


                                            }
                                        </TouchableOpacity>

                                    </View>

                                </View>

                            )
                        })
                    }












                </View >
            </ScrollView >
        </View >




    )
}

export default Homescreen

const styles = StyleSheet.create({
    main: {
        backgroundColor: "#eee",
        paddingBottom: 125,

    },
    top: {
        height: 50,
        width: "100%",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    topText: {
        color: "#777",
        fontSize: 20,
        fontWeight: 500,
        textAlign: "center",
    },
    posts: {},
    post: {
        height: "auto",
        width: "100%",
        backgroundColor: "#fff",
        marginVertical: 5,
        paddingTop: 10,



    },
    postTop: {
        height: 50,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
    },
    postProfilePhoto: {
        height: 50,
        width: 50,
        borderRadius: 50,
        marginRight: 10,
    },
    postProfileName: {
        fontSize: 16,
        fontWeight: 500,
        color: "#333",
    },
    postProfileTime: {
        fontSize: 12,
        fontWeight: 500,
        color: "#777",
    },
    postTexts: {
        height: "auto",
        width: "100%",
        backgroundColor: "#fff",
        padding: 10,
    },
    postText: {
        color: "#333",
    },
    postImage: {
        height: 220,
        width: "auto",
    },
    postReactCounts: {
        height: 30,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "space-between",
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,

    },
    postReact: {
        height: 50,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "space-between",
    },
    postReactButton: {
        height: 30,
        width: 70,
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },
    postReactText: {
        fontSize: 14,
        fontWeight: 400,
        color: "#888",
        marginLeft: 5,


    },
    ordrGroceryButton: {
        height: 20,
        width: 100,
        backgroundColor: "#FDBD01",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 30,
    },
    ordrGroceryButtonText: {
        fontSize: 12,
        fontWeight: 500,
        color: "#fff",
        elevation: 5,
    },


})