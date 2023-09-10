const Joi = require('joi');

const createClient = {
  body: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phoneNumber: Joi.number(),
    address: Joi.string(),
  }),
};

const getClients = {
  query: Joi.object().keys({
    name: Joi.string(),
    email: Joi.string(),
    phoneNumber: Joi.number(),
    address: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createClient,
  getClients,
};
