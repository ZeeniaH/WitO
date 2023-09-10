const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    role: Joi.string().required().valid('Admin', 'CompanyOwner', 'BookKeeper', 'Worker'),
    avatar: Joi.any(),
    description: Joi.string(),
    isSubscribed: Joi.boolean(),
    subscriptionId: Joi.string().allow(''),
    planType: Joi.string().allow(''),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    phoneNumber: Joi.number(),
    avatar: Joi.any(),
    description: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      phoneNumber: Joi.number(),
      avatar: Joi.any(),
      accountStatus: Joi.string(),
      description: Joi.string(),
      isSubscribed: Joi.boolean(),
      subscriptionId: Joi.string().allow(''),
      planType: Joi.string().allow(''),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
