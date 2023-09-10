const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const companySchema = mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    contactNo: {
      type: Number,
    },
    street: {
      type: String,
    },
    zip: {
      type: String,
    },
    city: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    managingDirector: {
      type: String,
    },
    companyRegistrationNumber: {
      type: String,
    },
    taxNumber: {
      type: String,
    },
    vatID: {
      type: String,
    },
    partnershipAgreementDated: {
      type: Date,
    },
    nameOfBank: {
      type: String,
    },
    iban: {
      type: String,
    },
    bic: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    offerRequests: [
      {
        requestId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        bookKeeperName: {
          type: String,
          required: true,
        },
        bookKeeperId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        bookKeeperEmail: {
          type: String,
          required: true,
        },
        requestMessage: {
          type: String,
          required: true,
        },
        requestStatus: {
          type: String,
          enum: ['pending', 'approved', 'denied'],
          default: 'pending',
        },
      },
    ],
    vehicles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
      },
    ],
    owners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    workers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
      },
    ],
    appointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
      },
    ],
    bookKeepers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookKeeper',
      },
    ],
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    calendarAppointments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Calendar',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
companySchema.plugin(toJSON);
companySchema.plugin(paginate);

/**
 * check already have a bookKeeper
 * @param {*} [companyId]
 * @returns {Promise<boolean}
 */
companySchema.statics.hasBookKeeper = async function (companyId) {
  const company = await this.findById(companyId).populate('bookKeepers');
  return company.bookKeepers.length > 0;
};

/**
 * Check if email is taken
 * @param {string} email - The company's email
 * @param {ObjectId} [excludeCompanyId] - The id of the Company to be excluded
 * @returns {Promise<boolean>}
 */
companySchema.statics.isEmailTaken = async function (email, excludeCompanyId) {
  const company = await this.findOne({ email, _id: { $ne: excludeCompanyId } });
  return !!company;
};

/**
 * Check if companyName is taken
 * @param {string} companyName - The company name
 * @param {ObjectId} [excludeCompanyId] - The id of the car to be excluded
 * @returns {Promise<boolean>}
 */
companySchema.statics.isCompanyNameTaken = async function (companyName, excludeCompanyId) {
  const company = await this.findOne({ companyName, _id: { $ne: excludeCompanyId } });
  return !!company;
};

/**
 * Pull method to remove vehicleId from Company
 */
companySchema.methods.removeVehicle = async function (vehicleId) {
  this.vehicles.pull(vehicleId);
  await this.save();
};

/**
 * Pull method to remove workerId from Company
 */
companySchema.methods.removeWorker = async function (workerId) {
  this.workers.pull(workerId);
  await this.save();
};

/**
 * Pull method to remove appointmentId from Company
 */
companySchema.methods.removeAppointment = async function (appointmentId) {
  this.appointments.pull(appointmentId);
  await this.save();
};

/**
 * Pull method to remove calendar appointmentId from Company
 */
companySchema.methods.removeCalendarAppointment = async function (appointmentId) {
  this.calendarAppointments.pull(appointmentId);
  await this.save();
};

/**
 * Pull method to remove userId from Company
 */
companySchema.methods.removeUser = async function (userId) {
  this.users.pull(userId);
  await this.save();
};

/**
 * @typedef Company
 */
const Company = mongoose.model('Company', companySchema);

module.exports = Company;
