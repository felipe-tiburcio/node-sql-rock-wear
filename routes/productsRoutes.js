const express = require("express");

const productService = require("../services/productService");

const router = express.Router();

router.get("/", (req, res) => {
  productService.saveForm(req, res);
});

router.get("/:status", (req, res) => {
  productService.saveFormWithStatus(req, res);
});

router.get("/list/:category", (req, res) => {
  productService.listProducts(req, res);
});

router.post("/search", (req, res) => {
  productService.search(req, res);
});

router.post("/save", (req, res) => {
  productService.saveProduct(req, res);
});

router.delete("/remove/:id&:image", (req, res) => {
  productService.removeProduct(req, res);
});

router.get("/update/:id", (req, res) => {
  productService.updateForm(req, res);
});

router.post("/sendUpdate", (req, res) => {
  productService.updateProduct(req, res);
});

module.exports = router;
