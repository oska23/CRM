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

const AddComplaint = () => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [customer, setCustomer] = useState("");
  const [districts, setDistricts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get("https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/districts");
        setDistricts(response.data);
      } catch (error) {
        setError("Error fetching districts.");
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/departments"
        );
        setDepartments(response.data);
      } catch (error) {
        setError("Error fetching departments.");
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get("https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/customers");
        setCustomers(response.data);
      } catch (error) {
        setError("Error fetching customers.");
      }
    };

    fetchDistricts();
    fetchDepartments();
    fetchCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/complaints",
        {
          subject,
          description,
          district_id: districtId,
          department_id: departmentId,
          status,
          customer_id: customer,
        }
      );
      console.log(response.data);
      setSuccess("Complaint added successfully");
      // Clear form fields after successful submission
      setSubject("");
      setDescription("");
      setDistrictId("");
      setDepartmentId("");
      setStatus("Pending");
      setCustomer("");
      setError("");
      // Redirect to complaints list page after 2 seconds
      setTimeout(() => {
        navigate("/complaints");
      }, 2000);
    } catch (error) {
      setError("Failed to add complaint. Please try again.");
    }
  };

  return (
    <Container>
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Complaint
        </Typography>
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          <TextField
            label="Customer"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            fullWidth
            margin="normal"
            select
            required
          >
            {customers.map((customer) => (
              <MenuItem key={customer.customer_id} value={customer.customer_id}>
                {customer.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            margin="normal"
            select
            required
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Add Complaint
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddComplaint;
