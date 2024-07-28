const express = require('express')
const router = express.Router();
const adminController = require('../../controllers/adminController/adminController')

router.post('/add-client', adminController.addClient)

module.exports = router