const mongoose = require('mongoose');

const ClientSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  street: String,
  zip: String,
  city: String,
  companyId: [String],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ClientModel = mongoose.model('ClientModel', ClientSchema);
module.exports = ClientModel;
