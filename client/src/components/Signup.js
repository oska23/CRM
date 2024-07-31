import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "user", // Assuming default role is 'user'
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear any previous errors when user starts typing
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://container-service-3.08h3clado6ibk.eu-central-1.cs.amazonlightsail.com/api/signup",
        formData
      );
      console.log("Signup successful:", response.data);
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Display specific backend error message
      } else {
        setError("Error signing up. Please try again."); // Generic error message
      }
      console.error("Signup error:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        {error && (
          <Typography variant="body2" color="error" paragraph>
            {error}
          </Typography>
        )}
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            name="name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            label="Phone"
            name="phone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />
          <TextField
            label="Username"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
          <Typography variant="body1" mt={2}>
            Already have an account?{" "}
            <Link component="button" onClick={() => navigate("/login")}>
              Login
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Signup;
