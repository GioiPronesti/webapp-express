const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// index
router.get("/", movieController.index);

// show:  the parametric rout
router.get("/:id", movieController.show);

// store: add new review, body information data
//api/movies/:id/reviews
router.post("/:id/reviews", movieController.storeReview);

module.exports = router;
