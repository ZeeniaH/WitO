const httpStatus = require('http-status');
const mongoose = require('mongoose');
const { emailService } = require('.');
const { BookKeeper, Company } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a BookKeeper
 */
const createBookKeeper = async (bookKeeperBody) => {
  if (await BookKeeper.isEmailTaken(bookKeeperBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await BookKeeper.isPhoneNumberTaken(bookKeeperBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }
  await emailService.sendBookKeeperGreetingEmail(bookKeeperBody.email);
  return BookKeeper.create(bookKeeperBody);
};

/**
 * Get bookKeepers
 */
const queryBookKeepers = async (filter) => {
  const bookKeeper = await BookKeeper.filter(filter);
  return bookKeeper;
};

/**
 * Get Approved bookKeepers
 */
const queryApprovedBookKeepers = async (filter, options, companyId) => {
  const approvedFilter = {
    ...filter,
    accountStatus: 'approved',
    hireRequests: {
      $not: {
        $elemMatch: { companyId },
      },
    },
  };

  const bookKeeper = await BookKeeper.filter(approvedFilter);
  return bookKeeper;
};

/**
 * Get BookKeeper By CompanyId
 */
const getBookKeeperByCompanyId = async (companyId) => {
  const company = await Company.findById(companyId);
  if (!company) {
    throw new Error('Company not found');
  }
  const bookKeeperId = company.bookKeepers;
  const bookKeeper = await BookKeeper.findById(bookKeeperId);
  if (!bookKeeper) {
    throw new Error('No BookKeeper in this company');
  }
  return bookKeeper;
};

/**
 * Get HireRequests of bookKeeper
 */
const getBookKeeperHireRequests = async (filter) => {
  const bookKeeper = await BookKeeper.findOne(filter, 'hireRequests').lean();
  return (bookKeeper && bookKeeper.hireRequests) || [];
  // const getBookKeeperHireRequests = async (filter) => {
  //   const currentUser = filter._id;
  //   const bookKeeper = await BookKeeper.findById(currentUser).lean();
  //   if (!bookKeeper) {
  //     return {
  //       totalPages: 0,
  //       totalResults: 0,
  //       results: [],
  //     };
  //   }
  //   const hireRequests = bookKeeper.hireRequests || [];
  //   const page = options.page ? parseInt(options.page, 10) : 1;
  //   const limit = options.limit ? parseInt(options.limit, 10) : 10;
  //   const startIndex = (page - 1) * limit;
  //   const endIndex = page * limit;
  //   const results = {};
  //   results.totalResults = hireRequests.length;
  //   results.totalPages = Math.ceil(hireRequests.length / limit);
  //   if (startIndex > 0) {
  //     results.previous = { page: page - 1, limit };
  //   }
  //   if (endIndex < hireRequests.length) {
  //     results.next = { page: page + 1, limit };
  //   }
  //   results.page = page;
  //   results.limit = limit;
  //   results.results = hireRequests.slice(startIndex, endIndex);
  //   return results;
};

/**
 * Admin Route to update BookKeeper by accountStatus
 */
const updateBookKeeperStatusById = async (bookKeeperId, accountStatus) => {
  const bookKeeper = await BookKeeper.findById(bookKeeperId);
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found');
  }
  bookKeeper.accountStatus = accountStatus;
  await bookKeeper.save();
  return bookKeeper;
};

/**
 * Update BookKeeper by id
 */
const updateBookKeeperById = async (bookKeeperId, updateBody) => {
  const updatedBookKeeper = await BookKeeper.findByIdAndUpdate(bookKeeperId, updateBody, { new: true });
  if (!updatedBookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found');
  }
  if (updateBody.phoneNumber && (await BookKeeper.isPhoneNumberTaken(updateBody.phoneNumber, bookKeeperId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }
  return updatedBookKeeper;
};

/**
 * Remove bookKeeper from Company
 */
const removeBookKeeperFromCompany = async (bookKeeperId, companyId) => {
  const bookKeeper = await BookKeeper.findById(bookKeeperId);
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found');
  }
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  if (!company.bookKeepers.includes(bookKeeperId)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found in company');
  }
  company.bookKeepers = company.bookKeepers.filter((bk) => bk.toString() !== bookKeeperId.toString());
  await company.save();
  bookKeeper.companyId.pull(companyId);
  await bookKeeper.save();
  await emailService.sendResignationEmail(company.email, bookKeeper.email, company.companyName);
  return { message: 'BookKeeper removed from company' };
};

/**
 * get Companies by bookKeeper
 */
const getCompaniesByBookkeeper = async (bookKeeperId, options) => {
  if (!mongoose.Types.ObjectId.isValid(bookKeeperId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid BookKeeper ID');
  }
  const bookKeeper = await BookKeeper.findById(bookKeeperId).populate('companyId');
  if (!bookKeeper) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'BookKeeper not found');
  }
  const companies = bookKeeper.companyId.map((company) => company.toObject());
  if (!companies.length) {
    return {
      totalPages: 0,
      totalResults: 0,
      results: [],
    };
    // throw new ApiError(httpStatus.BAD_REQUEST, 'No companies found for this BookKeeper');
  }
  const page = options.page ? parseInt(options.page, 10) : 1;
  const limit = options.limit ? parseInt(options.limit, 10) : 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = {};
  results.totalResults = companies.length;
  results.totalPages = Math.ceil(companies.length / limit);
  if (startIndex > 0) {
    results.previous = { page: page - 1, limit };
  }
  if (endIndex < companies.length) {
    results.next = { page: page + 1, limit };
  }
  results.page = page;
  results.limit = limit;
  results.results = companies.slice(startIndex, endIndex);
  return results;
};

/**
 * confirm hire Request from BookKeeper
 */
const confirmHireRequest = async (companyId, hireRequestId, bookKeeperId, currentUser) => {
  const companyHasBookKeeper = await Company.hasBookKeeper(companyId);
  if (companyHasBookKeeper) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'A bookKeeper is already appointed');
  }
  const bookKeeper = await BookKeeper.findOne({
    _id: bookKeeperId,
    hireRequests: { $elemMatch: { requestId: hireRequestId } },
  }).populate('hireRequests.company');
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hire request not found');
  }
  // Check if currentUser is a BookKeeper and has the hireRequestId in their hireRequests array
  if (
    currentUser.role !== 'BookKeeper' ||
    !currentUser.hireRequests.find((hr) => hr.requestId.toString() === hireRequestId)
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to confirm this hire request');
  }
  const hireRequest = bookKeeper.hireRequests.find((hr) => hr.requestId.toString() === hireRequestId);
  if (!hireRequest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hire request not found');
  }
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  bookKeeper.companyId.push(hireRequest.companyId);
  hireRequest.status = 'approved';
  hireRequest.updatedAt = Date.now();
  bookKeeper.hireRequests = bookKeeper.hireRequests.filter((hr) => hr.requestId.toString() !== hireRequestId);
  await bookKeeper.save();
  company.bookKeepers.push(bookKeeper._id);
  company.offerRequests = company.offerRequests.filter((hr) => hr.requestId.toString() !== hireRequestId);
  await company.save();
  await emailService.sendConfirmationEmail(company.email, bookKeeper.email, company.companyName);
};

