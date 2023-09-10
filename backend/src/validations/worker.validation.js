const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createWorker = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password),
    phoneNumber: Joi.number().required(),
    role: Joi.string().required().valid('Worker'),
    description: Joi.string(),
    selectCompany: Joi.string(),
    companyLogo: Joi.string(),
    personalNumber: Joi.number(),
    dob: Joi.string(),
    placeOfBirth: Joi.string(),
    nationalities: Joi.array(),
    taxId: Joi.string(),
    taxClass: Joi.string(),
    socialSecurityNumber: Joi.string(),
    healthInsurance: Joi.string(),
    children: Joi.number(),
    iban: Joi.string(),
    bic: Joi.string(),
    nameOfBank: Joi.string(),
    accountStatus: Joi.string(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    birthName: Joi.string().required(),
    personalDataUpload: Joi.any(),
    staffPicture: Joi.any(),
    street: Joi.string().required(),
    zip: Joi.number().required(),
    city: Joi.string().required(),
  }),
};

const getWorkers = {
  query: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().custom(password),
    phoneNumber: Joi.number(),
    role: Joi.string().valid('Worker'),
    description: Joi.string(),
    selectCompany: Joi.string(),
    companyLogo: Joi.string(),
    personalNumber: Joi.number(),
    dob: Joi.string(),
    placeOfBirth: Joi.string(),
    nationalities: Joi.array(),
    taxId: Joi.string(),
    taxClass: Joi.string(),
    socialSecurityNumber: Joi.string(),
    healthInsurance: Joi.string(),
    children: Joi.number(),
    iban: Joi.string(),
    bic: Joi.string(),
    nameOfBank: Joi.string(),
    accountStatus: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    birthName: Joi.string(),
    personalDataUpload: Joi.any(),
    staffPicture: Joi.any(),
    street: Joi.string().required(),
    zip: Joi.number().required(),
    city: Joi.string().required(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getWorker = {
  params: Joi.object().keys({
    workerId: Joi.string().custom(objectId),
  }),
};

const updateWorker = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    workerId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      phoneNumber: Joi.number(),
      role: Joi.string().valid('Worker'),
      description: Joi.string(),
      selectCompany: Joi.string(),
      companyLogo: Joi.string(),
      personalNumber: Joi.number(),
      dob: Joi.string(),
      placeOfBirth: Joi.string(),
      nationalities: Joi.array(),
      taxId: Joi.string(),
      taxClass: Joi.string(),
      socialSecurityNumber: Joi.string(),
      healthInsurance: Joi.string(),
      children: Joi.number(),
      iban: Joi.string(),
      bic: Joi.string(),
      nameOfBank: Joi.string(),
      accountStatus: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      birthName: Joi.string(),
      personalDataUpload: Joi.any(),
      staffPicture: Joi.any(),
      street: Joi.string().required(),
      zip: Joi.number().required(),
      city: Joi.string().required(),
    })
    .min(1),
};

const deleteWorker = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    workerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createWorker,
  getWorker,
  getWorkers,
  updateWorker,
  deleteWorker,
};
