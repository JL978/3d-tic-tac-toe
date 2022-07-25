import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { DoubleSide, Group } from 'three';
import { CustomThreeObj } from '../types';

const COLOR = '#00ffd5';
export default function OBlock({ position, opacity, lightRefs }: CustomThreeObj) {
    const ref = useRef<Group>(null!);
    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 1.25;
    });

    return (
        <group position={position} ref={ref}>
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
        </group>
    );
}
