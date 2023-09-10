const httpStatus = require('http-status');
const { Appointment, Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get appointments by company id
 */
const getAppointmentsByCompanyId = async (companyId, filter) => {
  const company = await Company.findById(companyId).populate('appointments');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (Object.entries(filter).length !== 0) {
    const filteredVAppointments = company.appointments.filter((appointment) =>
      appointment.appointmentStatus.match(filter.appointmentStatus)
    );
    return filteredVAppointments;
  }
  return company.appointments;
};

/**
 * Create an appointment
 * @param {Object} reqBody
 * @returns {Promise<Appointment>}
 */
const createAppointment = async (reqBody, companyId, userId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  // return Appointment.create(reqBody);
  const appointment = await Appointment.create({
    ...reqBody,
    companyId,
    creatorId: userId,
    updatedBy: userId,
  });
  return appointment;
};

/**
 * Query for appointments
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryAppointments = async (filter) => {
  const appointments = await Appointment.filter(filter);
  return appointments;
};

/**
 * Get appointment by id
 * @param {ObjectId} id
 * @returns {Promise<Appointment>}
 */
const getAppointmentById = async (id) => {
  return Appointment.findById(id)
    .populate('companyId', ' contactNo email street zip city')
    .populate('vehicleId', 'makeName model mileage licensePlate')
    .populate('workerId', 'name taxId bankAccountNumber personalNumber nameOfBank phoneNumber email');
};

/**
 * Update appointment by id
 * @param {ObjectId} appointmentId
 * @param {Object} updateBody
 * @returns {Promise<Appointment>}
 */
const updateAppointmentById = async (appointmentId, companyId, updateBody) => {
  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }
    if (!company.appointments.includes(appointmentId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Appointment does not belong to the specified company');
    }
  }
  const appointment = await Appointment.findById(appointmentId);
  if (!appointmentId) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Appointment found');
  }
  Object.assign(appointment, updateBody);
  await appointment.save();
  return appointment;
};

/**
 * Delete appointment by id
 * @param {ObjectId} appointmentId
 * @returns {Promise<Appointment>}
 */
const deleteAppointmentById = async (appointmentId, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Appointment not found');
  }
  // if (appointment.companyId !== companyId) {
  //   throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this appointment');
  // }
  await company.removeAppointment(appointmentId);
  await appointment.remove();
  return appointment;
};

module.exports = {
  createAppointment,
  queryAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
  getAppointmentsByCompanyId,
};
