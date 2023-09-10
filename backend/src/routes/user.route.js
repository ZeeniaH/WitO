const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.get('/', auth(appRoles.Admin, appRoles.CompanyOwner), validate(userValidation.getUsers), userController.getUsers);
router.post(
  '/',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(userValidation.createUser),
  userController.createUser
);

router.get(
  '/:userId',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(userValidation.getUser),
  userController.getUser
);
router.patch('/:userId', auth(), validate(userValidation.updateUser), userController.updateUser);
router.delete(
  '/:userId',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(userValidation.deleteUser),
  userController.deleteUser
);

module.exports = router;
