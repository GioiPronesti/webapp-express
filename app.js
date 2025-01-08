const express = require("express");
const app = express();
const port = 3000;
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");
const movieRouter = require("./routers/movieRouter");

app.use(express.static("public"));

app.get("/", (req, res) => {
  console.log("main root");
  res.send("response server main root");
});

app.use("/api/movies", movieRouter);

app.use(errorsHandler);

app.use(notFound);

app.listen(port, () => {
  console.log("server is running");
});
