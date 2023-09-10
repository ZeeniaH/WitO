const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { emailService } = require('.');
const { Company, User, BookKeeper, Worker, Appointment, Vehicle, Calendar } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get OfferRequests of CompanyOwner
 */
// const getOfferRequests = async (ownerId) => {
//   const company = await Company.findOne({ owners: ownerId }).select('offerRequests');
//   return (company && company.offerRequests) || [];
// };
const getOfferRequests = async (companyId, ownerId, options) => {
  const company = await Company.findOne({ _id: companyId, owners: ownerId }).select('offerRequests');
  if (!company) {
    return {
      totalPages: 0,
      totalResults: 0,
      results: [],
    };
  }
  const offerRequests = company.offerRequests || [];
  const page = options.page ? parseInt(options.page, 10) : 1;
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.totalResults = offerRequests.length;
  results.totalPages = Math.ceil(offerRequests.length / limit);
  if (startIndex > 0) {
    results.previous = { page: page - 1, limit };
  }
  if (endIndex < offerRequests.length) {
    results.next = { page: page + 1, limit };
  }
  results.page = page;
  results.limit = limit;
  results.results = offerRequests.slice(startIndex, endIndex);
  return results;
};

/**
 * get list of all hired BookKeepers
 */
const getallHiredBookKeepers = async (ownerId, companyId, options) => {
  const companies = await Company.find({ _id: companyId, owners: ownerId }).select('bookKeepers');
  const bookKeeperIds = companies.flatMap((company) => company.bookKeepers);
  const bookKeepers = await BookKeeper.find({ _id: { $in: bookKeeperIds } });
  const page = options.page ? parseInt(options.page, 10) : 1;
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalResults = bookKeepers.length;
  const totalPages = Math.ceil(totalResults / limit);
  const results = {};
  results.totalResults = totalResults;
  results.totalPages = totalPages;
  if (startIndex > 0) {
    results.previous = { page: page - 1, limit };
  }
  if (endIndex < totalResults) {
    results.next = { page: page + 1, limit };
  }
  results.page = page;
  results.limit = limit;
  results.results = bookKeepers.slice(startIndex, endIndex);
  return results;
};

/**
 * add new Worker to company
 */
const addWorkerToCompany = async (companyId, worker) => {
  const company = await Company.findById(companyId).populate('workers');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  company.workers.push(worker);
  await company.save();
  return company;
};

/**
 * add new Vehicle to company
 */
const addVehicleToCompany = async (companyId, vehicle) => {
  const company = await Company.findById(companyId).populate('vehicles');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  company.vehicles.push(vehicle);
  await company.save();
  return company;
};

/**
 * add new Appointment to company
 */
const addAppointmentToCompany = async (companyId, appointment) => {
  const company = await Company.findById(companyId).populate('appointments');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  company.appointments.push(appointment);
  await company.save();
  return company;
};

/**
 * add new Calendar Appointment to company
 */
const addCalendarAppointmentToCompany = async (companyId, appointment) => {
  const company = await Company.findById(companyId).populate('calendarAppointments');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  company.calendarAppointments.push(appointment);
  await company.save();
  return company;
};

/**
 * Get all company Name from DB
 */
const getCompaniesName = async () => {
  // return await Company.find({}, 'companyName companyLogo permits');
  return Company.find({}, 'companyName');
};

/**
 * Create a company
 */
const createCompany = async (companyBody, userId) => {
  if (await Company.isEmailTaken(companyBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken by other company');
  }
  if (await User.isEmailTaken(companyBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken by User');
  }
  if (await Company.isCompanyNameTaken(companyBody.companyName)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company Name already taken');
  }

  // Get the user's planType from the userId
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check the planType and limit the number of companies user can create
  if (user.planType === 'basic') {
    const userCompanyCount = await Company.countDocuments({ owners: userId });
    if (userCompanyCount >= 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'on Basic plan you can create only 1 company. Upgrade your plan!');
    }
  } else if (user.planType === 'standard') {
    const userCompanyCount = await Company.countDocuments({ owners: userId });
    if (userCompanyCount >= 3) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'on Standard plan you can create up to 3 companies. Upgrade your plan!');
    }
  } else if (user.planType === 'premium') {
    // Premium users can create as many companies as they want, no validation needed
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid planType');
  }

  const company = await Company.create({
    ...companyBody,
    owners: userId,
  });
  return company;
};

