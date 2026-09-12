const workspaceService = require('../workspace/workspace.service')
const logger = require('../../services/logger.service')

const PLANS = {
    FREE: {
        id: 'plan_free',
        name: 'Free Starter',
        priceMonthly: 0,
        maxMembers: 3,
        maxBoards: 3,
        features: ['1 Workspace', '3 Boards', '3 Members', 'Basic Kanban', 'Standard Support']
    },
    PRO: {
        id: 'plan_pro',
        name: 'Pro Team',
        priceMonthly: 12,
        maxMembers: 50,
        maxBoards: 999,
        features: ['Unlimited Boards', 'Up to 50 Members', 'Live Multiplayer Cursors', 'Unlimited Attachments', 'Priority Support', 'Full History']
    },
    ENTERPRISE: {
        id: 'plan_enterprise',
        name: 'Enterprise Scale',
        priceMonthly: 29,
        maxMembers: 9999,
        maxBoards: 9999,
        features: ['Custom SSO SAML', 'Dedicated S3 Storage', 'Full Audit Logs', 'SLA 99.9%', 'Dedicated Success Manager']
    }
}

module.exports = {
    getPlans,
    createCheckoutSession,
    handleWebhook,
    updateSubscription
}

async function getPlans() {
    return Object.values(PLANS)
}

async function createCheckoutSession(workspaceId, planType, user) {
    try {
        const plan = PLANS[planType.toUpperCase()]
        if (!plan) throw new Error('Invalid plan selected')

        // Mock Stripe Checkout URL & Session for demo & testing
        const sessionId = 'cs_test_' + Date.now()
        const checkoutUrl = `http://localhost:3000/workspace?session_id=${sessionId}&upgraded_plan=${planType.toUpperCase()}`

        return {
            sessionId,
            checkoutUrl,
            plan
        }
    } catch (err) {
        logger.error('cannot create checkout session', err)
        throw err
    }
}

async function handleWebhook(event) {
    try {
        logger.info(`Stripe webhook received: ${event.type}`)
        if (event.type === 'checkout.session.completed') {
            const { workspaceId, planType } = event.data.object.metadata || {}
            if (workspaceId && planType) {
                await updateSubscription(workspaceId, planType)
            }
        }
        return { received: true }
    } catch (err) {
        logger.error('webhook handling failed', err)
        throw err
    }
}

async function updateSubscription(workspaceId, newPlan) {
    try {
        const workspace = await workspaceService.getById(workspaceId)
        if (!workspace) throw new Error('Workspace not found')
        
        workspace.plan = newPlan.toUpperCase()
        await workspaceService.update(workspace)
        return workspace
    } catch (err) {
        logger.error('cannot update workspace subscription', err)
        throw err
    }
}
