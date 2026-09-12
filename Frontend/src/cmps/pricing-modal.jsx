import React, { useEffect, useState } from 'react'
import { subscriptionService } from '../services/subscription.service'
import { IoClose, IoCheckmarkCircle, IoSparkles, IoFlash } from 'react-icons/io5'

export function PricingModal({ isOpen, onClose, currentWorkspace, onPlanUpdated }) {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isOpen) {
            subscriptionService.getPlans().then(setPlans).catch(console.error)
        }
    }, [isOpen])

    if (!isOpen) return null

    async function handleUpgrade(planId) {
        setLoading(true)
        try {
            const planType = planId.replace('plan_', '').toUpperCase()
            await subscriptionService.upgradePlan(currentWorkspace._id, planType)
            if (onPlanUpdated) onPlanUpdated(planType)
            alert(`🎉 Félicitations ! Votre espace "${currentWorkspace.name}" est désormais passé au plan ${planType} !`)
            onClose()
        } catch (err) {
            console.error('Upgrade error', err)
            alert('Erreur lors de la mise à niveau. Veuillez réessayer.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100000,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#1E293B',
                color: '#F8FAFC',
                borderRadius: '16px',
                border: '1px solid #334155',
                width: '100%',
                maxWidth: '900px',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        fontSize: '24px'
                    }}
                >
                    <IoClose />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        backgroundColor: '#3B82F61A',
                        color: '#60A5FA',
                        fontSize: '13px',
                        fontWeight: '600',
                        marginBottom: '12px'
                    }}>
                        <IoSparkles /> Plans & Tarification CollabFlow SaaS
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0' }}>
                        Accélérez la productivité de votre équipe
                    </h2>
                    <p style={{ color: '#94A3B8', fontSize: '15px', margin: 0 }}>
                        Débloquez les fonctionnalités de collaboration en temps réel, les curseurs live et les canaux illimités.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '20px'
                }}>
                    {plans.map((plan) => {
                        const isPro = plan.id === 'plan_pro'
                        const isCurrent = currentWorkspace?.plan === plan.id.replace('plan_', '').toUpperCase()
                        return (
                            <div
                                key={plan.id}
                                style={{
                                    backgroundColor: isPro ? '#0F172A' : '#1E293B',
                                    borderRadius: '12px',
                                    border: isPro ? '2px solid #3B82F6' : '1px solid #334155',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    boxShadow: isPro ? '0 10px 25px -5px rgba(59, 130, 246, 0.2)' : 'none'
                                }}
                            >
                                {isPro && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: '#3B82F6',
                                        color: '#FFF',
                                        fontSize: '11px',
                                        fontWeight: '700',
                                        padding: '4px 12px',
                                        borderRadius: '12px',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.5px'
                                    }}>
                                        Recommandé
                                    </div>
                                )}

                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 8px 0' }}>
                                        {plan.name}
                                    </h3>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                                        <span style={{ fontSize: '32px', fontWeight: '800' }}>${plan.priceMonthly}</span>
                                        <span style={{ color: '#94A3B8', fontSize: '14px' }}>/ membre / mois</span>
                                    </div>

                                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0' }}>
                                        {plan.features.map((feat, idx) => (
                                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', fontSize: '13px', color: '#CBD5E1' }}>
                                                <IoCheckmarkCircle style={{ color: isPro ? '#3B82F6' : '#10B981', flexShrink: 0 }} />
                                                {feat}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    disabled={loading || isCurrent}
                                    onClick={() => handleUpgrade(plan.id)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: isCurrent ? 'default' : 'pointer',
                                        backgroundColor: isCurrent ? '#334155' : isPro ? '#3B82F6' : '#475569',
                                        color: '#FFFFFF',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {isCurrent ? 'Plan Actuel' : isPro ? <><IoFlash /> Activer Pro</> : 'Sélectionner'}
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
