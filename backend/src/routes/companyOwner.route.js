const express = require('express');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/register', validate(userValidation.createUser), userController.createCompanyOwner);

module.exports = router;
