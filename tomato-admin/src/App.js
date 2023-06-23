
import AddFoodData from './components/AddFoodData';
import EditFoodData from './components/EditFoodData';

import OrderSection from './components/OrderSection';
import OrderHistory from './components/OrderHistory';
import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import ShowDetails from './components/ShowDetails';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    // <div className="Container">
    //   {/* <AddFoodData /> */}
    //   <OrderSection />
    // </div>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrderSection />} />
        <Route path="/orderhistory" element={<OrderHistory />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addfood" element={<AddFoodData />} />
        <Route path="/editfood" element={<EditFoodData />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orderdetails/:orderid" element={<ShowDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
