import { useRef } from 'react';
import { GroupProps, useFrame } from '@react-three/fiber';
import { DoubleSide, Group } from 'three';
import { CustomThreeObj } from '../types';
import { motion } from 'framer-motion-3d';

const COLOR = '#00dbcb';
export default function OBlock({ position, opacity }: CustomThreeObj) {
    const ref = useRef<GroupProps>(null!);
    useFrame((state, delta) => {
        if (!ref.current.rotation) return;
        (ref.current.rotation as any).y += delta * 1.25;
    });

    return (
        <motion.group
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
            position={position}
            ref={ref}>
            <mesh position={[0, 0, -0.5]} castShadow receiveShadow>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial
                    emissive={COLOR}
                    color={[0, 0, 0]}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[2.5, 2.5, 1, 32, undefined, true]} />
                <meshStandardMaterial
                    emissive={COLOR}
                    color={[0, 0, 0]}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[1.6, 1.6, 1, 32, undefined, true]} />
                <meshStandardMaterial
                    emissive={COLOR}
                    color={[0, 0, 0]}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh position={[0, 0, 0.5]} castShadow receiveShadow>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial
                    emissive={COLOR}
                    color={[0, 0, 0]}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
        </motion.group>
    );
}
