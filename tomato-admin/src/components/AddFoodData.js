import React, { useState,useEffect } from 'react'
import './AddFoodData.css'
// firebase imports
import { db, storage } from '../Firebase/FirebaseConfig'
import { addDoc, collection, getDocs,query,where } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from './Navbar';
import { get ,child} from "firebase/database";


//
const AddFoodData = () => {

    const usersCollectionRef = collection(db, "Restaurants");
    const q = query(collection(db, "Restaurants"), where("restaurantEmail", "==", window.localStorage.restaurantEmailId));
    const[restaurant,setRestaurant]=useState([
        [{restaurantEmail:""}]
    ]);

    const [foodName, setFoodName] = useState('')
    const [foodPrice, setFoodPrice] = useState('')
    const [foodImage, setFoodImage] = useState(null)
    const [foodCategory, setFoodCategory] = useState('')
    const [foodDescription, setFoodDescription] = useState('')
    const [foodImageUrl, setFoodImageUrl] = useState('')


    //
    const [foodType, setFoodType] = useState('')
    const [mealType, setMealType] = useState('')
    const [foodAddon, setFoodAddon] = useState('')
    const [foodAddonPrice, setFoodAddonPrice] = useState('')
    const [restaurantEmail, setRestaurantEmail] = useState('')
    
    const [restaurantName, setRestaurantName] = useState('')
 
    // console.log(foodName, foodPrice, foodImage, foodCategory, foodDescription, restaurantName, restaurantAddress, restaurantPhone)

    const handleSubmit = (e) => {
        e.preventDefault()

        if (foodImage == null) {
            alert('Please select an image')
            return
        }
        

        else {
            const imageRef = ref(storage, `FoodImages/${foodImage.name}`)
            uploadBytes(imageRef, foodImage)
                .then(() => {
                    alert('Image uploaded successfully')
                    getDownloadURL(imageRef)
                        .then((url) => {
                            // console.log(url)
                            // setFoodImageUrl(url)

                            const foodData = {
                                foodName,
                                foodPrice,
                                foodImageUrl: url,
                                foodCategory,
                                foodDescription,
                                foodType,
                                mealType,
                                foodAddon,
                                foodAddonPrice,
                                restaurantEmail:restaurant[0].restaurantEmail,
                                restaurantName:restaurant[0].restaurantName,
                                id: new Date().getTime().toString(),
                                availablity:true
                            }

                            // console.log(foodData)
                            try {
                                const docRef = addDoc(collection(db, "FoodData"), foodData);
                                alert("Data added successfully ", docRef.id);
                            }
                            catch (error) {
                                alert("Error adding document: ", error);
                            }
                        })
                })
                .catch((error) => {
                    alert(error.message)
                })
        }

    }

useEffect(() => {
    console.log(foodImage)
}, [foodImage])
  
 useEffect(() => {
    const getRestaurantData = async () => {
        const data = await getDocs(q);
        await setRestaurant(data.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id })
          ));
          
    
          

      };
    getRestaurantData();
    
    
  }, []);
  useEffect(() => {
    console.log(restaurant)
  

  },[restaurant]);
    return (
        <div className="food-outermost">
            <Navbar />
            <div className="form-outer">
                <h1>Add Food Data</h1>
                <form className="form-inner">
                    <label>Food Name</label>
                    <input type="text" name="food_name"
                        onChange={(e) => { setFoodName(e.target.value) }} />
                    <br />
                    <label>Food Description</label>
                    <input type="text" name="food_description"
                        onChange={(e) => { setFoodDescription(e.target.value) }} />
                    <br />


                    <div className="form-row">

                        <div className="form-col">
                            <label>Food Price</label>
                            <input type="number" name="food_price"
                                onChange={(e) => { setFoodPrice(e.target.value) }}
                            />
                        </div>
                        <div className="form-col">
                            <label>Food Type</label>

                            <select name="food_type" onChange={(e) => { setFoodType(e.target.value) }}>
                                <option value="null">Select Food Type</option>
                                <option value="veg">Veg</option>
                                <option value="non-veg">Non-Veg</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <label>Food Category</label>
                            <select name="food_category" onChange={(e) => { setFoodCategory(e.target.value) }}>
                                <option value="null">Select Food Category</option>
                                <option value="veg">Indian</option>
                                <option value="non-veg">Chineese</option>
                                <option value="non-veg">Italian</option>
                                <option value="non-veg">Mexican</option>
                                <option value="non-veg">American</option>
                            </select>
                        </div>
                        <div className="form-col">
                            <label>Meal Type</label>

                            <select name="meal_type" onChange={(e) => { setMealType(e.target.value) }}>
                                <option value="null">Select Meal Type</option>
                                <option value="dinner">Dinner</option>
                                <option value="staters">Starters</option>
                                <option value="breakfast">Breakfast</option>
                                <option value="liquid">Liquid</option>
                            </select>
                        </div>
                    </div>
                    <br />
                    <div class="form-row">
                        <div class="form-col">
                            <label>Add On</label>
                            <input type="text" name="food_addon"
                                onChange={(e) => { setFoodAddon(e.target.value) }}
                            />
                        </div>
                        <div className='form-col'>
                            <label>Add On Price</label>
                            <input type="text" name="food_addon_price"
                                onChange={(e) => { setFoodAddonPrice(e.target.value) }}
                            />
                        </div>
                    </div>
                    <br />
                    {/*  */}
                    {/*  */}
                    {/*                                          */}
                    <label>Food Image</label>
                    <input type="file" name="food_image"
                        onChange={(e) => { setFoodImage(e.target.files[0]) }}
                    />
                    <br />
               
                 

                  
                    <div class="form-row">
                       
                        <div class="form-col">
                            <label>Restaurant Email</label>
                            <input type="email" name="restaurant_email"
                            value={restaurant[0].restaurantEmail}
                               
                            />
                        </div>

                        <div class="form-col">
                            <label>Restaurant Name</label>
                            <input type="name" name="restaurant_email"
                            value={restaurant[0].restaurantName}
                               
                            />
                        </div>
                    </div>
                    <br />
                    <button onClick={handleSubmit}>Add Food</button>
                </form>
            </div>
        </div>
    )
}

export default AddFoodData