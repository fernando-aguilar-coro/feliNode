// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 3D asset extensions so Metro bundles .glb files instead of
// trying to parse them as JavaScript source code.
config.resolver.assetExts.push('glb', 'gltf', 'bin', 'hdr');

module.exports = config;
