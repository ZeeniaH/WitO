const httpStatus = require('http-status');
const { Calendar, Company, Worker } = require('../models');
const ApiError = require('../utils/ApiError');
const { getWorkerById } = require('./worker.service');

/**
 * Create an Calendar appointment
 * @param {Object} reqBody
 * @returns {Promise<CalendarAppointment>}
 */
const createCalendarAppointment = async (reqBody, companyId, userId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const { workerId } = reqBody;
  if (workerId) {
    const worker = await Worker.findById(workerId);
    if (!worker) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
    }
    if (worker.accountStatus !== 'approved') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Worker Account is not approved yet.');
    }
  }
  const appointment = await Calendar.create({
    ...reqBody,
    companyId,
    creatorId: userId,
    updatedBy: userId,
  });
  return appointment;
};

/**
 * Get Calendar appointments by company id
 */
const getCalendarAppointmentsByCompanyId = async (companyId, filter) => {
  const company = await Company.findById(companyId).populate('calendarAppointments');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (Object.entries(filter).length !== 0) {
    const filteredVAppointments = company.calendarAppointments.filter((appointment) =>
      appointment.appointmentStatus.match(filter.appointmentStatus)
    );
    return filteredVAppointments;
  }
  return company.calendarAppointments;
};

/**
 * Get Calendar appointments by worker id
 */
const getCalendarAppointmentsByWorkerId = async (companyId, workerId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(404, 'Worker not found');
  }
  const appointments = await Calendar.find({ _id: { $in: worker.calenderAppointments } });
  return appointments;
};

/**
 * Query for Calendar appointments
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryCalendarAppointments = async (filter) => {
  const appointments = await Calendar.filter(filter);
  return appointments;
};

/**
 * Get Calendar Appointment by id
 * @param {ObjectId} id
 * @returns {Promise<Appointment>}
 */
const getCalendarAppointmentById = async (id) => {
  return Calendar.findById(id);
};

/**
 * Update Calendar appointment by id
 * @param {ObjectId} appointmentId
 * @param {Object} updateBody
 * @returns {Promise<Appointment>}
 */
const updateCalendarAppointmentById = async (appointmentId, companyId, updateBody) => {
  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }
    if (!company.calendarAppointments.includes(appointmentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Appointment does not belong to the specified company');
    }
  }
  const appointment = await getCalendarAppointmentById(appointmentId);
  if (!appointmentId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Appointment found');
  }
  Object.assign(appointment, updateBody);
  await appointment.save();
  return appointment;
};

/**
 * Delete Calendar appointment by id
 * @param {ObjectId} appointmentId
 * @returns {Promise<Appointment>}
 */
const deleteCalendarAppointmentById = async (appointmentId, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const appointment = await getCalendarAppointmentById(appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  if (appointment.companyId.toString() !== companyId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this appointment');
  }
  // const { workerId } = appointment;
  // const worker = await getWorkerById(workerId);
  // if (!worker) {
  //   throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  // }
  await company.removeCalendarAppointment(appointmentId);
  // await worker.removeCalendarAppointment(appointmentId);
  await appointment.remove();
  return appointment;
};

module.exports = {
  createCalendarAppointment,
  queryCalendarAppointments,
  getCalendarAppointmentById,
  getCalendarAppointmentsByCompanyId,
  getCalendarAppointmentsByWorkerId,
  updateCalendarAppointmentById,
  deleteCalendarAppointmentById,
};
