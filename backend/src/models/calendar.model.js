const mongoose = require('mongoose');
const { toJSON, filter } = require('./plugins');

const calendarSchema = mongoose.Schema(
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
    workerId: {
      type: String,
    },
    selectWorker: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    priorityId: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
    },
    appointmentStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
calendarSchema.plugin(toJSON);
calendarSchema.plugin(filter);

/**
 * @typedef Calendar
 */
const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;
