const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const userController = require('../controllers/user.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.get('/request', auth(appRoles.BookKeeper), userController.getHireRequests);
router.get('/company/:companyId', auth(), userController.getBookKeeperByCompanyId);
router.get('/', auth(), userController.getBookKeepers);
router.get('/approved', auth(), userController.getApprovedBookKeepers);
router.get('/:bookKeeperId', auth(), userController.getCompaniesByBookkeeper);
router.post('/register', validate(userValidation.createUser), userController.createBookKeeper);

router.post('/remove/:bookKeeperId', auth(), userController.removeBookKeeperFromCompany);
router.patch('/:bookKeeperId/accountStatus', auth(), userController.updateBookKeeperStatusById);
router.patch(
  '/:bookKeeperId/confirm-hire-requests/:hireRequestId',
  auth(appRoles.BookKeeper),
  userController.confirmHireRequest
);
router.patch('/reject-hire-requests/:hireRequestId', auth(appRoles.BookKeeper), userController.rejectHireRequest);

module.exports = router;
