const mongoose = require('mongoose');
const { toJSON, filter } = require('./plugins');

const trackTime = mongoose.Schema(
  {
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    licensePlate: {
      type: String,
    },
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    startTime: {
      type: String,
      required: true,
    },
    timeTracked: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    editTime: {
      type: String,
    },
    count: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
trackTime.plugin(toJSON);
trackTime.plugin(filter);

/**
 * @typedef TrackTime
 */
const TrackTime = mongoose.model('TrackTime', trackTime);

module.exports = TrackTime;
