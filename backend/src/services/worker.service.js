const httpStatus = require('http-status');
const { emailService } = require('.');
const { Worker, User, Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * add new Calendar Appointment to worker
 */
const addCalendarAppointmentToWorker = async (workerId, appointment) => {
  const worker = await Worker.findById(workerId).populate('calendarAppointments');
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  worker.calenderAppointments.push(appointment);
  await worker.save();
  return worker;
};

/**
 * Get all work Name from DB
 */
const getWorkersName = async () => {
  // return await Worker.find({}, 'firstName lastName');
  return Worker.find({}, 'firstName lastName');
};

/**
 * Create a worker
 * @param {Object} reqBody
 * @returns {Promise<Worker>}
 */
const createWorker = async (reqBody, companyId, userId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (await User.isEmailTaken(reqBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneNumberTaken(reqBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }

  // Get the user's planType from the userId
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check the planType and limit the number of workers user can create
  if (user.planType === 'basic') {
    const userWorkerCount = await Worker.countDocuments({ creatorId: userId });
    if (userWorkerCount >= 10) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'On Basic plan, you can create only 10 workers. Upgrade your plan!');
    }
  } else if (user.planType === 'standard') {
    const userWorkerCount = await Worker.countDocuments({ creatorId: userId });
    if (userWorkerCount >= 30) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'On Standard plan, you can create up to 30 workers. Upgrade your plan!');
    }
  } else if (user.planType === 'premium') {
    // Premium users can create unlimited workers, no validation needed
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid planType');
  }
  const worker = await Worker.create({
    ...reqBody,
    companyId,
    creatorId: userId,
    updatedBy: userId,
  });

  await emailService.sendWorkerGreetingEmail(reqBody.email);
  return worker;
};

/**
 * Get workers by companyId
 */
const getWorkersByCompanyId = async (companyId, filter) => {
  const company = await Company.findById(companyId).populate('workers');
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (Object.entries(filter).length !== 0) {
    const filteredWorkers = company.workers.filter((worker) => worker.name.match(filter.name));
    return filteredWorkers;
  }
  return company.workers;
};

/**
 * Query for workers
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryWorkers = async (filter) => {
  const workers = await Worker.filter(filter);
  return workers;
};

/**
 * Get worker by id
 * @param {ObjectId} id
 * @returns {Promise<Worker>}
 */
const getWorkerById = async (id) => {
  return Worker.findById(id);
};

/**
 * Update worker by id
 * @param {ObjectId} workerId
 * @param {Object} updateBody
 * @returns {Promise<Worker>}
 */
const updateWorkerById = async (companyId, workerId, updateBody, userId) => {
  if (companyId) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
    }
    if (!company.workers.includes(workerId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Worker does not belong to the specified company');
    }
  }
  const worker = await getWorkerById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  if (updateBody.email && (await Worker.isEmailTaken(updateBody.email, workerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, workerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken by user');
  }
  if (updateBody.email && (await Company.isEmailTaken(updateBody.email, workerId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken by company');
  }
  if (userId.toString() !== worker.creatorId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only the creator can update the worker');
  }
  Object.assign(worker, updateBody);
  await worker.save();
  return worker;
};

/**
 * Delete worker by id
 * @param {ObjectId} workerId
 * @returns {Promise<Worker>}
 */
const deleteWorkerById = async (workerId, companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const worker = await getWorkerById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  if (worker.companyId.toString() !== companyId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to delete this vehicle');
  }
  await company.removeWorker(workerId);
  await worker.remove();
  return worker;
};

module.exports = {
  createWorker,
  queryWorkers,
  getWorkerById,
  updateWorkerById,
  deleteWorkerById,
  getWorkersName,
  getWorkersByCompanyId,
  addCalendarAppointmentToWorker,
};
