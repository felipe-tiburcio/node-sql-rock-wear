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
app.engine("handlebars", engine({}));
app.set("view engine", "handlebars");
app.set("views", "./views");

const productRoutes = require("./routes/productsRoutes");

app.use("/", productRoutes);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
