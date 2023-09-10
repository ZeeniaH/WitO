const mongoose = require('mongoose');

const InvoiceSchema = mongoose.Schema({
  dueDate: Date,
  currency: String,
  items: [{ itemName: String, unitPrice: String, quantity: String, discount: String }],
  rates: String,
  vat: Number,
  total: Number,
  subTotal: Number,
  notes: String,
  status: String,
  invoiceNumber: String,
  type: String,
  creator: [String],
  totalAmountReceived: Number,
  client: { name: String, email: String, phone: String, street: String, zip: String, city: String },
  paymentRecords: [{ amountPaid: Number, datePaid: Date, paymentMethod: String, note: String, paidBy: String }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  company: {
    logo: String,
    name: String,
    email: String,
    businessRegistration: String,
    street: String,
    zip: String,
    city: String,
    contactNo: String,
    nameOfBank: String,
    bic: String,
    iban: String,
    taxNumber: String,
  },
});

const InvoiceModel = mongoose.model('InvoiceModel', InvoiceSchema);
module.exports = InvoiceModel;
