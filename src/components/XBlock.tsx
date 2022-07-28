import { useRef, useMemo } from 'react';
import { MeshProps, useFrame } from '@react-three/fiber';
import { BoxBufferGeometry, DoubleSide, Group, Mesh, Vector3 } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CustomThreeObj } from '../types';
import { motion } from 'framer-motion-3d';

export default function XBlock({ position, opacity }: CustomThreeObj) {
    const geometry = useMemo(() => {
        const firstGeo = new BoxBufferGeometry(1, 5, 1);
        const secondGeo = new BoxBufferGeometry(1, 5, 1);

        firstGeo.rotateZ(40);
        secondGeo.rotateZ(-40);

        return mergeBufferGeometries([firstGeo, secondGeo]);
    }, []);

    const ref = useRef<MeshProps>(null!);
    useFrame((state, delta) => {
        if (!ref.current.rotation) return;
        (ref.current.rotation as any).y += delta;
    });

    return (
        <motion.mesh
            initial={{
                opacity: 0,
                scale: 0.1
            }}
            animate={{
                opacity: 1,
                scale: 1,
                transition: {
                    duration: 0.1,
                    type: 'spring', //Why is this not working???
                    stiffness: 150,
                    bounce: 0.5
                }
            }}
            exit={{
                opacity: 0,
                scale: 0,
                transition: {
                    duration: 0.01
                }
            }}
            ref={ref}
            geometry={geometry}
            position={position}
            castShadow
            receiveShadow>
            <meshStandardMaterial
                emissive={'#fff450'}
                side={DoubleSide}
                color={[0, 0, 0]}
                opacity={opacity}
                transparent
            />
        </motion.mesh>
    );
}
