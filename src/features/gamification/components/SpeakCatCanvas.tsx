import React, { useRef, Suspense, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import type { GLTF } from 'three-stdlib';
import type { ObjectMap } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei/native';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Cat model – pure canvas, no UI overlays here
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_PATH = require('../../../../assets/cat.glb');

function ModelCat() {
    const { scene } = useGLTF(MODEL_PATH) as GLTF & ObjectMap;
    const meshRef = useRef<THREE.Object3D>(null);
    useEffect(() => {
        if (meshRef.current) meshRef.current.position.set(0, -3, 0);
    }, []);
    return <primitive ref={meshRef} object={scene} scale={1.8} />;
}

export function SpeakCatCanvas() {
    return (
        <Suspense fallback={<ActivityIndicator color="#FFBA08" style={StyleSheet.absoluteFillObject} />}>
            <Canvas
                style={StyleSheet.absoluteFillObject}
                camera={{ position: [0, 3, 13.5], fov: 70 }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[2, 4, 2]} intensity={2} />
                <ModelCat />
            </Canvas>
        </Suspense>
    );
}
