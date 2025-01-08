const express = require("express");
const router = express.Router();

// index
router.get("/");

// show:  the parametric rout
router.get("/:id");

module.exports = router;
