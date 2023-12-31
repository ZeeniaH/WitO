const mongoose = require('mongoose');
const ClientModel = require('../models/client.model');

const getClient = async (req, res) => {
  const { id } = req.params;
  try {
    const client = await ClientModel.findById(id);
    res.status(200).json(client);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getClients = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    const total = await ClientModel.countDocuments({});
    const clients = await ClientModel.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);
    res.json({ data: clients, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const createClient = async (req, res) => {
  const client = req.body;
  const newClient = new ClientModel({ ...client, createdAt: new Date().toISOString() });
  try {
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(409).json(error.message);
  }
};

const updateClient = async (req, res) => {
  const { id: _id } = req.params;
  const client = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No client with that id');
  const updatedClient = await ClientModel.findByIdAndUpdate(_id, { ...client, _id }, { new: true });
  res.json(updatedClient);
};

const deleteClient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No Client with that id');
  await ClientModel.findByIdAndRemove(id);
  res.json({ message: 'Client deleted successfully' });
};

const getClientsByUser = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const clients = await ClientModel.findById({ _id: searchQuery });
    res.json({ data: clients });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const getClientsByCompany = async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const clients = await ClientModel.find({ companyId: searchQuery });
    res.json({ data: clients });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getClient,
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientsByUser,
  getClientsByCompany,
};
