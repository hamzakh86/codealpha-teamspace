import { httpService } from './http.service'

export const subscriptionService = {
    getPlans,
    createCheckoutSession,
    upgradePlan
}

async function getPlans() {
    return httpService.get('subscription/plans')
}

async function createCheckoutSession(workspaceId, planType) {
    return httpService.post('subscription/create-checkout-session', { workspaceId, planType })
}

async function upgradePlan(workspaceId, planType) {
    return httpService.post('subscription/upgrade', { workspaceId, planType })
}
