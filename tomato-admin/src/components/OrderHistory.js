import React, { useEffect, useState } from 'react'
import { db, storage, firebase } from '../Firebase/FirebaseConfig'
import { collection, doc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import './OrderSection.css'
import EditIcon from '@mui/icons-material/Edit';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';

export default function OrderSection() {
    const [foodData, setFoodData] = useState([]);
    const [showData, setShowData] = useState([]);
    const orderRef = firebase.firestore().collection('Orders').where("restaurantEmailId", "==", window.localStorage.getItem("restaurantEmailId"));
    const foodRef = firebase.firestore().collection('FoodData');



    const [orders, setOrders] = useState([]);

    useEffect(() => {
        orderRef.onSnapshot(snapshot => {
            setOrders(snapshot.docs.map(doc => ({ ...doc.data(), ID: doc.id })))
        }
        )


    }, [])
    useEffect(() => {
        // console.warn(mainData[0][0].restaurantEmail);
        // [[{"foodAddon": "Extra cheese", "foodAddonPrice": "30", "foodCategory": "veg", "foodDescription": "Chicken Burger", "foodImageUrl": "https://firebasestorage.googleapis.com/v0/b/tomato-996be.appspot.com/o/FoodImages%2Fburger.jpg?alt=media&token=3d202b58-b967-4fb2-8345-958a8ca30a13", "foodName": "Burger", "foodPrice": "100", "foodType": "non-veg", "id": "1685722176138", "mealType": "dinner", "restaurantEmail": "ssh@gmail.com", "restaurantName": "SSH restaurant"}]]

        setShowData(orders.filter((item) => item.status.includes("handovered") || item.status.includes("delivered") || item.status.includes("paid")))


    }, [orders])
    useEffect(() => {
        console.log(orders)


    }, [orders])

    useEffect(() => {
        foodRef.onSnapshot(snapshot => {
            setFoodData(snapshot.docs.map(doc => doc.data()))
        }
        )


    }, [orders])
    const approveOrder = async (id) => {
        const userDoc = doc(db, "Orders", id);
        const newFields = { status: "accepted" };
        await updateDoc(userDoc, newFields);

    }
    const rejectOrder = async (id) => {
        const userDoc = doc(db, "Orders", id);
        const newFields = { status: "rejected" };
        await updateDoc(userDoc, newFields);

    }
    return (
        <div>
            <Navbar />
            <div className='orders'>
                <center><u><h4> Orders History</h4></u></center>

                {
                    showData.map((item) => {
                        return (
                            <div className='order'>
                                <div className='foods'>

                                    {item.order.map((menu) => {
                                        return (
                                            <>
                                                {
                                                    foodData.map((food) => {
                                                        if (food.id == menu.id && menu.quantity > 0)
                                                            return (
                                                                <h5>{`${food.foodName} -- ${menu.quantity}`}</h5>
                                                            )

                                                    })
                                                }
                                            </>

                                        )


                                    })}


                                </div>
                                <div className='price'>
                                    <p>Food Price -- {item.foodPrice}</p>
                                    <p>Delivery Charge -- {item.DeliveryFee}</p>

                                </div>
                                <div className='status'>
                                    <p>Status -- {item.status}</p>
                                    <p>Delivery time-- 20min</p>

                                </div>
                                <div className='address'>
                                    <p>address -- {item.DeliveryAddress}</p>
                                    <p>phone -- {item.phone}</p>

                                </div>
                                <div className='buttons'>
                                    {
                                        item.status == "pending" ?
                                            <>
                                                <p className='btn btn-success' onClick={() => { approveOrder(item.ID) }}>Approve</p>
                                                <p className='btn btn-danger' onClick={() => { rejectOrder(item.ID) }}>Decline</p>
                                            </>
                                            : item.status == "accepted" ? <p className='btn btn-success'>Hand over</p> : item.status == "delivered" ? <p className='btn btn-success'>Accept payment</p> : ""
                                    }

                                </div>

                            </div>

                        )
                    })
                }




            </div>

        </div>
    );
}
