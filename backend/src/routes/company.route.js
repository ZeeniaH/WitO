const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const companyValidation = require('../validations/company.validation');
const companyController = require('../controllers/company.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.post(
  '/hire-bookkeeper',
  auth(appRoles.CompanyOwner),
  validate(companyValidation.hireRequestSchema),
  companyController.requestHireBookKeeper
);
router.get('/offer-request/:companyId', auth(appRoles.CompanyOwner), companyController.getOfferRequests);
router.get('/bookkeeper/:companyId', auth(appRoles.CompanyOwner), companyController.getBookKeepers);
router.get('/companies-name', auth(), companyController.getCompaniesName);
router.post(
  '/add-new-company',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(companyValidation.createCompany),
  companyController.createCompany
);
router.get('/', auth(appRoles.Admin), validate(companyValidation.getCompanies), companyController.getCompanies);
router.get(
  '/mine',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(companyValidation.getCompanies),
  companyController.getMineCompanies
);
router.get(
  '/:companyId',
  auth(appRoles.Admin, appRoles.BookKeeper, appRoles.CompanyOwner),
  validate(companyValidation.getCompany),
  companyController.getCompany
);
router.get('/owner/:ownerId', auth(appRoles.Admin), companyController.getCompanyByOwnerId);
router.patch(
  '/:companyId',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(companyValidation.updateCompany),
  companyController.updateCompany
);
router.delete(
  '/:companyId',
  auth(appRoles.Admin, appRoles.CompanyOwner),
  validate(companyValidation.deleteCompany),
  companyController.deleteCompany
);

router.delete('/request/:companyId/:requestId', auth(appRoles.CompanyOwner), companyController.withdrawOfferRequest);

router.delete('/:companyId/companys/:bookKeeperId', auth(appRoles.CompanyOwner), companyController.terminateBookKeeper);

module.exports = router;
