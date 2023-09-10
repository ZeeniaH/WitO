const mongoose = require('mongoose');
const { toJSON, filter } = require('./plugins');

const appointmentSchema = mongoose.Schema(
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
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    selectCar: {
      type: String,
      required: true,
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    selectWorker: {
      type: String,
      required: true,
    },
    appointmentStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
    },
    appointmentDescription: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
appointmentSchema.plugin(toJSON);
appointmentSchema.plugin(filter);

/**
 * @typedef Appointment
 */
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
