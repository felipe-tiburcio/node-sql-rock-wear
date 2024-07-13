require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require("fs");
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

  const sql = `INSERT INTO products(name, price, image) VALUES(?, ?, ?)`;

  connection.query(sql, [name, price, img], (err, ret) => {
    if (err) {
      throw err;
    }

    req.files.image.mv(__dirname + "/public/img/" + req.files.image.name);

    console.log(ret);
  });

  res.redirect("/");
});

app.get("/remove/:id&:image", (req, res) => {
  const id = req.params.id;

  const sql = `DELETE FROM products WHERE ID = ?`;

  connection.query(sql, [id], (err, ret) => {
    if (err) {
      throw err;
    }

    fs.unlink(`${__dirname}/public/img/${req.params.image}`, (err) => {
      if (err) {
        console.log(`Error removing image: ${err}`);
      }

      console.log("Successfully image removal");
    });
  });
  res.redirect("/");
});

app.get("/update/:id", (req, res) => {
  const { id } = req.params;

  let sqlSelect = `SELECT * FROM products WHERE ID = ?`;

  connection.query(sqlSelect, [id], (err, ret) => {
    if (err) {
      throw err;
    }

    const { id, name, price, image } = ret[0];

    res.render("update", { id, name, price, image });
  });
});

app.post("/sendUpdate", (req, res) => {
  const { id, name, price, image } = req.body;
  let newImage,
    sqlUpdate,
    requiredData = null;

  try {
    newImage = req.files.image.name || null;
  } catch (err) {}

  if (newImage) {
    sqlUpdate = `UPDATE products SET name = ?, price = ?, image = ? WHERE ID = ?;`;
    requiredData = [name, price, newImage, id];
  } else {
    sqlUpdate = `UPDATE products SET name = ?, price = ? WHERE ID = ?;`;
    requiredData = [name, price, id];
  }

  connection.query(sqlUpdate, requiredData, (err, ret) => {
    if (err) {
      throw err;
    }

    if (newImage) {
      fs.unlink(`${__dirname}/public/img/${image}`, (err) => {
        if (err) {
          console.log(`Error removing image: ${err}`);
        }

        console.log("Successfully image removal");
      });
      console.log(ret);

      req.files.image.mv(__dirname + "/public/img/" + req.files.image.name);
    }

    res.redirect("/");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
