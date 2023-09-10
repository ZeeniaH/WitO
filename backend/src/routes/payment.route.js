const express = require('express');
const stripe = require('stripe')(require('../config/config').stripe.Stripe_Secret_Key);
const auth = require('../middlewares/auth');
const { appRoles } = require('../config/roles');

const router = express.Router();

router.get('/checkout-session/:sessionId', auth(appRoles.CompanyOwner), async (req, res) => {
  const { sessionId } = req.params;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json(session);
  } catch (e) {
    res.status(400).send('Error retrieving session');
  }
});

router.get('/subscription/:subscriptionId', auth(appRoles.CompanyOwner), async (req, res) => {
  const { subscriptionId } = req.params;
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.plan.product'],
    });
    res.json(subscription);
  } catch (e) {
    res.status(400).send('Error retrieving subscription');
  }
});

router.post('/create-customer-portal-session', async (req, res) => {
  const session = await stripe.billingPortal.sessions.create(req.body);

  res.json(session);
});

module.exports = router;
