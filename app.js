require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 8000;

const mysql = require("mysql2");

const { HOST, USER, PASSWORD, DATABASE } = process.env;

const connection = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
});

connection.connect((err) => {
  err ? console.error(err) : console.log("Connection Successful");
});

app.get("/", (req, res) => {
  res.send("<h1>Hello, Node!</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
