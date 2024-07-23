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

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/api/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store token in localStorage
      navigate("/customers");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // Display specific backend error message
      } else {
        setError("Error logging in. Please try again."); // Generic error message
      }
      console.error("Login error:", err);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        {error && (
          <Typography variant="body2" color="error" paragraph>
            {error}
          </Typography>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
          <Typography variant="body1" mt={2}>
            Don't have an account?{" "}
            <Link component="button" onClick={() => navigate("/signup")}>
              Sign Up
            </Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
