const { Client } = require('../models');

/**
 * Create Client
 */
const createClient = async (reqBody, userId) => {
  const client = await Client.create({
    ...reqBody,
    userId,
  });
  return client;
};

/**
 * Query for clients
 * @param {Object} filter - Mongo filter
 * @returns {Promise<QueryResult>}
 */
const queryClients = async (filter) => {
  const clients = await Client.filter(filter);
  return clients;
};

/**
 * Get client by id
 * @param {ObjectId} id
 * @returns {Promise<Client>}
 */
const getClientById = async (id) => {
  return Client.findById(id);
};

module.exports = {
  createClient,
  queryClients,
  getClientById,
};
