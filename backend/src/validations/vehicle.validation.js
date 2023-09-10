const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createVehicle = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    selectCompany: Joi.string(),
    companyLogo: Joi.string(),
    carImage: Joi.any(),
    carDamageImages: Joi.any(),
    makeName: Joi.string().required(),
    model: Joi.string().required(),
    licensePlate: Joi.string().required(),
    mileage: Joi.number().required(),
    registeredCity: Joi.string(),
    color: Joi.optional(),
    insurance: Joi.string(),
    lastMaintenanceMileage: Joi.optional(),
    carDamage: Joi.boolean(),
    vehicleIdentificationNumber: Joi.string(),
    firstRegistrationDate: Joi.date(),
    policyNumber: Joi.string(),
    fuel: Joi.string(),
    damageDocumentation: Joi.any(),
    repairPictures: Joi.any(),
  }),
};

const getVehicles = {
  query: Joi.object().keys({
    selectCompany: Joi.string(),
    companyLogo: Joi.string(),
    carImage: Joi.any(),
    carDamageImages: Joi.any(),
    makeName: Joi.string(),
    model: Joi.string(),
    licensePlate: Joi.string(),
    mileage: Joi.number(),
    registeredCity: Joi.string(),
    color: Joi.optional(),
    insurance: Joi.string(),
    lastMaintenanceMileage: Joi.optional(),
    carDamage: Joi.boolean(),
    vehicleIdentificationNumber: Joi.string(),
    firstRegistrationDate: Joi.date(),
    policyNumber: Joi.string(),
    fuel: Joi.string(),
    damageDocumentation: Joi.any(),
    repairPictures: Joi.any(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getVehicle = {
  params: Joi.object().keys({
    vehicleId: Joi.string().custom(objectId),
  }),
};

const updateVehicle = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    vehicleId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object()
    .keys({
      selectCompany: Joi.string(),
      companyLogo: Joi.string(),
      carImage: Joi.any(),
      carDamageImages: Joi.any(),
      makeName: Joi.string(),
      model: Joi.string(),
      licensePlate: Joi.string(),
      mileage: Joi.number(),
      registeredCity: Joi.string(),
      color: Joi.optional(),
      insurance: Joi.string(),
      lastMaintenanceMileage: Joi.optional(),
      carDamage: Joi.boolean(),
      vehicleIdentificationNumber: Joi.string(),
      firstRegistrationDate: Joi.date(),
      policyNumber: Joi.string(),
      fuel: Joi.string(),
      damageDocumentation: Joi.any(),
      repairPictures: Joi.any(),
    })
    .min(1),
};

const deleteVehicle = {
  params: Joi.object().keys({
    companyId: Joi.string().custom(objectId),
    vehicleId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};
