const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const workerValidation = require('../validations/worker.validation');
const workerController = require('../controllers/worker.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.get('/worker-name', auth(), workerController.getWorkersName);
router.get(
  '/workers/:companyId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  workerController.getWorkersByCompanyId
);
router.post(
  '/:companyId/workers',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(workerValidation.createWorker),
  workerController.createWorker
);
router.get(
  '/',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(workerValidation.getWorkers),
  workerController.getWorkers
);
router.get(
  '/:workerId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(workerValidation.getWorker),
  workerController.getWorker
);
router.patch(
  '/:companyId/workers/:workerId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(workerValidation.updateWorker),
  workerController.updateWorker
);
router.delete(
  '/:companyId/workers/:workerId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(workerValidation.deleteWorker),
  workerController.deleteWorker
);

module.exports = router;
