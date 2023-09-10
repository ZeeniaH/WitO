// const express = require('express');
// const auth = require('../middlewares/auth');
// const validate = require('../middlewares/validate');

// const clientValidation = require('../validations/client.validation');
// const clientController = require('../controllers/client.controller');

// const router = express.Router();

// router.post('/', auth(), validate(clientValidation.createClient), clientController.createClient);
// router.get('/', auth(), validate(clientValidation.getClients), clientController.getClients);
// router.get('/:clientId', auth(), clientController.getClientById);
// // router.get('/:appointmentId', auth(), validate(clientValidation.getAppointment), clientController.getAppointment);
// // router.patch(
// //   '/:companyId/appointments/:appointmentId',
// //   auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
// //   validate(clientValidation.updateAppointment),
// //   clientController.updateAppointment
// // );
// // router.delete(
// //   '/:companyId/appointments/:appointmentId',
// //   auth(appRoles.Admin, appRoles.CompanyOwner, appRoles.BookKeeper, appRoles.Worker),
// //   validate(clientValidation.deleteAppointment),
// //   clientController.deleteAppointment
// // );

// module.exports = router;

const express = require('express');
const {
  getClients,
  createClient,
  updateClient,
  deleteClient,
  getClientsByUser,
  getClientsByCompany,
} = require('../controllers/client.controller');

const router = express.Router();

router.get('/', getClients);
router.get('/user', getClientsByUser);
router.get('/company-clients', getClientsByCompany);
router.post('/', createClient);
router.patch('/:id', updateClient);
router.delete('/:id', deleteClient);

module.exports = router;
