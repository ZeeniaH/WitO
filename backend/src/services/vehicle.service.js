const httpStatus = require('http-status');
const { Vehicle, Company, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all company Name from DB
 */
const getVehiclesName = async () => {
  // return await Vehicle.find({}, 'makeName model');
  return Vehicle.find({}, 'makeName');
};

/**
 * Create a vehicle
 */
const createVehicle = async (vehicleBody, companyId, userId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (await Vehicle.isLicensePlateTaken(vehicleBody.licensePlate)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'License Plate already taken');
  }

  // Get the user's planType from the userId
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check the planType and limit the number of vehicles user can create
  if (user.planType === 'basic') {
    const userVehicleCount = await Vehicle.countDocuments({ creatorId: userId });
    if (userVehicleCount >= 10) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'On Basic plan, you can create only 10 vehicles. Upgrade your plan!');
    }
  } else if (user.planType === 'standard') {
    const userVehicleCount = await Vehicle.countDocuments({ creatorId: userId });
    if (userVehicleCount >= 30) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'On Standard plan, you can create up to 30 vehicles. Upgrade your plan!');
    }
  } else if (user.planType === 'premium') {
    // Premium users can create unlimited vehicles, no validation needed
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid planType');
  }

  const vehicle = await Vehicle.create({
    ...vehicleBody,
    companyId,
    creatorId: userId,
    updatedBy: userId,
  });

  return vehicle;
};

/**
 * Query for vehicles
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryVehicles = async (filter) => {
  const vehicles = await Vehicle.filter(filter);
  return vehicles;
};

/**
 * Get vehicle by id
 */
const getVehicleById = async (id) => {
  return Vehicle.findById(id);
};

/**
 * Get vehicles by CompanyId
 */
const getVehiclesByCompanyId = async (companyId, filter) => {
  const company = await Company.findById(companyId).populate('vehicles');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (Object.entries(filter).length !== 0) {
    const filteredVehicles = company.vehicles.filter((vehicle) => vehicle.model.match(filter.model));
    return filteredVehicles;
  }
  return company.vehicles;
};

/**
 * Update vehicle by id
 */
const updateVehicleById = async (companyId, vehicleId, updateBody) => {
  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }
    if (!company.vehicles.includes(vehicleId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vehicle does not belong to the specified company');
    }
  }
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }
  if (updateBody.licensePlate && (await Vehicle.isLicensePlateTaken(updateBody.licensePlate, vehicleId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'License Plate already taken');
  }
  Object.assign(vehicle, updateBody);
  await vehicle.save();
  return vehicle;
};

/**
 * Delete vehicle by id
 */
const deleteVehicleById = async (vehicleId, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const vehicle = await getVehicleById(vehicleId);
  if (!vehicle) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vehicle not found');
  }
  if (vehicle.companyId.toString() !== companyId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this vehicle');
  }
  await company.removeVehicle(vehicleId);
  await vehicle.remove();
  return vehicle;
};

module.exports = {
  createVehicle,
  queryVehicles,
  getVehicleById,
  updateVehicleById,
  deleteVehicleById,
  getVehiclesName,
  getVehiclesByCompanyId,
};
