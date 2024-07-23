import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";
import MenuIcon from "@mui/icons-material/Menu";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if current route is login or signup
  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  if (isLoginPage || isSignupPage) {
    return null; // Return null to hide the navbar on login and signup pages
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Hidden mdUp>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/customers");
              }}
            >
              Customers
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/add-customer");
              }}
            >
              Add Customer
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/complaints");
              }}
            >
              Complaints
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/add-complaint");
              }}
            >
              Add Complaint
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleMenuClose();
                handleLogout();
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Hidden>
        <Hidden smDown>
          <Button color="inherit" onClick={() => navigate("/customers")}>
            Customers
          </Button>
          <Button color="inherit" onClick={() => navigate("/add-customer")}>
            Add Customer
          </Button>
          <Button color="inherit" onClick={() => navigate("/complaints")}>
            Complaints
          </Button>
          <Button color="inherit" onClick={() => navigate("/add-complaint")}>
            Add Complaint
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Hidden>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
