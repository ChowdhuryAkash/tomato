import React, { useState,useEffect } from 'react'
import './AddFoodData.css'
import { Router,useNavigate } from 'react-router-dom';
// firebase imports
import { db, storage } from '../Firebase/FirebaseConfig'
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
import Signupnav from './Signupnav'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
//

const auth = getAuth();
const Signup = () => {

  const navigate = useNavigate();


  const [restaurantName, setRestaurantName] = useState('')
  const [restaurantPhone, setRestaurantPhone] = useState('')
  const [restaurantEmail, setRestaurantEmail] = useState('')
  const [restrauntAddressBuilding, setRestrauntAddressBuilding] = useState('')
  const [restrauntAddressStreet, setRestrauntAddressStreet] = useState('')
  const [restrauntAddressCity, setRestrauntAddressCity] = useState('')
  const [reatrauntAddressPincode, setRestrauntAddressPincode] = useState('')
  const [password, setPassword] = useState('')
  const [registered,setRegistered]=useState(false)

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
      lat,long,
      id: new Date().getTime().toString()
    }
    createUserWithEmailAndPassword(auth, restaurantEmail, password)
      .then((userCredential) => {
        // Signed in 
        alert("Restaurant has been registered successfuly!");
        setRegistered(true);
        try {
          const docRef = addDoc(collection(db, "Restaurants"), Restaurantdata);
          alert("Data added successfully ", docRef.id);
        }
        catch (error) {
          alert("Error adding document: ", error);
        }
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        switch(errorMessage){
          case "Firebase: Error (auth/email-already-in-use).":
            alert("Email Id already registered, please register with another emailid");
        }
        // ..
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
useEffect(()=>{
  if(registered==true){
    navigate("/");

  }
},[registered])
  // console.log(new Date().getTime().toString())
  return (
    <div className="food-outermost">
      <Signupnav />
      <div className="form-outer">
        <h1>Restaurant Sign Up</h1>
        <form className="form-inner">




          <label>Restaurant Name</label>
          <input type="text" name="restaurant_name"
            onChange={(e) => { setRestaurantName(e.target.value) }}
          />
          <br />
          <div className="form-row">

            <div className="form-col">
              <label>Restaurant Lat & Long</label>
              <input type="text" name="restaurant_address_street"
                value={` ${lat} |  ${long}`}
                onFocus={(getLocation)}
              />
            </div>
            <div className="form-col">
              <label>Restaurant Street / Area Name</label>
              <input type="text" name="restaurant_address_street"
                onChange={(e) => { setRestrauntAddressStreet(e.target.value) }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Restaurant City</label>
              <input type="text" name="restaurant_address_city"
                onChange={(e) => { setRestrauntAddressCity(e.target.value) }}
              />
            </div>
            <div className="form-col">
              <label>Restaurant Pin-code</label>
              <input type="number" name="restaurant_address_pincode"
                onChange={(e) => { setRestrauntAddressPincode(e.target.value) }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <label>Restaurant Phone</label>
              <input type="number" name="restaurant_phone"
                onChange={(e) => { setRestaurantPhone(e.target.value) }}
              />
            </div>
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

export default Signup