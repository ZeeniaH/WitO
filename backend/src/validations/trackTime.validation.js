const Joi = require('joi');
const { objectId } = require('./custom.validation');

const addTrackTime = {
  params: Joi.object().keys({
    workerId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    startTime: Joi.date().required(),
    licensePlate: Joi.string().required(),
    timeTracked: Joi.date(),
    endTime: Joi.date().required(),
    editTime: Joi.string(),
    count: Joi.boolean(),
  }),
};

const getTrackTimes = {
  query: Joi.object().keys({
    workerId: Joi.string(),
    licensePlate: Joi.string().required(),
    startTime: Joi.string().required(),
    timeTracked: Joi.string().required(),
    endTime: Joi.string().required(),
    editTime: Joi.string(),
    count: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTrackTime = {
  params: Joi.object().keys({
    workerId: Joi.string().custom(objectId),
  }),
};

const updateTrackTime = {
  params: Joi.object().keys({
    workerId: Joi.required().custom(objectId),
    trackTimeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      timeTracked: Joi.string().required(),
    })
    .min(1),
};

const deleteTrackTime = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    workerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  addTrackTime,
  getTrackTime,
  getTrackTimes,
  updateTrackTime,
  deleteTrackTime,
};
