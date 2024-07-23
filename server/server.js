const mysql = require("mysql2");
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const app = express();
app.use(cors());
app.use(express.json());

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

// Endpoint to handle user signup
app.post("/api/signup", async (req, res) => {
  const { name, email, phone, username, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds: 10

    // Insert user into the database with hashed password
    const sql =
      "INSERT INTO users (name, email, phone, username, password, role) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [name, email, phone, username, hashedPassword, role],
      (err, result) => {
        if (err) {
          console.error("Error signing up:", err);
          return res.status(500).json({ error: "Failed to sign up user" });
        }
        res.status(201).json({
          message: "User signed up successfully",
          userId: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).json({ error: "Failed to sign up user" });
  }
});

// Endpoint to handle user login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Query the database to find the user with the given username
  const sql = "SELECT * FROM users WHERE username = ?";
  db.query(sql, [username], async (err, results) => {
    if (err) {
      console.error("Error retrieving user:", err);
      return res.status(500).json({ error: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Compare hashed password
    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.user_id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m", // Token expires in 15 minutes
      }
    );

    res.status(200).json({ token });
  });
});

// Endpoint to get all districts
app.get("/api/districts", (req, res) => {
  const sql = "SELECT * FROM districts";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching districts:", err);
      return res.status(500).json({ error: "Failed to fetch districts" });
    }
    res.status(200).json(results);
  });
});

// Endpoint to get all departments
app.get("/api/departments", (req, res) => {
  const sql = "SELECT * FROM departments";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching departments:", err);
      return res.status(500).json({ error: "Failed to fetch departments" });
    }
    res.status(200).json(results);
  });
});

// Add complaint endpoint
app.post("/api/complaints", (req, res) => {
  const {
    subject,
    description,
    district_id,
    department_id,
    status,
    customer_id,
  } = req.body;

  if (
    !subject ||
    !description ||
    !district_id ||
    !department_id ||
    !status ||
    !customer_id
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const sql = `
    INSERT INTO complaints (subject, description, district_id, department_id, status, customer_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    sql,
    [subject, description, district_id, department_id, status, customer_id],
    (err, result) => {
      if (err) {
        console.error("Error adding complaint:", err);
        return res.status(500).json({ error: "Failed to add complaint" });
      }
      res.status(201).json({
        complaint_id: result.insertId,
        message: "Complaint added successfully",
      });
    }
  );
});

// Endpoint to get all customers
app.get("/api/customers", (req, res) => {
  const sql = `
    SELECT 
      customers.customer_id,
      customers.name,
      customers.phone,
      districts.name AS district,
      departments.name AS department
    FROM customers
    LEFT JOIN districts ON customers.district_id = districts.district_id
    LEFT JOIN departments ON customers.department_id = departments.department_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching customers:", err);
      return res.status(500).json({ error: "Failed to fetch customers" });
    }
    res.status(200).json(results);
  });
});

// Endpoint to get all complaints with associated customer details
app.get("/api/complaints", (req, res) => {
  const sql = `
    SELECT 
      complaints.complaint_id,
      complaints.subject,
      complaints.description,
      customers.name AS customer_name,
      districts.name AS district,
      departments.name AS department,
      complaints.status,
      complaints.created_at
    FROM complaints
    LEFT JOIN customers ON complaints.customer_id = customers.customer_id
    LEFT JOIN districts ON complaints.district_id = districts.district_id
    LEFT JOIN departments ON complaints.department_id = departments.department_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching complaints:", err);
      return res.status(500).json({ error: "Failed to fetch complaints" });
    }
    res.status(200).json(results);
  });
});

// Add customer endpoint
app.post("/api/customers", async (req, res) => {
  const { name, phone, district_id, department_id } = req.body;
  if (!name || !phone || !district_id || !department_id) {
    return res.status(400).send("All fields are required");
  }

  try {
    db.query(
      "INSERT INTO customers (name, phone, district_id, department_id) VALUES (?, ?, ?, ?)",
      [name, phone, district_id, department_id],
      (err, result) => {
        if (err) {
          console.error("Error adding customer:", err);
          return res.status(500).send("Error adding customer");
        }
        res.status(201).send({ customer_id: result.insertId });
      }
    );
  } catch (error) {
    console.error("Error adding customer:", error);
    res.status(500).send("Error adding customer");
  }
});

// Example endpoint to update complaint status
app.put("/api/complaints/:complaintId", (req, res) => {
  const { status } = req.body;
  const { complaintId } = req.params;

  const sql = "UPDATE complaints SET status = ? WHERE complaint_id = ?";
  db.query(sql, [status, complaintId], (err, result) => {
    if (err) {
      console.error("Error updating complaint status:", err);
      return res
        .status(500)
        .json({ error: "Failed to update complaint status" });
    }
    res.status(200).json({ message: "Complaint status updated successfully" });
  });
});

// Endpoint to update a customer
app.put("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;
  const { name, phone, district_id, department_id } = req.body;
  const sql = `
    UPDATE customers
    SET name = ?, phone = ?, district_id = ?, department_id = ?
    WHERE customer_id = ?
  `;
  const values = [name, phone, district_id, department_id, customerId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating customer:", err);
      return res.status(500).send("Server error");
    }
    res.send("Customer updated successfully");
  });
});

// Endpoint to delete a customer
app.delete("/api/customers/:id", (req, res) => {
  const customerId = req.params.id;
  const sql = "DELETE FROM customers WHERE customer_id = ?";

  db.query(sql, customerId, (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      return res.status(500).send("Server error");
    }
    res.send("Customer deleted successfully");
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
