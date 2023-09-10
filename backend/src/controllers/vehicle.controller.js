/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { vehicleService, companyService } = require('../services');

const createVehicle = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user._id;
  const vehicle = await vehicleService.createVehicle(req.body, companyId, userId);
  await companyService.addVehicleToCompany(companyId, vehicle._id);
  res.status(httpStatus.CREATED).send(vehicle);
});

const getVehiclesName = async (req, res) => {
  const result = await vehicleService.getVehiclesName();
  res.json(result);
};

const getVehicles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['licensePlate']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await vehicleService.queryVehicles(filter, options);
  res.send(result);
});

const getVehiclesByCompanyId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['licensePlate']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { companyId } = req.params;
  const result = await vehicleService.getVehiclesByCompanyId(companyId, filter, options);
  res.send(result);
});

const getVehicle = catchAsync(async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.vehicleId);
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }
  res.send(vehicle);
});

const updateVehicle = catchAsync(async (req, res) => {
  const { companyId, vehicleId } = req.params;
  const userId = req.user._id;
  const vehicle = await vehicleService.updateVehicleById(companyId, vehicleId, req.body, userId);
  res.send(vehicle);
});

const deleteVehicle = catchAsync(async (req, res) => {
  const { companyId, vehicleId } = req.params;
  await vehicleService.deleteVehicleById(vehicleId, companyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createVehicle,
  getVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
  getVehiclesName,
  getVehiclesByCompanyId,
};
