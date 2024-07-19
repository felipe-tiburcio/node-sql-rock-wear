require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const productService = require("./services/productService");
const app = express();
const PORT = 8000;
const connection = require("./database/connectionMySQL");

app.use("/bootstrap", express.static("./node_modules/bootstrap/dist"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(fileUpload());

const { engine } = require("express-handlebars");
app.engine("handlebars", engine({}));
app.set("view engine", "handlebars");
app.set("views", "./views");

app.get("/", (req, res) => {
  productService.saveForm(req, res);
});

app.get("/:status", (req, res) => {
  productService.saveFormWithStatus(req, res);
});

app.get("/list/:category", (req, res) => {
  productService.listProducts(req, res);
});

app.post("/search", (req, res) => {
  productService.search(req, res);
});

app.post("/save", (req, res) => {
  productService.saveProduct(req, res);
});

app.delete("/remove/:id&:image", (req, res) => {
  productService.removeProduct(req, res);
});

app.get("/update/:id", (req, res) => {
  productService.updateForm(req, res);
});

app.post("/sendUpdate", (req, res) => {
  productService.updateProduct(req, res);
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
