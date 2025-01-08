const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log("main root");
  res.send("response server main root");
});

app.listen(port, () => {
  console.log("server is running");
});
