/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { trackTimeService } = require('../services');

const getAllWorkersWithTrackTimes = catchAsync(async (req, res) => {
  const { trackTimeId } = req.params;
  const workers = await trackTimeService.getAllWorkersTrackTimeByCompanyId(trackTimeId);
  res.send(workers);
});

const addTrackTime = catchAsync(async (req, res) => {
  const { workerId } = req.params;
  const { companyId } = req.body;
  const workTime = await trackTimeService.addTrackTime(req.body, workerId, companyId);
  res.status(httpStatus.CREATED).send(workTime);
});

const getTrackTimeByWorkerId = catchAsync(async (req, res) => {
  const { workerId, companyId } = req.params;
  const trackTimes = await trackTimeService.getTrackTimeByWorkerId(workerId, companyId);
  res.status(httpStatus.OK).send(trackTimes);
});

const updateTrackTimeByWorkerId = catchAsync(async (req, res) => {
  const { trackTimeId, workerId } = req.params;
  const updateTime = await trackTimeService.updateTrackTimeByWorkerId(trackTimeId, workerId, req.body);
  res.send(updateTime);
});

const deleteTrackTimeByWorkerId = catchAsync(async (req, res) => {
  const { workerId, trackTimeId } = req.params;
  await trackTimeService.deleteWorTimeByWorkerId(workerId, trackTimeId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getTrackedTimeByDateRange = catchAsync(async (req, res) => {
  const { workerId, companyId } = req.params;
  const { startDate, endDate } = req.query;
  const trackTimes = await trackTimeService.getTrackedTimeByDateRange(workerId, companyId, startDate, endDate);
  res.status(httpStatus.OK).send(trackTimes);
});

module.exports = {
  addTrackTime,
  getTrackTimeByWorkerId,
  updateTrackTimeByWorkerId,
  deleteTrackTimeByWorkerId,
  getAllWorkersWithTrackTimes,
  getTrackedTimeByDateRange,
};
