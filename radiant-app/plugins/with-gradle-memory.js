const { withGradleProperties } = require('@expo/config-plugins');

/**
 * Raises the Gradle JVM memory that `expo prebuild` writes into
 * `android/gradle.properties`.
 *
 * The generated default (`-Xmx2048m -XX:MaxMetaspaceSize=512m`) is not enough
 * for this app: `:expo-updates:kspReleaseKotlin` dies with
 * `java.lang.OutOfMemoryError: Metaspace`, and Gradle then hangs in shutdown
 * instead of exiting — so the visible symptom is a build that stops making
 * progress with no error printed, not a failure message. Diagnosed on the first
 * Android build of this project, 2026-07-28.
 *
 * This lives as a config plugin rather than an edit to `android/gradle.properties`
 * because that file is generated: every `expo prebuild` rewrites it and would
 * silently restore the value that breaks the build. `expo-build-properties` does
 * not cover this — its Android options are a fixed typed set with no
 * `gradle.properties` escape hatch (checked against 0.14.8, the SDK 54 line).
 */
const JVM_ARGS = '-Xmx4096m -XX:MaxMetaspaceSize=1536m';

module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (cfg) => {
    const properties = cfg.modResults.filter(
      (item) => !(item.type === 'property' && item.key === 'org.gradle.jvmargs')
    );

    properties.push({ type: 'property', key: 'org.gradle.jvmargs', value: JVM_ARGS });

    cfg.modResults = properties;
    return cfg;
  });
};
