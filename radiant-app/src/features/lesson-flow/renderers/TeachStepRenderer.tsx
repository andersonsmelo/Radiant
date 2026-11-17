import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { TeachPayload } from '../../../types/lessonFlow';
import { galaxyColors } from '../../../ui/theme';
import { space, typography } from '../../../ui/styles';
import { splitTeachBody } from './teachBody';

export function TeachStepRenderer({ payload }: { payload: TeachPayload }) {
    const { lead, rest } = splitTeachBody(payload.body);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>{payload.title}</Text>
            {lead ? <Text style={styles.lead}>{lead}</Text> : null}
            {rest ? <Text style={styles.rest}>{rest}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        gap: space.s2,
    },
    title: {
        ...typography.h3,
        color: galaxyColors.textPrimary,
    },
    lead: {
        ...typography.bodyRegular,
        color: galaxyColors.textPrimary,
    },
    rest: {
        ...typography.bodyRegular,
        color: galaxyColors.textSecondary,
    },
});
