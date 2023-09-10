const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    selectCompany: Joi.string(),
    vehicleId: Joi.string().required(),
    selectCar: Joi.string().required(),
    workerId: Joi.string().required(),
    selectWorker: Joi.string().required(),
    appointmentStatus: Joi.string().required(),
    appointmentDescription: Joi.string(),
  }),
};

const getAppointments = {
  query: Joi.object().keys({
    selectCompany: Joi.string(),
    vehicleId: Joi.string(),
    selectCar: Joi.string(),
    workerId: Joi.string(),
    selectWorker: Joi.string(),
    appointmentStatus: Joi.string(),
    appointmentDescription: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAppointment = {
  params: Joi.object().keys({
    appointmentId: Joi.string().custom(objectId),
  }),
};

const updateAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    appointmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      selectCompany: Joi.string(),
      vehicleId: Joi.string().required(),
      selectCar: Joi.string().required(),
      workerId: Joi.string().required(),
      selectWorker: Joi.string().required(),
      appointmentStatus: Joi.string(),
      appointmentDescription: Joi.string(),
    })
    .min(1),
};

const deleteAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    appointmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
