// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

const {
    resolver: { assetExts, sourceExts },
} = config;

// 1. Definimos las extensiones de archivos binarios pesados (3D e IA)
const extraAssetExts = ['glb', 'gltf', 'bin', 'hdr', 'pte'];

// 2. Filtramos para asegurar que no estén en sourceExts y los añadimos a assetExts
// Esto es lo que evita que Metro intente "leer" el código dentro de los modelos.
config.resolver.assetExts = [...assetExts, ...extraAssetExts];

// 3. Si usas librerías como react-native-svg-transformer, aquí podrías 
// separar los SVG, pero para arreglar el error de RAM, lo anterior es lo vital.

module.exports = config;