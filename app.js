require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const PORT = 8000;

app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());

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
  const sql = "SELECT * FROM products";

  connection.query(sql, (err, ret) => {
    if (err) {
      throw err;
    }

    res.render("form", { products: ret });
  });
});

app.post("/save", (req, res) => {
  const { name, price } = req.body;
  const img = req.files.image.name;

  const sql = `INSERT INTO products(name, price, image) VALUES('${name}', ${price}, '${img}')`;

  connection.query(sql, (err, ret) => {
    if (err) {
      throw err;
    }

    req.files.image.mv(__dirname + "/public/img/" + req.files.image.name);

    console.log(ret);
  });

  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
