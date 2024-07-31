import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate hook

  const fetchDistricts = async () => {
    try {
      const response = await axios.get("https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/districts");
      setDistricts(response.data);
    } catch (error) {
      setError("Error fetching districts.");
      console.error("Error fetching districts:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/departments");
      setDepartments(response.data);
    } catch (error) {
      setError("Error fetching departments.");
      console.error("Error fetching departments:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/customers", {
        name,
        phone,
        district_id: districtId,
        department_id: departmentId,
      });
      console.log(response.data);
      setSuccess("Customer added successfully");
      // Clear form fields after successful submission
      setName("");
      setPhone("");
      setDistrictId("");
      setDepartmentId("");
      // Redirect to customer list page after 2 seconds
      setTimeout(() => {
        navigate("/customers");
      }, 2000);
    } catch (error) {
      setError("Failed to add customer.");
      console.error("Error adding customer:", error);
    }
  };

  useEffect(() => {
    fetchDistricts();
    fetchDepartments();
  }, []);

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Customer
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="District"
            value={districtId}
            onChange={(e) => setDistrictId(e.target.value)}
            fullWidth
            margin="normal"
            select
            required
          >
            {districts.map((district) => (
              <MenuItem key={district.district_id} value={district.district_id}>
                {district.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            fullWidth
            margin="normal"
            select
            required
          >
            {departments.map((department) => (
              <MenuItem
                key={department.department_id}
                value={department.department_id}
              >
                {department.name}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Add Customer
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddCustomer;
