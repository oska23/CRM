// CustomerForm.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";

const CustomerForm = () => {
  const history = useHistory();
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    district_id: "",
    department_id: "",
    form_filled_by_id: "",
  });
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formFilledByUsers, setFormFilledByUsers] = useState([]);

  useEffect(() => {
    fetchDistricts();
    fetchDepartments();
    fetchFormFilledByUsers();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/districts");
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("http://localhost:3000/departments");
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const fetchFormFilledByUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/form_filled_by");
      setFormFilledByUsers(response.data);
    } catch (error) {
      console.error("Error fetching form filled by users:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/customers", customer);
      alert("Customer added successfully");
      history.push("/customers"); // Redirect to customer list after successful addition
    } catch (error) {
      console.error("Error adding customer:", error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Add Customer</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          name="name"
          label="Name"
          value={customer.name}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          name="phone"
          label="Phone"
          value={customer.phone}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <FormControl fullWidth required margin="normal">
          <InputLabel>District</InputLabel>
          <Select
            name="district_id"
            value={customer.district_id}
            onChange={handleInputChange}
          >
            {districts.map((district) => (
              <MenuItem key={district.district_id} value={district.district_id}>
                {district.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required margin="normal">
          <InputLabel>Department</InputLabel>
          <Select
            name="department_id"
            value={customer.department_id}
            onChange={handleInputChange}
          >
            {departments.map((department) => (
              <MenuItem
                key={department.department_id}
                value={department.department_id}
              >
                {department.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth required margin="normal">
          <InputLabel>Form Filled By</InputLabel>
          <Select
            name="form_filled_by_id"
            value={customer.form_filled_by_id}
            onChange={handleInputChange}
          >
            {formFilledByUsers.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Add Customer
        </Button>
      </form>
    </div>
  );
};

export default CustomerForm;
