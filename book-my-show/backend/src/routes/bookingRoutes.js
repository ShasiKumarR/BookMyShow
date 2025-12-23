const express = require("express");
const router = express.Router();
const controller = require("../controllers/bookingController");

router.post("/hold", controller.holdSeat);

module.exports = router;
