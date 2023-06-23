
import { Link, Router, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import './Navbar.css'
import { db, storage } from '../Firebase/FirebaseConfig'
import {
  addDoc, collection, getDocs, query, where, updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firebase } from '../Firebase/FirebaseConfig'
const Navbar = () => {

    const navigate = useNavigate();
    useEffect(() => {
        if (window.localStorage.getItem("restaurantEmailId") == "") {
            navigate("/login");
        }


    }, [])
    const [restaurantData, setRestaurantData] = useState([]);
    const [showrestaurantData, setShowrestaurantData] = useState([]);
    const restaurantRef = firebase.firestore().collection('Restaurants');
  

    useEffect(() => {
        restaurantRef.onSnapshot(snapshot => {
            setRestaurantData(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )
    
    
      }, [])
      useEffect(() => {
        setShowrestaurantData(restaurantData.filter((item) => item.restaurantEmail.includes(window.localStorage.getItem("restaurantEmailId"))))
        // console.log(foodData)
    
    
      }, [restaurantData])
    const[open,setOpen]=useState(false);
    useEffect(() => {
        console.log(showrestaurantData[0]);
        if(showrestaurantData.length>0)
        setOpen(showrestaurantData[0].open)
       
    
    
      }, [showrestaurantData])
      const openClose = async (id) => {
        const resDoc = doc(db, "Restaurants", id);
        const newFields = { open:!open };
        await updateDoc(resDoc,newFields);
      };
    return (
        <div className="navbar">
            <div className="nav-left">
                <h1>Tomato {open}</h1>
                {open?
                <label className="switch">
                <input type="checkbox"  checked onClick={()=>{openClose(showrestaurantData[0].ID)}}/>
                <span className="slider round" />
            </label>:
            <label className="switch">
            <input type="checkbox"   onClick={()=>{openClose(showrestaurantData[0].ID)}}/>
            <span className="slider round" />
        </label>
                }
                



            </div>
            <div className="nav-right">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <p>Orders</p>
                </Link>
                <Link to="/orderhistory" style={{ textDecoration: 'none' }}>
                    <p>Order history</p>
                </Link>
                <Link to="/addfood" style={{ textDecoration: 'none' }}>
                    <p>Add Food</p>
                </Link>
                <Link to="/editfood" style={{ textDecoration: 'none' }}>
                    <p>Edit Food</p>
                </Link>
                <Link to="/profile" style={{ textDecoration: 'none' }}>
                    <p>Profile</p>
                </Link>
                <button style={{ background: "transparent", border: "1px solid #fff", color: "#fff", width: "80px", padding: "5px 10px", borderRadius: "20px", fontSize: "15px", cursor: "pointer" }} onClick={
                    () => {
                        window.localStorage.setItem("restaurantEmailId", "");
                        window.localStorage.setItem("restaurantName", "");

                        navigate("/login");
                    }
                }>Log out</button>
            </div>
        </div>
    )
}

export default Navbar