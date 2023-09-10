const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCalendarAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    selectCompany: Joi.string(),
    workerId: Joi.string(),
    selectWorker: Joi.string(),
    title: Joi.string().required(),
    priorityId: Joi.number().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    notes: Joi.string(),
    appointmentStatus: Joi.string().required(),
  }),
};

const getCalendarAppointments = {
  query: Joi.object().keys({
    selectCompany: Joi.string(),
    workerId: Joi.string(),
    selectWorker: Joi.string(),
    title: Joi.string(),
    priorityId: Joi.number(),
    startDate: Joi.date(),
    endDate: Joi.date(),
    notes: Joi.string(),
    appointmentStatus: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCalendarAppointment = {
  params: Joi.object().keys({
    appointmentId: Joi.string().custom(objectId),
  }),
};

const updateCalendarAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    appointmentId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      priorityId: Joi.number(),
      startDate: Joi.date(),
      endDate: Joi.date(),
      notes: Joi.string(),
      appointmentStatus: Joi.string(),
    })
    .min(1),
};

const deleteCalendarAppointment = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    appointmentId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCalendarAppointment,
  getCalendarAppointments,
  getCalendarAppointment,
  updateCalendarAppointment,
  deleteCalendarAppointment,
};
