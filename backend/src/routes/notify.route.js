const express = require('express');
const { notifyController } = require('../controllers');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/create', auth(), notifyController.createNotify);
router.get('/notifies/:id', auth(), notifyController.getNotifications);
router.patch('/read-notify/:notificationId', auth(), notifyController.isRead);
router.delete('/remove/:id', auth(), notifyController.removeNotify);
router.delete('/remove-all', auth(), notifyController.removeAllNotifications);

module.exports = router;
