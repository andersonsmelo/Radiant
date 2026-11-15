/**
 * Alvo WidgetKit do Radiant (ADR 2026-11-15). Só entra no projeto Xcode quando o
 * plugin `with-widgets` roda com `EXPO_PUBLIC_ENABLE_WIDGETS=true`.
 * Cores: tokens de `src/ui/theme.ts` (claro: `colors`; escuro: `galaxyColors`).
 *
 * @type {import('@bacons/apple-targets/app.plugin').ConfigFunction}
 */
module.exports = (config) => ({
    type: 'widget',
    // Não pode se chamar RadiantWidgets: o módulo Swift do pod de mesmo nome colide com o do alvo.
    name: 'RadiantHomeWidgets',
    displayName: 'Radiant',
    bundleIdentifier: '.widgets',
    // containerBackground e o .widgetURL que o widget usa pedem iOS 17.
    deploymentTarget: '17.0',
    frameworks: ['SwiftUI', 'WidgetKit'],
    colors: {
        $widgetBackground: { color: '#F5FAFF', darkColor: '#13151c' },
        fundo: { color: '#F5FAFF', darkColor: '#13151c' },
        texto: { color: '#14233F', darkColor: '#eef0f6' },
        textoSecundario: { color: '#5B6B85', darkColor: '#a3aabb' },
        primaria: { color: '#2155FF', darkColor: '#3D6BFF' },
        chama: { color: '#FF6B2C', darkColor: '#FF6B2C' },
        sucesso: { color: '#1A9C71', darkColor: '#1A9C71' },
    },
    entitlements: {
        'com.apple.security.application-groups': config.ios.entitlements['com.apple.security.application-groups'],
    },
});
