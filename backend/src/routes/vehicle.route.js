const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const vehicleValidation = require('../validations/vehicle.validation');
const vehicleController = require('../controllers/vehicle.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.get('/vehicles-name', auth(), vehicleController.getVehiclesName);
router.get('/vehicles/:companyId', auth(), vehicleController.getVehiclesByCompanyId);
router.post(
  '/:companyId/vehicles',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(vehicleValidation.createVehicle),
  vehicleController.createVehicle
);
router.get('/', auth(), validate(vehicleValidation.getVehicles), vehicleController.getVehicles);
router.get('/:vehicleId', auth(), validate(vehicleValidation.getVehicle), vehicleController.getVehicle);
router.patch(
  '/:companyId/vehicles/:vehicleId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(vehicleValidation.updateVehicle),
  vehicleController.updateVehicle
);
router.delete(
  '/:companyId/vehicles/:vehicleId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(vehicleValidation.deleteVehicle),
  vehicleController.deleteVehicle
);

module.exports = router;
