/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { calendarService, companyService, workerService } = require('../services');

const createSchedulerAppointment = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user._id;
  const { workerId } = req.body;
  const appointment = await calendarService.createCalendarAppointment(req.body, companyId, userId);
  await companyService.addCalendarAppointmentToCompany(companyId, appointment._id);
  if (workerId) {
    await workerService.addCalendarAppointmentToWorker(workerId, appointment._id);
  }
  res.status(httpStatus.CREATED).send(appointment);
});

const getCalendarAppointmentsByCompanyId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['appointmentStatus']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { companyId } = req.params;
  const result = await calendarService.getCalendarAppointmentsByCompanyId(companyId, filter, options);
  res.send(result);
});

const getCalendarAppointmentsByWorkerId = catchAsync(async (req, res) => {
  const { companyId, workerId } = req.params;
  const appointments = await calendarService.getCalendarAppointmentsByWorkerId(companyId, workerId);
  res.send(appointments);
});

const getCalendarAppointments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['appointmentStatus']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await calendarService.queryCalendarAppointments(filter, options);
  res.send(result);
});

const getCalendarAppointmentById = catchAsync(async (req, res) => {
  const appointment = await calendarService.getCalendarAppointmentById(req.params.appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Appointment found');
  }
  res.send(appointment);
});

const updateCalendarAppointment = catchAsync(async (req, res) => {
  const { companyId, appointmentId } = req.params;
  const userId = req.user._id;
  const appointment = await calendarService.updateCalendarAppointmentById(appointmentId, companyId, req.body, userId);
  res.send(appointment);
});

const deleteCalendarAppointment = catchAsync(async (req, res) => {
  const { companyId, appointmentId } = req.params;
  await calendarService.deleteCalendarAppointmentById(appointmentId, companyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createSchedulerAppointment,
  getCalendarAppointments,
  getCalendarAppointmentById,
  updateCalendarAppointment,
  getCalendarAppointmentsByCompanyId,
  getCalendarAppointmentsByWorkerId,
  deleteCalendarAppointment,
};
