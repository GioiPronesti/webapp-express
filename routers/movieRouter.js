const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// index
router.get("/", movieController.index);

// show:  the parametric rout
router.get("/:id", movieController.show);

module.exports = router;
