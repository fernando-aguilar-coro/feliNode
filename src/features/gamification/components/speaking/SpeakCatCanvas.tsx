import React, { useRef, Suspense, useEffect } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import type { GLTF } from 'three-stdlib';
import type { ObjectMap } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei/native';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Cat model – pure canvas, no UI overlays here
// ─────────────────────────────────────────────────────────────────────────────
const MODEL_PATH = require('../../../../../assets/cat.glb');

function ModelCat() {
    const gltf = useGLTF(MODEL_PATH) as any;
    const { scene, animations } = gltf;
    const { actions } = useAnimations(animations, scene);
    const meshRef = useRef<THREE.Object3D>(null);

    useEffect(() => {
        if (meshRef.current) meshRef.current.position.set(0, -3, 0);

        console.warn('--- DIAGNÓSTICO PROFUNDO ---');
        console.warn('Animations (Top-Level):', animations?.length);
        console.warn('Animations (Under Scene):', scene?.animations?.length);
        if (actions) {
            console.warn('Nombres en actions:', Object.keys(actions));
        }
        console.warn('----------------------------');
    }, [actions, animations, scene]);

    return <primitive ref={meshRef} object={scene} scale={1.8} />;
}

export function SpeakCatCanvas() {
    return (
        <Suspense fallback={<ActivityIndicator color="#FFBA08" style={StyleSheet.absoluteFillObject} />}>
            <Canvas
                style={StyleSheet.absoluteFillObject}
                camera={{ position: [0, 3, 13.5], fov: 70 }}
                onCreated={state => {
                    const gl = state.gl.getContext();
                    const originPixelStorei = gl.pixelStorei.bind(gl);
                    // This is a patch for the 'gl.pixelStorei() doesn't support this parameter yet!' spam
                    // because Three.js tries to set texture parameters not yet supported by Expo-GL.
                    gl.pixelStorei = (pname: number, param: any) => {
                        try {
                            return originPixelStorei(pname, param);
                        } catch (e) {
                            /* Silence unsupported parameter errors */
                        }
                    };
                }}
            >
                <ambientLight intensity={1.5} />
                <directionalLight position={[2, 4, 2]} intensity={2} />
                <ModelCat />
            </Canvas>
        </Suspense>
    );
}
