require("dotenv").config();

const express = require("express");
const app = express();
const PORT = 8000;

app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));
app.use("/css", express.static("./public/css"));

const { engine } = require("express-handlebars");
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");

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
  res.render("form.handlebars", {
    myVar: 42,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
