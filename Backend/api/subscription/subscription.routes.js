const express = require('express')
const { requireAuth } = require('../../middlewares/requireAuth.middleware')
const {
    getPlans,
    createCheckout,
    webhook,
    upgradePlan
} = require('./subscription.controller')

const router = express.Router()

router.get('/plans', getPlans)
router.post('/create-checkout-session', requireAuth, createCheckout)
router.post('/upgrade', requireAuth, upgradePlan)
router.post('/webhook', express.raw({ type: 'application/json' }), webhook)

module.exports = router
