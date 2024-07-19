const connection = require("../database/connectionMySQL");
const fs = require("fs");
const path = require("path");

const replaceImg = (img, req, res) => {
  const imgBasePath = path.join(__dirname, "..") + "/public/img/";
  const uploadImg = req.files?.image || "";
  const newImage = uploadImg?.name || "";

  if (img !== newImage && img !== "" && newImage !== "") {
    fs.unlink(`${imgBasePath}/${img}`, (err) => {
      if (err) {
        throw err;
      }

      console.log("Image removed");
    });

    uploadImg.mv(imgBasePath + newImage);
    console.log("New image copied to img folder");
  }

  if (img === "") {
    uploadImg.mv(imgBasePath + newImage);
    console.log("New image copied to img folder");
  }
};

const saveForm = (req, res) => {
  res.render("form");
};

const saveFormWithStatus = (req, res) => {
  const { status } = req.params;

  res.render("form", { status: status });
};

const updateForm = (req, res) => {
  const { id } = req.params;

  let sqlSelect = `SELECT * FROM products WHERE ID = ?`;

  connection.query(sqlSelect, [id], (err, ret) => {
    if (err) {
      throw err;
    }

    const { id, name, price, image } = ret[0];

    res.render("update", { id, name, price, image });
  });
};

const listProducts = (req, res) => {
  const { category } = req.params;

  let sql = "";

  if (category === "all") {
    sql = `SELECT * from products ORDER BY RAND()`;
  } else {
    sql = `SELECT * FROM products WHERE CATEGORY = '${category}' ORDER BY name`;
  }

  connection.query(sql, (err, ret) => {
    if (err) {
      throw err;
    }

    res.render("list", { products: ret });
  });
};

const search = (req, res) => {
  const { word } = req.body;

  const sql = `SELECT * FROM products 
               WHERE name LIKE ? 
               OR price LIKE ?
               OR category LIKE ?`;

  connection.query(sql, [`%${word}%`, `%${word}%`, `%${word}%`], (err, ret) => {
    const noData = ret.length === 0;

    if (err) {
      throw err;
    }

    res.render("list", { products: ret, noData: noData });
  });
};

const saveProduct = (req, res) => {
  try {
    const { name, price, category } = req.body;
    const img = req.files?.image?.name || "";

    if (
      name === "" ||
      price === "" ||
      isNaN(price) ||
      category === "" ||
      img === ""
    ) {
      res.render("form", { isError: true });
    } else {
      const sql = `INSERT INTO products(name, price, category, image) VALUES(?, ?, ?, ?)`;

      connection.query(sql, [name, price, category, img], (err, ret) => {
        if (err) {
          throw err;
        }

        req.files.image.mv(path.join(__dirname, "../public/img/" + img));
      });

      res.render("form", { isDone: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const removeProduct = (req, res) => {
  try {
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

    res.redirect("/productRemoved");
  } catch (error) {
    res.redirect("/error");
  }
};

const updateProduct = (req, res) => {
  const { id, name, price, image, category } = req.body;
  const newImage = req.files?.image?.name || "";
  let sqlUpdate,
    requiredData = null;

  if (name === "" || price === "" || isNaN(price)) {
    res.redirect("/error");
  } else {
    if (newImage !== "" && category !== "") {
      sqlUpdate = `UPDATE products SET name = ?, price = ?, image = ?, category = ? WHERE ID = ?;`;
      requiredData = [name, price, newImage, category, id];

      replaceImg(image, req, res);
    } else {
      sqlUpdate = `UPDATE products SET name = ?, price = ? WHERE ID = ?;`;
      requiredData = [name, price, id];
    }

    connection.query(sqlUpdate, requiredData, (err, ret) => {
      if (err) {
        throw err;
      }

      res.redirect("/productUpdated");
    });
  }
};

module.exports = {
  saveForm,
  saveFormWithStatus,
  updateForm,
  listProducts,
  search,
  saveProduct,
  removeProduct,
  updateProduct,
};
