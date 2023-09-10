const mongoose = require('mongoose');
const { toJSON, filter } = require('./plugins');

const vehicleSchema = mongoose.Schema(
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
    selectCompany: {
      type: String,
    },
    companyLogo: {
      type: String,
    },
    makeName: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    licensePlate: {
      type: String,
      unique: true,
      required: true,
    },
    registeredCity: {
      type: String,
    },
    color: {
      type: String,
    },
    insurance: {
      type: String,
    },
    mileage: {
      type: Number,
      required: true,
    },
    lastMaintenanceMileage: {
      type: Number,
    },
    carImage: {
      type: [String],
    },
    carDamage: {
      type: Boolean,
      default: false,
    },
    carDamageImages: {
      type: [String],
    },
    vehicleIdentificationNumber: {
      type: String,
    },
    firstRegistrationDate: {
      type: Date,
    },
    policyNumber: {
      type: String,
    },
    fuel: {
      type: String,
    },
    damageDocumentation: {
      type: [String],
    },
    repairPictures: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
vehicleSchema.plugin(toJSON);
vehicleSchema.plugin(filter);

/**
 * Check if licensePlate is taken
 * @param {string} licensePlate - The car's license Plate
 * @param {ObjectId} [excludeCarId] - The id of the car to be excluded
 * @returns {Promise<boolean>}
 */
vehicleSchema.statics.isLicensePlateTaken = async function (licensePlate, excludeCarId) {
  const vehicle = await this.findOne({ licensePlate, _id: { $ne: excludeCarId } });
  return !!vehicle;
};

/**
 * @typedef Vehicle
 */
const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
