const { User, Company } = require('../models');
const catchAsync = require('../utils/catchAsync');

/**
 * Generate Notification
 */
const createNotify = catchAsync(async (req, res) => {
  const { isRead, message, heading, icon, companyId, workerId } = req.body;
  try {
    const company = await Company.findById(companyId).select('owners bookKeepers workers');
    if (!company) {
      return res.status(404).json({ error: 'Company not found!' });
    }
    let userIds = [];
    if (workerId && company.workers.includes(workerId)) {
      userIds.push(workerId);
      userIds.push(...company.owners, ...company.bookKeepers);
    } else if (workerId && company.bookKeepers.includes(workerId)) {
      userIds.push(...company.owners, ...company.bookKeepers);
    } else {
      // userIds = [...company.owners, ...company.bookKeepers, ...company.workers];
      userIds = [...company.owners];
    }
    const notifyObject = {
      companyId,
      isRead,
      message,
      heading,
      icon,
    };
    await Promise.all(
      userIds.map(async (userId) => {
        const user = await User.findById(userId);
        if (!user) {
          return;
        }
        user.Notifications.push(notifyObject);
        await user.save();
      })
    );
    return res.json({ notification: notifyObject });
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred' });
  }
});

/**
 * Read Notification and update status
 */
const isRead = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }
  // Find the index of the notification with the given ID in the user's Notifications array
  const notificationIndex = user.Notifications.findIndex((notification) => notification._id.toString() === notificationId);
  if (notificationIndex === -1) {
    return res.status(404).json({ error: 'Notification not found!' });
  }
  // Update the isRead field of the notification to true
  user.Notifications[notificationIndex].isRead = true;
  await user.save();
  return res.json({ msg: 'Notification marked as read!' });
});

/**
 * Get Notifications
 */
const getNotifications = catchAsync(async (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter
  const user = await User.findById(userId).select('Notifications');
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }
  return res.json({ notifications: user.Notifications });
});

/**
 * Remove Notification
 */
const removeNotify = catchAsync(async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { Notifications: { _id: notificationId } },
    },
    { new: true }
  );
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }
  return res.json({ msg: 'Notification removed!' });
});

/**
 * Clear all Notification
 */
const removeAllNotifications = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findByIdAndUpdate(userId, { Notifications: [] }, { new: true });
  if (!user) {
    return res.status(404).json({ error: 'User not found!' });
  }
  return res.json({ msg: 'All notifications removed!' });
});

module.exports = {
  createNotify,
  isRead,
  getNotifications,
  removeNotify,
  removeAllNotifications,
};
