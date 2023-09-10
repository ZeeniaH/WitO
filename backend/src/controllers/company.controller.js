/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */

const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { companyService } = require('../services');

const createCompany = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const company = await companyService.createCompany(req.body, userId);
  res.status(httpStatus.CREATED).send(company);
});

const getCompaniesName = async (req, res) => {
  const result = await companyService.getCompaniesName();
  res.json(result);
};

const getBookKeepers = catchAsync(async (req, res) => {
  const { _id: ownerId } = req.user;
  const { companyId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const bookKeepers = await companyService.getallHiredBookKeepers(ownerId, companyId, options);
  res.status(httpStatus.OK).send(bookKeepers);
});

const getOfferRequests = catchAsync(async (req, res) => {
  const { _id: ownerId } = req.user;
  const { companyId } = req.params;
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const offerRequests = await companyService.getOfferRequests(companyId, ownerId, options);
  res.status(200).send(offerRequests);
});

const getCompanies = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['companyName']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await companyService.queryCompanies(filter, options);
  res.send(result);
});

const getMineCompanies = catchAsync(async (req, res) => {
  const { user } = req;
  const filter = pick(req.query, ['companyName']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { role } = user;
  const result = await companyService.getMineCompanies(user._id, filter, options, role);
  res.send(result);
});

const getCompany = catchAsync(async (req, res) => {
  const company = await companyService.getCompanyById(req.params.companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  res.send(company);
});

const getCompanyByOwnerId = catchAsync(async (req, res) => {
  // Check if any other ID is present in params
  if (Object.keys(req.params).length > 1 || !req.params.ownerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid parameters');
  }
  const companies = await companyService.getCompaniesByOwnerId(req.params.ownerId);
  if (!companies || companies.length < 1) {
    return res.send('This owner does not have any company yet.');
  }
  res.send(companies);
});

const updateCompany = catchAsync(async (req, res) => {
  const company = await companyService.updateCompanyById(req.params.companyId, req.body, req.user);
  res.send(company);
});

const deleteCompany = catchAsync(async (req, res) => {
  await companyService.deleteCompanyById(req.params.companyId, req.user);
  res.status(httpStatus.NO_CONTENT).send();
});

const requestHireBookKeeper = catchAsync(async (req, res) => {
  const { bookKeeperId, companyId, message } = req.body;
  const currentUser = req.user;
  await companyService.requestHireBookKeeper(bookKeeperId, companyId, message, currentUser._id);
  res.send({ message: 'Hire request sent successfully' });
});

const withdrawOfferRequest = catchAsync(async (req, res) => {
  const { companyId, requestId } = req.params;
  const { _id: ownerId } = req.user;
  await companyService.withdrawOfferRequest(companyId, ownerId, requestId);
  res.status(httpStatus.OK).send({ message: 'Offer request withdrawn successfully' });
});

const terminateBookKeeper = catchAsync(async (req, res) => {
  const { companyId, bookKeeperId } = req.params;
  await companyService.terminateBookKeeper(companyId, bookKeeperId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createCompany,
  getCompanies,
  getBookKeepers,
  getOfferRequests,
  getMineCompanies,
  getCompany,
  updateCompany,
  getCompanyByOwnerId,
  deleteCompany,
  getCompaniesName,
  requestHireBookKeeper,
  withdrawOfferRequest,
  terminateBookKeeper,
};
