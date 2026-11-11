import React from 'react';
import EditorialPreviewUnavailable from '../features/editorial-preview/EditorialPreviewUnavailable';
import EditorialPreviewLab from '../features/editorial-preview/dev/EditorialPreviewLab';

/** Explicit local opt-in. SHOW_DEV_TOOLS alone never enables editorial material. */
export default function EditorialPreviewRoute() {
    if (!__DEV__ || process.env.EXPO_PUBLIC_RADIANT_EDITORIAL_PREVIEW !== '1') {
        return <EditorialPreviewUnavailable />;
    }
    return <EditorialPreviewLab />;
}
