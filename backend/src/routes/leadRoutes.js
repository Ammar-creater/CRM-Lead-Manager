const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const { validateLead } = require('../middleware/validation');
const { leadCreationLimiter } = require('../middleware/rateLimiter');
const auth = require('../middleware/auth');

// All lead routes are protected
router.use(auth.protect.bind(auth));

// Lead CRUD operations
router.get('/', leadController.getAllLeads.bind(leadController));
router.post('/', leadCreationLimiter, validateLead, leadController.createLead.bind(leadController));
router.patch('/:id/status', leadController.updateStatus.bind(leadController));
router.delete('/:id', leadController.deleteLead.bind(leadController));

// Analytics and users
router.get('/analytics', leadController.getAnalytics.bind(leadController));
router.get('/users', auth.restrictTo('admin'), leadController.getUsers.bind(leadController));

module.exports = router;