const express = require("express");

const app = express();

const PORT = 8000;

app.get("/", (req, res) => {
  res.send("<h1>Hello, Node!</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
