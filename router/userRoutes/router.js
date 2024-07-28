const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController/userController');

router.post('/login', userController.login);
router.post('/signup', userController.signup);
router.post('/add-pack', userController.addPackage);
router.post('/add-cash', userController.addCash);
router.get('/get-clients', userController.getAvailableClients);
router.get('/get-packs', userController.getAvailablePackages);
router.get('/get-cash', userController.getAvailableCash);

module.exports = router;
