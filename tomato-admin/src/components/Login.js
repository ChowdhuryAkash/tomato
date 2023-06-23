import React, { useState,useEffect } from 'react'
import { Router,useNavigate } from 'react-router-dom';
import './AddFoodData.css'
// firebase imports
import { db, storage } from '../Firebase/FirebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
import Signupnav from './Signupnav'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
//

const auth = getAuth();
const Login = () => {
 

  const navigate = useNavigate();



  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')
  const [restaurantEmail, setRestaurantEmail] = useState('')
  const [restrauntAddressBuilding, setRestrauntAddressBuilding] = useState('')
  const [restrauntAddressStreet, setRestrauntAddressStreet] = useState('')
  const [restrauntAddressCity, setRestrauntAddressCity] = useState('')
  const [reatrauntAddressPincode, setRestrauntAddressPincode] = useState('')
  const [password, setPassword] = useState('')

  // console.log(foodName, foodPrice, foodImage, foodCategory, foodDescription, restaurantName, restaurantAddress, restaurantPhone)
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");




  const handleSubmit = (e) => {
    e.preventDefault()


    // console.log(url)
    // setFoodImageUrl(url)

    const Restaurantdata = {
      restaurantName,
      restaurantPhone,
      restaurantEmail,
      restrauntAddressBuilding,
      restrauntAddressStreet,
      restrauntAddressCity,
      reatrauntAddressPincode,
      lat, long,
      id: new Date().getTime().toString()
    }
    signInWithEmailAndPassword(auth, restaurantEmail, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log(user.email);
        window.localStorage.setItem('restaurantEmailId', user.email);
        window.localStorage.setItem('user', user);
        
        var emailid = window.localStorage.getItem('restaurantEmailId');
        navigate("/");
       
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        switch (errorMessage) {
          case "Firebase: Error (auth/wrong-password).":
            alert("Password Mismatched, try again.");
            break;
          case "Firebase: Error (auth/user-not-found).":
            alert("No Restaurant is registered with this email id");
            break;
          case "Firebase: Error (auth/invalid-email).":
            alert("Please Enter a valid email id");
            break;

          default:
            alert("Something went wrong please try again.");
        }
      });

    // console.log(foodData)

    // ======================

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

  // console.log(new Date().getTime().toString())

    
  if(!(window.localStorage.getItem("restaurantEmailId")=="")){
    navigate("/");
  }
useEffect(()=>{
  if(!(window.localStorage.getItem("restaurantEmailId")=="")){
    navigate("/");
  }

},[])
  return (
    <div className="food-outermost">
      <Signupnav />
      <div className="form-outer">
        <h1>Restaurant Log in</h1>
        <form className="form-inner">






          <div className="form-row">

            <div className="form-col">
              <label>Restaurant Email</label>
              <input type="email" name="restaurant_email"
                onChange={(e) => { setRestaurantEmail(e.target.value) }}
              />
            </div>
          </div>
          <div className="form-row">


            <div className="form-col">
              <label>Password</label>
              <input type="email" name="restaurant_email"
                onChange={(e) => { setPassword(e.target.value) }}
              />
            </div>
          </div>
          <br />
          <button onClick={handleSubmit}>Submit</button>
        </form>
      </div>
    </div>
  )
  
}

export default Login