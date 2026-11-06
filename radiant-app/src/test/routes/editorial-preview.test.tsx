import React from 'react';
import { render, screen } from '@testing-library/react-native';
import EditorialPreviewRoute from '../../app/editorial-preview';

jest.mock('../../features/editorial-preview/dev/EditorialPreviewLab', () => function Lab() { const { Text } = require('react-native'); return <Text>LAB MOUNTED</Text>; });
jest.mock('../../features/editorial-preview/EditorialPreviewUnavailable', () => function Unavailable() { const { Text } = require('react-native'); return <Text>PREVIEW BLOCKED</Text>; });
const originalDev = __DEV__;
const originalFlag = process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW;
afterEach(() => {
    Object.defineProperty(global, '__DEV__', { value: originalDev, configurable: true });
    if (originalFlag === undefined) delete process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW;
    else process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW = originalFlag;
});
it.each([[false, undefined], [false, '1'], [true, undefined], [true, 'true'], [true, '1']] as const)(
    'requires dev AND explicit opt-in: dev=%s, flag=%s', (dev, flag) => {
        Object.defineProperty(global, '__DEV__', { value: dev, configurable: true });
        if (flag === undefined) delete process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW;
        else process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW = flag;
        render(<EditorialPreviewRoute />);
        expect(screen.getByText(dev && flag === '1' ? 'LAB MOUNTED' : 'PREVIEW BLOCKED')).toBeTruthy();
        expect(screen.queryByText(dev && flag === '1' ? 'PREVIEW BLOCKED' : 'LAB MOUNTED')).toBeNull();
    },
);
