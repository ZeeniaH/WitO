const httpStatus = require('http-status');
const { TrackTime, Worker, Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get all track time with works by company id
 */
const getAllWorkersTrackTimeByCompanyId = async (timeTrackId) => {
  const trackedTime = await TrackTime.findById(timeTrackId);
  if (!trackedTime) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Tracked Time not found');
  }
  return trackedTime;
};

/**
 * Create Work Time track
 * @param {Object} reqBody
 * @returns {Promise<time>}
 */
const addTrackTime = async (reqBody, workerId, companyId) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  const workTime = await TrackTime.create({
    ...reqBody,
    workerId,
    companyId,
  });
  return workTime;
};

/**
 * Get track time by workerId
 * @param {ObjectId} id
 * @returns {Promise<worker>}
 */
const getTrackTimeByWorkerId = async (workerId, companyId) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const trackTimes = await TrackTime.find({ workerId, companyId }).lean();
  return trackTimes;
};

/**
 * Update Track Tim
 * @param {ObjectId} trackTimeId
 * @param {ObjectId} workerId
 * @param {Object} updateBody
 * @returns {Promise<Appointment>}
 */
const updateTrackTimeByWorkerId = async (trackTimeId, workerId, updateBody) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  const trackTime = await TrackTime.findById(trackTimeId);
  if (!trackTime) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Track time not found');
  }

  Object.assign(trackTime, updateBody);
  await trackTime.save();
  return trackTime;
};

/**
 * Delete trackTime
 */
const deleteWorTimeByWorkerId = async (workerId, trackTimeId) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  let trackTime;
  if (trackTimeId) {
    trackTime = await TrackTime.findOne({ _id: trackTimeId, workerId });
  } else {
    trackTime = await getTrackTimeByWorkerId(workerId);
  }
  if (!trackTime) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Track time not found');
  }
  await TrackTime.deleteOne({ _id: trackTime._id });
  return trackTime;
};

const getTrackedTimeByDateRange = async (workerId, companyId, startDate, endDate) => {
  const worker = await Worker.findById(workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }

  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }

  const trackTimes = await TrackTime.find({
    workerId,
    companyId,
    startTime: { $gte: startDate },
    endTime: { $lte: endDate },
  }).lean();

  return trackTimes;
};

module.exports = {
  addTrackTime,
  getTrackTimeByWorkerId,
  updateTrackTimeByWorkerId,
  deleteWorTimeByWorkerId,
  getAllWorkersTrackTimeByCompanyId,
  getTrackedTimeByDateRange,
};
