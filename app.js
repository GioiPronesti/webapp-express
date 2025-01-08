const express = require("express");
const app = express();
const port = 3000;
const movieRouter = require("./routers/movieRouter");

app.use(express.static("public"));

app.use("/api/movies", movieRouter);

app.get("/", (req, res) => {
  console.log("main root");
  res.send("response server main root");
});

app.listen(port, () => {
  console.log("server is running");
});
