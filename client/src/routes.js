import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Customers from "./components/Customers";
import Complaints from "./components/Complaints";
import NavBar from "./components/NavBar";
import AddComplaint from "./components/AddComplaint";
import AddCustomer from "./components/AddCustomer";

const AppRoutes = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Set the default route to navigate to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/add-complaint" element={<AddComplaint />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/add-customer" element={<AddCustomer />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
