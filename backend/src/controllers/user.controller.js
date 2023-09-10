/* eslint-disable security/detect-non-literal-regexp */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
const httpStatus = require('http-status');

const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService, bookKeeperService, companyOwnerService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const createCompanyOwner = catchAsync(async (req, res) => {
  const user = await companyOwnerService.createCompanyOwner(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  let filter = {};
  if (req.query.role && (req.query.role === 'Admin' || req.query.role === 'CompanyOwner')) {
    filter.role = req.query.role;
    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        filter[key] = new RegExp(filter[key], 'i');
      }
    }
  } else {
    filter.role = { $in: ['Admin', 'CompanyOwner'] };
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});
// const updateUser = catchAsync(async (req, res) => {
//   const { userId } = req.params;
//   const updateBody = req.body;
//   const user = await userService.updateUserById(userId, updateBody);

//   // check if user is of type BookKeeper
//   if (user.__t === 'BookKeeper') {
//     // call updateBookKeeperById function to update BookKeeper specific fields
//     const bookKeeper = await bookKeeperService.updateBookKeeperById(userId, updateBody);
//     res.send(bookKeeper);
//   } else {
//     res.send(user);
//   }
// });

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const createBookKeeper = catchAsync(async (req, res) => {
  if (req.body.role !== 'BookKeeper') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only BookKeeper role is allowed');
  }
  const user = await bookKeeperService.createBookKeeper(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const updateBookKeeperStatusById = catchAsync(async (req, res) => {
  const bookKeeper = await bookKeeperService.updateBookKeeperStatusById(req.params.bookKeeperId, req.body.accountStatus);
  if (!bookKeeper) {
    throw new ApiError(httpStatus.NOT_FOUND, 'BookKeeper not found');
  }
  res.status(httpStatus.OK).send(bookKeeper);
});

const getBookKeepers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['accountStatus']);
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookKeeperService.queryBookKeepers(filter, options);
  res.send(result);
});

const getApprovedBookKeepers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const { companyId } = req.query;
  for (const key in filter) {
    if (filter.hasOwnProperty(key)) {
      filter[key] = new RegExp(filter[key], 'i');
    }
  }
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await bookKeeperService.queryApprovedBookKeepers(filter, options, companyId);
  res.send(result);
});

const getBookKeeperByCompanyId = catchAsync(async (req, res) => {
  const { companyId } = req.params;
  const bookKeeper = await bookKeeperService.getBookKeeperByCompanyId(companyId);
  res.status(200).json({ bookKeeper });
});

const getHireRequests = catchAsync(async (req, res) => {
  const currentUser = req.user;
  if (currentUser.role !== 'BookKeeper') {
    return res.status(403).send({ message: 'Forbidden' });
  }
  const filter = {
    _id: currentUser._id,
    hireRequests: { $exists: true, $not: { $size: 0 } },
  };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const hireRequests = await bookKeeperService.getBookKeeperHireRequests(filter, options);
  res.send(hireRequests);
});

const removeBookKeeperFromCompany = catchAsync(async (req, res) => {
  const { bookKeeperId } = req.params;
  const { companyId } = req.body;
  await bookKeeperService.removeBookKeeperFromCompany(bookKeeperId, companyId);
  res.json({ message: 'BookKeeper removed from company' });
});

const getCompaniesByBookkeeper = catchAsync(async (req, res) => {
  const { bookKeeperId } = req.params;
  // const filter = {
  //   bookKeeperId,
  // };
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const companyList = await bookKeeperService.getCompaniesByBookkeeper(bookKeeperId, options);
  return res.status(200).json(companyList);
});

const confirmHireRequest = catchAsync(async (req, res) => {
  const { companyId } = req.body;
  const { hireRequestId, bookKeeperId } = req.params;
  const currentUser = req.user;
  await bookKeeperService.confirmHireRequest(companyId, hireRequestId, bookKeeperId, currentUser);
  res.status(200).send({ message: 'Hire request confirmed successfully' });
});

const rejectHireRequest = catchAsync(async (req, res) => {
  const { hireRequestId } = req.params;
  const { companyId } = req.body;
  const bookKeeperId = req.user.id;
  await bookKeeperService.rejectHireRequest(bookKeeperId, hireRequestId, companyId);
  res.status(httpStatus.OK).send({ message: 'Hire request rejected successfully' });
});

module.exports = {
  createUser,
  createBookKeeper,
  createCompanyOwner,
  getUsers,
  getUser,
  getHireRequests,
  updateUser,
  deleteUser,
  updateBookKeeperStatusById,
  getBookKeepers,
  getApprovedBookKeepers,
  removeBookKeeperFromCompany,
  getCompaniesByBookkeeper,
  confirmHireRequest,
  rejectHireRequest,
  getBookKeeperByCompanyId,
};
