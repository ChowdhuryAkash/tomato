import React, { useState, useEffect } from 'react'
import './AddFoodData.css'
import { Router, useNavigate } from 'react-router-dom';
// firebase imports
import { db, storage, firebase } from '../Firebase/FirebaseConfig'

import {
  addDoc, collection, getDocs, query, where, updateDoc,
  deleteDoc,
  doc,
  or,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
import Signupnav from './Signupnav'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//

export default function Profile() {

  const navigate = useNavigate();


  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')
  const [restaurantEmail, setRestaurantEmail] = useState('')
  const [restrauntAddressBuilding, setRestrauntAddressBuilding] = useState('')
  const [restrauntAddressStreet, setRestrauntAddressStreet] = useState('')
  const [restrauntAddressCity, setRestrauntAddressCity] = useState('')
  const [reatrauntAddressPincode, setRestrauntAddressPincode] = useState('')
  const [password, setPassword] = useState('')
  const [registered, setRegistered] = useState(false)

  const [ID, setID] = useState(null);

  // console.log(foodName, foodPrice, foodImage, foodCategory, foodDescription, restaurantName, restaurantAddress, restaurantPhone)
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [restaurant, setRestaurant] = useState({});

  const restaurantRef = firebase.firestore().collection('Restaurants');



  var emailid = window.localStorage.getItem('restaurantEmailId');
  useEffect(() => {
    restaurantRef.onSnapshot(snapshot => {
      setRestaurants(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
    }
    )


  }, [])
  useEffect(() => {
    setRestaurant(restaurants.filter((item) => item.restaurantEmail.includes(emailid)))

  }, [restaurants])
  useEffect(() => {
    if (restaurant.length > 0) {
      setRestaurantName(restaurant[0].restaurantName)
      setRestaurantPhone(restaurant[0].restaurantPhone)
      setRestaurantEmail(restaurant[0].restaurantEmail)
      setRestrauntAddressBuilding(restaurant[0].restrauntAddressBuilding)
      setRestrauntAddressStreet(restaurant[0].restrauntAddressStreet)
      setRestrauntAddressCity(restaurant[0].restrauntAddressCity)
      setRestrauntAddressPincode(restaurant[0].reatrauntAddressPincode)
      setPassword("")
      setLat(restaurant[0].lat)
      setLong(restaurant[0].long)
      setID(restaurant[0].ID)

      console.log(restaurant)
    }

  }, [restaurant])
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setLoading(1);
    // const cuser = firebase.auth().currentUser;
    // const newPassword = password;
    // cuser.updatePassword(newPassword).then(async() => {
    // Update successful.
    const userDoc = doc(db, "Restaurants", ID);
    const Restaurantdata = {
      restaurantName,
      restaurantPhone,
      restaurantEmail,
      restrauntAddressBuilding,
      restrauntAddressStreet,
      restrauntAddressCity,
      reatrauntAddressPincode,
      lat, long,
    }
    await updateDoc(userDoc, Restaurantdata).catch((error) => {
      console.log("Error updating document: ", error);
    });
    alert("Profile updated successfully");
    // }).catch((error) => {
    //     // An error occurred
    //     // ...
    // });


  }

  const getLocation = () => {
    const successCallback = (position,) => {
      setLat(position.coords.latitude);
      setLong(position.coords.longitude,


      );

    };

    const errorCallback = (error) => {

      console.log(error);
    };

    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }
  return (
    <div className="food-outermost">
      <Navbar />
      <div className="form-outer">
        <h1>Restaurant Profile</h1>
        <form className="form-inner">




          <label>Restaurant Name</label>
          <input type="text" name="restaurant_name" value={restaurantName}
            onChange={(e) => { setRestaurantName(e.target.value) }}
          />
          <br />
          <div className="form-row">

            <div className="form-col">
              <label>Restaurant Lat & Long</label>
              <input type="text" name="restaurant_address_street"
                value={`${lat} | ${long}`}

                onFocus={(getLocation)}
              />
            </div>
            <div className="form-col">
              <label>Restaurant Street / Area Name</label>
              <input type="text" value={restrauntAddressStreet} name="restaurant_address_street"
                onChange={(e) => { setRestrauntAddressStreet(e.target.value) }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Restaurant City</label>
              <input type="text" value={restrauntAddressCity} name="restaurant_address_city"
                onChange={(e) => { setRestrauntAddressCity(e.target.value) }}
              />
            </div>
            <div className="form-col">
              <label>Restaurant Pin-code</label>
              <input type="number" value={reatrauntAddressPincode} name="restaurant_address_pincode"
                onChange={(e) => { setRestrauntAddressPincode(e.target.value) }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Restaurant Phone</label>
              <input type="number" value={restaurantPhone} name="restaurant_phone"
                onChange={(e) => { setRestaurantPhone(e.target.value) }}
              />
            </div>
            {/* <div className="form-col">
            <label>Restaurant Email</label>
            <input type="email" name="restaurant_email"
              onChange={(e) => { setRestaurantEmail(e.target.value) }}
            />
          </div> */}
          </div>
          <div className="form-row">


            {/* <div className="form-col">
            <label>Password</label>
            <input type="email" name="restaurant_email"
              onChange={(e) => { setPassword(e.target.value) }}
            />
          </div> */}
          </div>
          <br />
          <button onClick={handleSubmit}>Save Changes</button>
        </form>
      </div>
    </div>
  );
}
