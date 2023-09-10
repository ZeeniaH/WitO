const httpStatus = require('http-status');
const { CompanyOwner, User } = require('../models');
const ApiError = require('../utils/ApiError');
const { sendCompanyOwnerGreetingEmail } = require('./email.service');

/**
 * Create a CompanyOwner
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createCompanyOwner = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  if (await User.isPhoneNumberTaken(userBody.phoneNumber)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Phone Number is taken');
  }
  if (userBody.role === 'CompanyOwner') {
    await sendCompanyOwnerGreetingEmail(userBody.email);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Only CompanyOwner role allowed.');
  }
  return CompanyOwner.create(userBody);
};

module.exports = {
  createCompanyOwner,
};
