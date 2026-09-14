export const PaywallPlan = {
    enabled: false,
    defaultVariant: 'off',
    gate: {
        trigger: 'after_value_delivered',
        minimumSessionsBeforeOffer: 3,
        minimumDaysBeforeOffer: 7,
    },
    offers: {
        monthly: {
            id: 'monthly_plus',
            title: 'Radiant Plus mensal',
            description: 'Vidas ilimitadas — e só isso.',
        },
        annual: {
            id: 'annual_plus',
            title: 'Radiant Plus anual',
            description: 'Vidas ilimitadas — e só isso, com cobrança anual.',
        },
    },
    entitlements: ['unlimited_hearts'],
    guardrails: {
        requireTelemetryTaxonomy: true,
        requireRemoteContentCatalog: false,
        remoteIntegrationEnabledByDefault: false,
    },
} as const;
