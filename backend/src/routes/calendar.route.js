const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const calendarValidation = require('../validations/calendar.validation');
const calendarController = require('../controllers/calendar.controller');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.post(
  '/:companyId/appointment',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
  validate(calendarValidation.createCalendarAppointment),
  calendarController.createSchedulerAppointment
);
router.get(
  '/',
  auth(appRoles.Admin),
  validate(calendarValidation.getCalendarAppointments),
  calendarController.getCalendarAppointments
);
router.get(
  '/appointments/:companyId',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper),
  calendarController.getCalendarAppointmentsByCompanyId
);
router.get('/:companyId/worker/:workerId', auth(), calendarController.getCalendarAppointmentsByWorkerId);
router.get(
  '/:appointmentId',
  auth(),
  validate(calendarValidation.getCalendarAppointment),
  calendarController.getCalendarAppointmentById
);
router.patch(
  '/:companyId/appointments/:appointmentId',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(calendarValidation.updateCalendarAppointment),
  calendarController.updateCalendarAppointment
);
router.delete(
  '/:companyId/appointments/:appointmentId',
  auth(appRoles.CompanyOwner, appRoles.BookKeeper),
  validate(calendarValidation.deleteCalendarAppointment),
  calendarController.deleteCalendarAppointment
);

module.exports = router;