/**
 * reject hire Request
 */
const rejectHireRequest = async (bookKeeperId, hireRequestId, companyId) => {
  const bookKeeper = await BookKeeper.findOne({
    _id: bookKeeperId,
    hireRequests: { $elemMatch: { requestId: hireRequestId } },
  });
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hire request not found');
  }
  const company = await Company.findById(companyId);
  if (!company) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Company not found');
  }
  bookKeeper.hireRequests = bookKeeper.hireRequests.filter((hr) => hr.requestId.toString() !== hireRequestId);
  await bookKeeper.save();
  company.offerRequests = company.offerRequests.filter((hr) => hr.requestId.toString() !== hireRequestId);
  await company.save();
  const hireRequest = bookKeeper.hireRequests.find((hr) => hr.requestId.toString() === hireRequestId);
  if (hireRequest) {
    hireRequest.status = 'denied';
    hireRequest.updatedAt = Date.now();
    await bookKeeper.save();
  }
  await emailService.sendRejectionEmail(company.email, bookKeeper.email, company.companyName);
};

module.exports = {
  createBookKeeper,
  queryBookKeepers,
  queryApprovedBookKeepers,
  getBookKeeperByCompanyId,
  updateBookKeeperStatusById,
  updateBookKeeperById,
  removeBookKeeperFromCompany,
  getCompaniesByBookkeeper,
  getBookKeeperHireRequests,
  confirmHireRequest,
  rejectHireRequest,
};
