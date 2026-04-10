import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Share,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BetaService } from '../BetaService';
import { AppButton } from '../../../components/ui/AppButton';
import { space, typography, layout } from '../../../ui/styles';

const COLORS = {
    background: '#000000',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    inputBg: '#1C1C1E',
    border: '#2C2C2E',
    error: '#FF453A',
    primary: '#0A84FF',
};

interface Props {
    onUnlock: () => void;
}

export default function BetaGateScreen({ onUnlock }: Props) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let active = true;

        BetaService.checkAccess().then((granted) => {
            if (active && granted) {
                onUnlock();
            }
        });

        return () => {
            active = false;
        };
    }, [onUnlock]);

    const handleSubmit = async () => {
        if (!code) return;
        setLoading(true);
        setError(false);

        // Simulated network delay for "product feel"
        await new Promise(r => setTimeout(r, 600));

        const success = await BetaService.submitCode(code);
        if (success) {
            onUnlock();
        } else {
            setError(true);
            setLoading(false);
            // Input is intentionally NOT cleared per spec
        }
    };

    const handleCopyInterest = () => {
        Share.share({
            message: 'Radiant — quero participar da beta.',
        })
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
            .catch((error) => {
                console.error('[BetaGateScreen] Failed to share beta interest:', error);
            });
    };

    return (
        <SafeAreaView style={styles.screen}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={[layout.container, layout.center, layout.stackMd, styles.content]}>

                    <Text style={typography.h2}>Radiant está em Beta Fechada</Text>

                    <Text style={styles.bodyText}>
                        Neste momento, o Radiant está sendo testado por um grupo pequeno de profissionais.{'\n\n'}
                        Estamos focando em qualidade, ritmo e clareza antes de abrir para mais pessoas.
                    </Text>

                    <Text style={styles.secondaryText}>
                        Se você recebeu um convite, insira o código abaixo.{'\n'}
                        Caso contrário, em breve abriremos novas vagas.
                    </Text>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={[styles.input, error && styles.inputError]}
                            placeholder="Código de acesso"
                            placeholderTextColor="#555"
                            accessibilityLabel="Código de acesso da beta"
                            accessibilityHint="Digite o código recebido no convite para liberar o aplicativo"
                            value={code}
                            onChangeText={(t) => {
                                setCode(t);
                                setError(false);
                            }}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            returnKeyType="go"
                            onSubmitEditing={handleSubmit}
                        />
                        {error && <Text style={styles.errorText}>Código inválido. Verifique e tente novamente.</Text>}
                    </View>

                    <AppButton
                        onPress={handleSubmit}
                        style={styles.button}
                        disabled={loading || code.length === 0}
                    >
                        {loading ? 'Verificando...' : 'Entrar no Beta'}
                    </AppButton>

                    <Pressable
                        accessibilityHint="Compartilha uma mensagem de interesse com o app de mensagens do iPhone"
                        accessibilityLabel="Quero ser avisado quando abrir"
                        accessibilityRole="button"
                        onPress={handleCopyInterest}
                        style={styles.linkContainer}
                    >
                        <Text style={styles.linkText}>
                            {copied ? 'Mensagem pronta para compartilhar.' : 'Quero ser avisado quando abrir'}
                        </Text>
                    </Pressable>

                    <Text style={styles.footer}>
                        Radiant Beta · dados armazenados apenas neste dispositivo
                    </Text>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        ...layout.screen,
        backgroundColor: COLORS.background,
    },
    keyboardView: {
        flex: 1,
    },
    content: {
        width: '100%',
        maxWidth: 560,
    },
    bodyText: {
        ...typography.body,
        textAlign: 'center',
        color: COLORS.text,
        marginBottom: space.s2,
        maxWidth: 520,
    },
    secondaryText: {
        ...typography.body,
        fontSize: 14,
        textAlign: 'center',
        color: COLORS.textSecondary,
        marginBottom: space.s6,
        maxWidth: 480,
        lineHeight: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: space.s2,
    },
    input: {
        backgroundColor: COLORS.inputBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.text,
        fontSize: 16,
        fontWeight: '500',
        padding: space.s4,
        textAlign: 'center',
        minHeight: 56, // Accessible touch target
    },
    inputError: {
        borderColor: COLORS.error,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 13,
        marginTop: space.s2,
        textAlign: 'center',
    },
    button: {
        width: '100%',
    },
    linkContainer: {
        padding: space.s2,
        marginTop: space.s2,
    },
    linkText: {
        color: COLORS.textSecondary, // Simple text as requested
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    footer: {
        marginTop: space.s6 + space.s2,
        color: COLORS.textSecondary,
        fontSize: 12,
        opacity: 0.5,
        textAlign: 'center',
    },
});
