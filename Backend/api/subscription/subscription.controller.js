const subscriptionService = require('./subscription.service')
const logger = require('../../services/logger.service')

module.exports = {
    getPlans,
    createCheckout,
    webhook,
    upgradePlan
}

async function getPlans(req, res) {
    try {
        const plans = await subscriptionService.getPlans()
        res.json(plans)
    } catch (err) {
        logger.error('Failed to get plans', err)
        res.status(500).send({ err: 'Failed to get plans' })
    }
}

async function createCheckout(req, res) {
    try {
        const { workspaceId, planType } = req.body
        const session = await subscriptionService.createCheckoutSession(workspaceId, planType, req.loggedinUser)
        res.json(session)
    } catch (err) {
        logger.error('Failed to create checkout session', err)
        res.status(500).send({ err: 'Failed to create checkout session' })
    }
}

async function upgradePlan(req, res) {
    try {
        const { workspaceId, planType } = req.body
        const updated = await subscriptionService.updateSubscription(workspaceId, planType)
        res.json(updated)
    } catch (err) {
        logger.error('Failed to upgrade plan', err)
        res.status(500).send({ err: 'Failed to upgrade plan' })
    }
}

async function webhook(req, res) {
    try {
        const result = await subscriptionService.handleWebhook(req.body)
        res.json(result)
    } catch (err) {
        logger.error('Webhook error', err)
        res.status(400).send({ err: 'Webhook error' })
    }
}
