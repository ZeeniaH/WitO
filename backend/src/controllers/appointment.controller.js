/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { appointmentService, companyService } = require('../services');

const getAppointmentsByCompanyId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['selectWorker']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { companyId } = req.params;
  const result = await appointmentService.getAppointmentsByCompanyId(companyId, filter, options);
  res.send(result);
});

const createAppointment = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user._id;
  const appointment = await appointmentService.createAppointment(req.body, companyId, userId);
  await companyService.addAppointmentToCompany(companyId, appointment._id);
  res.status(httpStatus.CREATED).send(appointment);
});

const getAppointments = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['selectWorker']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await appointmentService.queryAppointments(filter, options);
  res.send(result);
});

const getAppointment = catchAsync(async (req, res) => {
  const appointment = await appointmentService.getAppointmentById(req.params.appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Appointment found');
  }
  res.send(appointment);
});

const updateAppointment = catchAsync(async (req, res) => {
  const { companyId, appointmentId } = req.params;
  const userId = req.user._id;
  const appointment = await appointmentService.updateAppointmentById(appointmentId, companyId, req.body, userId);
  res.send(appointment);
});

const deleteAppointment = catchAsync(async (req, res) => {
  const { companyId, appointmentId } = req.params;
  await appointmentService.deleteAppointmentById(appointmentId, companyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByCompanyId,
};
