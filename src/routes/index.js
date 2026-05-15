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
const { sendMail } = require('../utils/mailer.util');

const router = express.Router();

// need a ping endpoint for health checks
router.get('/ping', (req, res) => {
    res.json({ message: 'API is running' });
});

// create a email test endpoint to verify email configuration
router.get('/email-test', async (req, res) => {
    try {
        await sendMail({
            to: 'pramod.ravindran.nair@gmail.com',
            subject: 'Test Email',
            html: '<h1>This is a test email</h1>',
        });
        res.json({ message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Error sending test email:', error);
        res.status(500).json({ message: 'Error sending test email', error });
    }
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
