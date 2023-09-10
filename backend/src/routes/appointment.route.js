const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const appointmentValidation = require('../validations/appointment.validation');
const appointmentController = require('../controllers/appointment.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.post(
  '/:companyId/appointment',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  validate(appointmentValidation.createAppointment),
  appointmentController.createAppointment
);
router.get('/', auth(), validate(appointmentValidation.getAppointments), appointmentController.getAppointments);
router.get('/appointments/:companyId', auth(), appointmentController.getAppointmentsByCompanyId);
router.get('/:appointmentId', auth(), validate(appointmentValidation.getAppointment), appointmentController.getAppointment);
router.patch(
  '/:companyId/appointments/:appointmentId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  validate(appointmentValidation.updateAppointment),
  appointmentController.updateAppointment
);
router.delete(
  '/:companyId/appointments/:appointmentId',
  auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  validate(appointmentValidation.deleteAppointment),
  appointmentController.deleteAppointment
);

module.exports = router;
