const path = require('node:path');

// A release graph cannot reach the lab, its synthetic scenario or the review JSON,
// even when a public development-tools flag was accidentally left enabled.
function withEditorialPreviewIsolation(config, enabled) {
  const previous = config.resolver.resolveRequest;
  const appRoot = path.dirname(require.resolve('../metro.config.js'));
  const unavailable = path.resolve(appRoot, 'src/features/editorial-preview/EditorialPreviewUnavailable.tsx');
  const reviewPack = path.resolve(appRoot, '../docs/evidence/2026-11-03-pc05-payloads.json');
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const result = previous
      ? previous(context, moduleName, platform)
      : context.resolveRequest(context, moduleName, platform);
    if (result.type === 'sourceFile' && !(context.dev === true && enabled)) {
      const file = path.normalize(result.filePath);
      if (file.includes(`${path.sep}editorial-preview${path.sep}dev${path.sep}`) || file === reviewPack) {
        return { type: 'sourceFile', filePath: unavailable };
      }
    }
    return result;
  };
  return config;
}

module.exports = { withEditorialPreviewIsolation };
