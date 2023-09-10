/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { workerService, companyService } = require('../services');

const createWorker = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const userId = req.user._id;
  const worker = await workerService.createWorker(req.body, companyId, userId);
  await companyService.addWorkerToCompany(companyId, worker._id);
  res.status(httpStatus.CREATED).send(worker);
});

const getWorkersByCompanyId = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { companyId } = req.params;
  const result = await workerService.getWorkersByCompanyId(companyId, filter, options);
  res.send(result);
});

const getWorkersName = catchAsync(async (req, res) => {
  const result = await workerService.getWorkersName();
  res.json(result);
});

const getWorkers = catchAsync(async (req, res) => {
  let name = req.query.firstName;
  // for (const key in filter) {
  //   if (filter.hasOwnProperty(key)) {
  //     filter[key] = new RegExp(filter[key], 'i');
  //   }
  // }
  name = new RegExp(name, 'i');
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result1 = await workerService.queryWorkers({ firstName: name }, options);
  const result2 = await workerService.queryWorkers({ lastName: name }, options);
  const result = result1;
  result.results = result1.results.concat(result2.results).reduce((acc, obj) => {
    const existingObj = acc.find((item) => item.id === obj.id);
    if (existingObj) {
      Object.assign(existingObj, obj);
    } else {
      acc.push(obj);
    }
    return acc;
  }, []);
  res.send(result);
});

const getWorker = catchAsync(async (req, res) => {
  const worker = await workerService.getWorkerById(req.params.workerId);
  if (!worker) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Worker not found');
  }
  res.send(worker);
});

const updateWorker = catchAsync(async (req, res) => {
  const { companyId, workerId } = req.params;
  const userId = req.user._id;
  const worker = await workerService.updateWorkerById(companyId, workerId, req.body, userId);
  res.send(worker);
});

const deleteWorker = catchAsync(async (req, res) => {
  const { companyId, workerId } = req.params;
  await workerService.deleteWorkerById(workerId, companyId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createWorker,
  getWorkers,
  getWorker,
  updateWorker,
  deleteWorker,
  getWorkersName,
  getWorkersByCompanyId,
};
