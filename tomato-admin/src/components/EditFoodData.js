import React, { useState, useEffect } from 'react'
import './EditFoodData.css'
// firebase imports
import { db, storage } from '../Firebase/FirebaseConfig'
import {
  addDoc, collection, getDocs, query, where, updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
import { firebase } from '../Firebase/FirebaseConfig'
import { get, child } from "firebase/database";


export default function EditFoodData() {
  const foodRef = firebase.firestore().collection('FoodData');
  const restaurant_email = window.localStorage.getItem("restaurantEmailId");

  const [foodData, setFoodData] = useState([]);
  const [showData, setShowData] = useState([]);


  const [foodName, setFoodName] = useState("");
  const [foodDescription, setFoodDescription] = useState("");
  const [foodPrice, setFoodPrice] = useState("");
  const [ID, setID] = useState("");
  const [popup, setPopup] = useState(false);

  useEffect(() => {
    foodRef.onSnapshot(snapshot => {
      setFoodData(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
    }
    )


  }, [])
  useEffect(() => {
    // console.warn(mainData[0][0].restaurantEmail);
    // [[{"foodAddon": "Extra cheese", "foodAddonPrice": "30", "foodCategory": "veg", "foodDescription": "Chicken Burger", "foodImageUrl": "https://firebasestorage.googleapis.com/v0/b/tomato-996be.appspot.com/o/FoodImages%2Fburger.jpg?alt=media&token=3d202b58-b967-4fb2-8345-958a8ca30a13", "foodName": "Burger", "foodPrice": "100", "foodType": "non-veg", "id": "1685722176138", "mealType": "dinner", "restaurantEmail": "ssh@gmail.com", "restaurantName": "SSH restaurant"}]]

    setShowData(foodData.filter((item) => item.restaurantEmail.includes(restaurant_email)))
    console.log(foodData)


  }, [foodData])

  useEffect(() => {
    console.log(showData)


  }, [showData])

  const updateAvailablity = async (id, availablity) => {
    const userDoc = doc(db, "FoodData", id);
    console.log(availablity)
    let newavailablity = true;
    if (availablity) {
      newavailablity = false
    }
    else {
      newavailablity = true;

    }
    console.log(newavailablity)
    const newFields = { availablity: newavailablity };
    await updateDoc(userDoc, newFields);
  };

  const deleteFood = async (id) => {
    const foodDoc = doc(db, "FoodData", id);
    await deleteDoc(foodDoc);
  };
  const editFood = async (id) => {
    const foodDoc = doc(db, "FoodData", id);
    const newFields = { foodName:foodName,foodDescription:foodDescription,foodPrice:foodPrice };
    await updateDoc(foodDoc,newFields);
    setPopup(false);
    alert("Food Data Updated")
  };


  return (
    <div>
      <Navbar />{
        popup ?
          <div className='popup' >
            <i className="fa-solid fa-xmark cut" onClick={() => {
              setPopup(false);
            }}></i>

            <div className="form-outer">
              <h1>Edit Food Data</h1>
              <div className="form-inner">
                <label>Food Name</label>
                <input type="text" name="food_name" value={foodName}
                  onChange={(e) => {
                    setFoodName(e.target.value)

                  }} />
                <br />
                <label>Food Description</label>
                <input type="text" name="food_description" value={foodDescription}
                  onChange={(e) => {
                    setFoodDescription(e.target.value)

                  }} />
                <br />
                <div className="form-row">

                  <div className="form-col">
                    <label>Food Price</label>
                    <input type="number" name="food_price" value={foodPrice} onChange={(e) => {
                      setFoodPrice(e.target.value)

                    }} />
                  </div>
                </div>


                <button onClick={
                  (e)=>{
                    editFood(ID);
                  }
                }>Save Changes</button>


              </div>
            </div>


          </div>

          :

          ""

      }

      <div style={{ width: "90vw", margin: "auto", }}>

        {
          showData.map((item) => {
            return (
              <div className="container bcontent">

                <div className="card" style={{ width: 900, marginTop: "40px" }}>
                  <div className="row no-gutters">
                    <div className="col-sm-5">
                      <img
                        className="card-img"
                        src={item.foodImageUrl}
                        alt="Suresh Dasari Card"
                      />
                    </div>
                    <div className="col-sm-7">
                      <div className="card-body">
                        <p className="card-title">{item.foodName}</p>
                        <p className="card-text">
                          ₹ {item.foodPrice}
                        </p>
                        <p className="btn btn-danger m-2" style={{ cursor: "pointer" }} onClick={() => {

                          // deleteFood(item.ID)
                          if (window.confirm("Delete the item?")) {
                            deleteFood(item.ID);
                          }
                        }}>
                          Delete Item
                        </p>
                        <p className="btn btn-primary m-2" style={{ cursor: "pointer" }} onClick={() => {
                          setPopup(true);
                          setFoodName(item.foodName);
                          setFoodDescription(item.foodDescription);
                          setFoodPrice(item.foodPrice);
                          setID(item.ID)
                        }}>
                          Edit item
                        </p>
                        <p style={{ cursor: "pointer" }} onClick={() => { updateAvailablity(item.ID, item.availablity) }} className={item.availablity ? "btn btn-danger m-2" : "btn btn-success m-2"}>
                          {item.availablity ? "Make it Unavailable" : "Make it Available"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        }

      </div>




    </div>
  );
}
