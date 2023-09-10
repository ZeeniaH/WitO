const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendAdminGreetingEmail } = require('./email.service');

/**
 * Create a Admin
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }
  if (userBody.role === 'Admin') {
    await sendAdminGreetingEmail(userBody.email);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only Admin role allowed');
  }
  return User.create(userBody);
};

// /**
//  * Create a CompanyOwner
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
// const createCompanyOwner = async (userBody) => {
//   if (await User.isEmailTaken(userBody.email)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
//   }
//   if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
//   }
//   if (userBody.role === 'CompanyOwner') {
//     await sendCompanyOwnerGreetingEmail(userBody.email);
//   } else {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Only CompanyOwner role allowed.');
//   }
//   return User.create(userBody);
// };

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter) => {
  const users = await User.filter(filter);
  return users;
  // const newFilter = { ...filter, role: { $in: ['Admin', 'CompanyOwner'] } };
  // const users = await User.filter(filter);
  // return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (updateBody.phoneNumber && (await User.isPhoneNumberTaken(updateBody.phoneNumber))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
