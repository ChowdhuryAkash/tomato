import { StyleSheet, Text, View, StatusBar, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import Loader from '../components/Loader';

import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { db, storage, firebase } from '../Firebase/firebaseConfig'
import { collection, doc, getDocs, setDoc, updateDoc, where, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const Comment = ({ navigation, route }) => {
    const data = route.params;
    const ID = data.ID;
    const comments = [...data.comments];
    const name = data.name;
    const profilePic = data.profilePic;
    const [email, setEmail] = useState("");
    const[loading,setLoading]=useState(false);

    const [commentText, setCommentText] = useState("");

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

        getData();

    }, [])
    const submitComment = async () => {
        setLoading(true);
        const postDoc = doc(db, "posts", ID);
        var commentData;

        commentData = {
                name: name,
                email: email,
                postText: commentText,
                profilePic: profilePic,

            }
            // comments.push(commentData);
            var comment=comments;
            comment.push(commentData);
            console.log(comment);

            var data={
                comment:comment
            }
        
        await updateDoc(postDoc, data).catch((error) => {
            console.log("Error updating document: ", error);
        });
        setLoading(false);
        alert("Comment Added");
        navigation.navigate("social");



    }
    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#ff3d00"
                barStyle="light-content"
            />
            <Text style={styles.mainText}>Comment</Text>
            <View style={styles.comments}>
                <ScrollView>

                    {
                        
                        comments.map((item,index) => {
                           
                            return (
                                <View style={styles.postTop} key={index}>
                                    <Image
                                        style={styles.postProfilePhoto}
                                        source={{
                                            uri: item.profilePic,
                                        }}
                                    />
                                    <View style={styles.comment}>
                                        <Text style={styles.postProfileName}>{item.name}</Text>
                                        <Text style={styles.postProfileTime}>{item.postText}</Text>
                                    </View>



                                </View>

                            )


                        })
                    }



                </ScrollView>

            </View>

            <View style={styles.createCommentBox}>
                <TextInput value={commentText} style={styles.createCommentInputBox}
                    onChange={(e) => { setCommentText(e.nativeEvent.text) }} multiline={true} placeholder="write comment here . . .">

                </TextInput>
                <TouchableOpacity onPress={()=>{submitComment()}}>
                    <Text style={styles.createCommenBtn}>Post</Text>
                </TouchableOpacity>

            </View>
            {loading ?
        <Loader />
        : ""}
        </View>
    )
}

export default Comment

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: "#fff",
        paddingBottom: 125,

    },
    mainText: {
        fontSize: 20,
        fontWeight: 500,
        color: "#333",
        marginTop: 10,
        textAlign: "center",
    },
    comments: {
        padding: 10,
        margin: 10,
        width: "95%",
        alignSelf: "center",
        height: 650,

    },
    postTop: {
        height: "auto",
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        padding: 10,
    },
    postProfilePhoto: {
        height: 45,
        width: 45,
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
        height: "auto",
    },
    comment: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 20,
        width: "80%",
        height: "auto",

    },
    createCommentBox: {
        height: "auto",
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        padding: 10,
        position: "absolute",
        bottom: 0,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    createCommentInputBox: {
        maxHeight: 100,
        width: "70%",
        backgroundColor: "#eee",
        borderRadius: 20,
        padding: 10,
    },
    createCommenBtn: {
        height: 40,
        width: 70,
        backgroundColor: "#ff3d00",
        borderRadius: 20,
        padding: 10,
        color: "#fff",
        textAlign: "center",
        fontWeight: 500,
    },
})