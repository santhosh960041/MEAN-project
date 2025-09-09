import Addvehicle from "./pages/admin/addvehicle/AddVehicle";
import ViewVehicles from "./pages/users/viewVehicles/ViewVehicles";
import AddVenue from "./pages/admin/addvenue/AddVenue";
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Bidding from "./pages/users/bidding/Bidding";
import Registration from "./pages/users/registration/Registration";
import Login from "./pages/users/login/Login";
import VehiclesAdmin from "./pages/admin/vehiclesadmin/VehiclesAdmin";
import Buys from "./pages/users/buys/Buys";
import AdminLogin from "./pages/admin/login/Adminlogin";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/userregister" element={<Registration/>} />
        <Route path="/bidding/:id/:user" element={<Bidding />} />
        <Route path="/viewvehicles/:user" element={<ViewVehicles/>} />
        
        <Route path="/admin" element={<AdminLogin/>}></Route>
        <Route path="/admindash" element={<AddVenue/>}></Route>
        <Route path="/adminvehicle" element={<Addvehicle/>}></Route>
        <Route path="/vehiclesadmin" element={<VehiclesAdmin/>}></Route>
        <Route path="/viewbuys/:user" element={<Buys/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
