const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const bookKeeperRoute = require('./bookKeeper.route');
const docsRoute = require('./docs.route');
const companyRoute = require('./company.route');
const companyOwnerRoute = require('./companyOwner.route');
const vehicleRoute = require('./vehicle.route');
const workerRoute = require('./worker.route');
const appointmentRoute = require('./appointment.route');
const calendarRoute = require('./calendar.route');
const trackTimeRoute = require('./trackTIme.route');
const clientRoute = require('./client.route');
const invoiceRoute = require('./invoices');
const stripeRoute = require('./payment.route');
const notifyRoute = require('./notify.route');
const config = require('../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/companyowner',
    route: companyOwnerRoute,
  },
  {
    path: '/bookkeeper',
    route: bookKeeperRoute,
  },
  {
    path: '/company',
    route: companyRoute,
  },
  {
    path: '/vehicle',
    route: vehicleRoute,
  },
  {
    path: '/worker',
    route: workerRoute,
  },
  {
    path: '/appointment',
    route: appointmentRoute,
  },
  {
    path: '/calendar',
    route: calendarRoute,
  },
  {
    path: '/trackTime',
    route: trackTimeRoute,
  },
  {
    path: '/clients',
    route: clientRoute,
  },
  {
    path: '/invoices',
    route: invoiceRoute,
  },
  {
    path: '/stripe',
    route: stripeRoute,
  },
  {
    path: '/notify',
    route: notifyRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
