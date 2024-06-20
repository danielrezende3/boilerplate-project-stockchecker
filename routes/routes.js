const express = require('express');
const stockPricesController = require("./stockPrices/stockPrices.controller");

const router = express.Router();


router.use("/api", stockPricesController.getStock);

module.exports = router;