/**
 * Query for companies
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryCompanies = async (filter, options) => {
  const companies = await Company.paginate(filter, {
    ...options,
    populate: 'vehicles workers appointments',
  });
  return companies;
};

/**
 * Query for companies owner
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const getMineCompanies = async (userId, filter, options, role) => {
  let companies;
  if (role === 'CompanyOwner') {
    const updatedFilter = { ...filter, owners: userId };
    companies = await queryCompanies(updatedFilter, options);
  } else if (role === 'BookKeeper') {
    const bookKeeper = await BookKeeper.findOne({ _id: userId }).select('companyId').populate('companyId');
    if (!bookKeeper || !bookKeeper.companyId || bookKeeper.companyId.length === 0) {
      // companies = [];
      return {
        totalPages: 0,
        totalResults: 0,
        results: [],
      };
    }
    const updatedFilter = { ...filter, _id: { $in: bookKeeper.companyId } };
    companies = await queryCompanies(updatedFilter, options);
  }
  return companies;
};

/**
 * Get companies by id
 */
const getCompanyById = async (id) => {
  return Company.findById(id);
};

/**
 * get company by OwnerId
 */
const getCompaniesByOwnerId = async (ownerId) => {
  if (!ownerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Owner ID is required');
  }
  return Company.find({ owners: ownerId });
};

/**
 * Update company by id
 */
