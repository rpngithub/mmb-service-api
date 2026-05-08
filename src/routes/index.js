const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const planRoutes = require('./plan.routes');
const subscriptionRoutes = require('./subscription.routes');

// const paymentRoutes = require('./payment.routes');
const designRoutes = require('./design.routes');
// const orderRoutes = require('./order.routes');
const businessRoutes = require('./business.routes');
const userBusinessRoutes = require('./userBusiness.routes');
const profileRoutes = require('./profile.routes');
const userDesignRoutes = require('./userDesign.routes');

const router = express.Router();

// need a ping endpoint for health checks
router.get('/ping', (req, res) => {
    res.json({ message: 'API is running' });
});
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/plans', planRoutes);
router.use('/subscriptions', subscriptionRoutes);
// router.use('/payments', paymentRoutes);
router.use('/designs', designRoutes);

// router.use('/orders', orderRoutes);
router.use('/businesses', businessRoutes);
router.use('/user-businesses', userBusinessRoutes);
router.use('/profile', profileRoutes);
router.use('/user-designs', userDesignRoutes);

module.exports = router;
