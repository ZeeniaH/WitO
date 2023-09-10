const mongoose = require('mongoose');
const userSchema = require('./user.model');

const bookKeeperSchema = mongoose.Schema(
  {
    accountStatus: {
      type: String,
      enum: ['pending', 'denied', 'approved'],
      required: true,
      default: 'pending',
    },
    companyId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
      },
    ],
    hireRequests: [
      {
        requestId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        companyName: {
          type: String,
          required: true,
        },
        companyId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Company',
          required: true,
        },
        email: {
          type: String,
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ['pending', 'approved', 'denied'],
          default: 'pending',
        },
      },
    ],
  },
  { discriminatorKey: 'role', _id: false }
);

const BookKeeper = userSchema.discriminator('BookKeeper', bookKeeperSchema);
module.exports = BookKeeper;
