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
            description: 'Acesso a trilhas premium, revisões avançadas e catálogo expandido.',
        },
        annual: {
            id: 'annual_plus',
            title: 'Radiant Plus anual',
            description: 'Mesmos benefícios, com desconto anual para usuários engajados.',
        },
    },
    entitlements: ['premium_content', 'advanced_review_tools', 'offline_ready_catalog'],
    guardrails: {
        requireTelemetryTaxonomy: true,
        requireRemoteContentCatalog: false,
        remoteIntegrationEnabledByDefault: false,
    },
} as const;
