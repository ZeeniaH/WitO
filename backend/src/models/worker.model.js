/* eslint-disable radix */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const userSchema = require('./user.model');

const workerSchema = mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountStatus: {
      type: String,
      enum: ['pending', 'denied', 'approved'],
      default: 'pending',
    },
    selectCompany: {
      type: String,
    },
    birthName: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    personalDataUpload: {
      type: [String],
    },
    staffPicture: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    personalNumber: {
      type: Number,
      unique: true,
    },
    dob: {
      type: String,
    },
    placeOfBirth: {
      type: String,
    },
    nationalities: [String],
    street: {
      type: String,
    },
    zip: {
      type: String,
    },
    city: {
      type: String,
    },
    taxId: {
      type: String,
    },
    taxClass: {
      type: String,
    },
    socialSecurityNumber: {
      type: String,
    },
    healthInsurance: {
      type: String,
    },
    children: {
      type: Number,
    },
    iban: {
      type: String,
    },
    bic: {
      type: String,
    },
    nameOfBank: {
      type: String,
    },
    calenderAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
      },
    ],
  },
  { discriminatorKey: 'role', _id: false }
);

/**
 * Pull method to remove calendar appointmentId from Company
 */
workerSchema.methods.removeCalendarAppointment = async function (appointmentId) {
  this.calenderAppointments.pull(appointmentId);
  await this.save();
};

/**
 * auto generate worker's personalNumber
 */
workerSchema.pre('save', function (next) {
  const worker = this;
  if (!worker.isNew) return next();

  Worker.find({})
    .sort({ personalNumber: -1 })
    .limit(1)
    .then((docs) => {
      let personalNumber = '01';
      if (docs.length > 0) {
        const prevPersonalNumber = parseInt(docs[0].personalNumber);
        personalNumber = (prevPersonalNumber + 1).toString().padStart(2, '0');
      }
      worker.personalNumber = personalNumber;
      next();
    });
});

/**
 * @typedef Worker
 */
const Worker = userSchema.discriminator('Worker', workerSchema);
module.exports = Worker;
