const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCompany = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    companyLogo: Joi.any(),
    companyName: Joi.string().required(),
    contactNo: Joi.number().required(),
    street: Joi.string(),
    zip: Joi.number(),
    city: Joi.string(),
    managingDirector: Joi.string(),
    companyRegistrationNumber: Joi.string(),
    taxNumber: Joi.string(),
    vatID: Joi.string(),
    partnershipAgreementDated: Joi.date(),
    nameOfBank: Joi.string(),
    iban: Joi.string(),
    bic: Joi.string(),
  }),
};

const getCompanies = {
  query: Joi.object().keys({
    email: Joi.string(),
    companyName: Joi.string(),
    companyLogo: Joi.any(),
    contactNo: Joi.number(),
    street: Joi.string(),
    zip: Joi.number(),
    city: Joi.string(),
    managingDirector: Joi.string(),
    companyRegistrationNumber: Joi.string(),
    taxNumber: Joi.string(),
    vatID: Joi.string(),
    partnershipAgreementDated: Joi.date(),
    nameOfBank: Joi.string(),
    iban: Joi.string(),
    bic: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getCompany = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
};

const updateCompany = {
  params: Joi.object().keys({
    companyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      companyName: Joi.string(),
      companyLogo: Joi.any(),
      contactNo: Joi.number(),
      street: Joi.string(),
      zip: Joi.number(),
      city: Joi.string(),
      managingDirector: Joi.string(),
      companyRegistrationNumber: Joi.string(),
      taxNumber: Joi.string(),
      vatID: Joi.string(),
      partnershipAgreementDated: Joi.date(),
      nameOfBank: Joi.string(),
      iban: Joi.string(),
      bic: Joi.string(),
    })
    .min(1),
};

const deleteCompany = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
};

const hireRequestSchema = Joi.object({
  bookKeeperId: Joi.string().required(),
  companyId: Joi.string().required(),
  message: Joi.string().required(),
  email: Joi.string().email().required(),
});

const terminateBookKeeper = {
  params: Joi.object().keys({
    bookKeeperId: Joi.string().custom(objectId),
    companyId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCompany,
  getCompany,
  getCompanies,
  updateCompany,
  deleteCompany,
  hireRequestSchema,
  terminateBookKeeper,
};
