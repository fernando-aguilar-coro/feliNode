const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidResolutionStrategy(config) {
    return withProjectBuildGradle(config, (config) => {
        if (config.modResults.language === 'groovy') {
            config.modResults.contents += `
allprojects {
    configurations.all {
        resolutionStrategy {
            force "androidx.versionedparcelable:versionedparcelable:1.1.1"
            force "com.android.support:support-v4:28.0.0" 
        }
    }
}
`;
        }
        return config;
    });
};