const updateCompanyById = async (companyId, updateBody, currentUser) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  // Check if the current user is an Admin or a CompanyOwner from the list of owners
  const isCompanyOwner = company.owners.some((owner) => owner.toString() === currentUser.id);
  if (currentUser.role !== 'Admin' && !isCompanyOwner) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only Admin or CompanyOwner can modify company');
  }
  if (updateBody.email && (await Company.isEmailTaken(updateBody.email, companyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, companyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken by user');
  }
  if (updateBody.companyName && (await Company.isCompanyNameTaken(updateBody.companyName, companyId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Company Name already taken');
  }
  Object.assign(company, updateBody);
  await company.save();
  return company;
};

/**
 * Delete company by id
 */
const deleteCompanyById = async (companyId, currentUser) => {
  const company = await getCompanyById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const isCompanyOwner = company.owners.some((owner) => owner.toString() === currentUser.id);
  if (currentUser.role !== 'Admin' && !isCompanyOwner) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only Admin or CompanyOwner can Delete this company');
  }
  await Worker.deleteMany({ _id: { $in: company.workers } });
  await Appointment.deleteMany({ _id: { $in: company.appointments } });
  await Vehicle.deleteMany({ _id: { $in: company.vehicles } });
  await Calendar.deleteMany({ _id: { $in: company.calendarAppointments } });
  await company.remove();
  return company;
};

/**
 * Send hiring Request to bookKeeper
 */
const requestHireBookKeeper = async (bookKeeperId, companyId, message, userId) => {
  const company = await Company.findOne({ _id: companyId, owners: userId });
  if (!company) {
    throw new ApiError(404, 'Company not found');
  }
  if (await Company.hasBookKeeper(companyId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This company already has a bookkeeper');
  }
  const bookKeeper = await BookKeeper.findById(bookKeeperId);
  if (!bookKeeper) {
    throw new ApiError(404, 'BookKeeper not found');
  }
  if (bookKeeper.accountStatus !== 'approved') {
    throw new ApiError(403, 'BookKeeper account status is not approved yet.');
  }
  const existingHireRequest = bookKeeper.hireRequests.find((request) => request.email === company.email);
  if (existingHireRequest) {
    throw new ApiError(400, 'A hire request with this company email already exists');
  }
  const requestId = new mongoose.Types.ObjectId();
  const hireRequest = {
    requestId,
    companyName: company.companyName,
    companyId: company._id,
    email: company.email,
    message,
    status: 'pending',
  };
  bookKeeper.hireRequests.push(hireRequest);
  await bookKeeper.save();
  const companyOfferRequest = {
    requestId,
    bookKeeperName: bookKeeper.name,
    bookKeeperId: bookKeeper._id,
    bookKeeperEmail: bookKeeper.email,
    requestMessage: message,
    requestStatus: 'pending',
  };
  company.offerRequests.push(companyOfferRequest);
  await company.save();
  await emailService.sendHireRequestEmail(bookKeeper.email, company.companyName, company.email);
};

/**
 * withDraw offer Request
 */
const withdrawOfferRequest = async (companyId, ownerId, requestId) => {
  const company = await Company.findOne({ _id: companyId, owners: ownerId }).select('offerRequests');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const offerRequestIndex = company.offerRequests.findIndex((request) => {
    const requestObjectId = mongoose.Types.ObjectId(request.requestId);
    const targetObjectId = mongoose.Types.ObjectId(requestId);
    return requestObjectId.equals(targetObjectId);
  });
  if (offerRequestIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Offer request not found');
  }
  const { bookKeeperId } = company.offerRequests[offerRequestIndex];
  company.offerRequests.splice(offerRequestIndex, 1);
  await company.save();
  const bookKeeper = await BookKeeper.findOne({
    _id: bookKeeperId,
    hireRequests: { $elemMatch: { requestId: mongoose.Types.ObjectId(requestId) } },
  });
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hire request not found');
  }
  const hireRequestIndex = bookKeeper.hireRequests.findIndex((request) => {
    const requestObjectId = mongoose.Types.ObjectId(request.requestId);
    const targetObjectId = mongoose.Types.ObjectId(requestId);
    return requestObjectId.equals(targetObjectId);
  });
  if (hireRequestIndex !== -1) {
    bookKeeper.hireRequests.splice(hireRequestIndex, 1);
    await bookKeeper.save();
  }
};

/**
 * Terminate a bookKeeper from a company
 * @param {string} ownerId - The ID of the company owner
 * @param {string} bookKeeperId - The ID of the bookKeeper
 * @returns {Promise<void>}
 */
const terminateBookKeeper = async (companyId, bookKeeperId) => {
  // Find the company by id and check if it exists
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  // Check if the bookKeeper exists in the company's bookKeepers array
  const bookKeeperIndex = company.bookKeepers.findIndex((bk) => bk.toString() === bookKeeperId);
  if (bookKeeperIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found in company');
  }
  // Remove the bookKeeper from the company's bookKeepers array
  company.bookKeepers.splice(bookKeeperIndex, 1);
  await company.save();
  // Find the bookKeeper and remove the company from their companyId array
  const bookKeeper = await BookKeeper.findById(bookKeeperId);
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found');
  }
  // Check if the company exists in the bookKeeper's companyId array
  const companyIdIndex = bookKeeper.companyId.findIndex((id) => id.toString() === company._id.toString());
  if (companyIdIndex === -1) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found in BookKeeper');
  }
  // Remove the company from the bookKeeper's companyId array
  bookKeeper.companyId.splice(companyIdIndex, 1);
  await bookKeeper.save();
  await emailService.sendTerminationEmail(bookKeeper.email, company.companyName, company.email);
};

module.exports = {
  getOfferRequests,
  getallHiredBookKeepers,
  createCompany,
  queryCompanies,
  getMineCompanies,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
  getCompaniesName,
  addVehicleToCompany,
  addWorkerToCompany,
  getCompaniesByOwnerId,
  addAppointmentToCompany,
  addCalendarAppointmentToCompany,
  requestHireBookKeeper,
  withdrawOfferRequest,
  terminateBookKeeper,
};
