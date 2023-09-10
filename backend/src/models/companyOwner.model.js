const mongoose = require('mongoose');
const userSchema = require('./user.model');

const companyOwnerSchema = mongoose.Schema(
  {
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    subscriptionId: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { discriminatorKey: 'role', _id: false }
);

const CompanyOwner = userSchema.discriminator('CompanyOwner', companyOwnerSchema);
module.exports = CompanyOwner;
