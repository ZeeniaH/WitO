const mongoose = require('mongoose');
const userSchema = require('./user.model');

const notifySchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
    },
    workerId: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * @typedef Notify
 */
// const Notify = mongoose.model('Notify', notifySchema);
const Notify = userSchema.discriminator('Notify', notifySchema);

module.exports = Notify;
