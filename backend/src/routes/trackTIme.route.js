const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const trackTimeValidation = require('../validations/trackTime.validation');
const trackTimeController = require('../controllers/trackTime.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.post(
  '/:workerId/time',
  // auth(appRoles.Worker),
  validate(trackTimeValidation.addTrackTime),
  trackTimeController.addTrackTime
);
router.get(
  '/:trackTimeId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  trackTimeController.getAllWorkersWithTrackTimes
);
router.get(
  '/:workerId/range/:companyId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  trackTimeController.getTrackedTimeByDateRange
);
router.get('/:workerId/company/:companyId', auth(), trackTimeController.getTrackTimeByWorkerId);
router.patch(
  '/:workerId/trackTimes/:trackTimeId',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper),
  trackTimeController.updateTrackTimeByWorkerId
);
router.delete(
  '/:workerId/trackTimes/:trackTimeId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper),
  trackTimeController.deleteTrackTimeByWorkerId
);

module.exports = router;
