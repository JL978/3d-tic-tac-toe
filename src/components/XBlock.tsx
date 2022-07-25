import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxBufferGeometry, DoubleSide, Group, Mesh, Vector3 } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { CustomThreeObj } from '../types';

export default function XBlock({ position, opacity, lightRefs }: CustomThreeObj) {
    const geometry = useMemo(() => {
        const firstGeo = new BoxBufferGeometry(1, 5, 1);
        const secondGeo = new BoxBufferGeometry(1, 5, 1);

        firstGeo.rotateZ(40);
        secondGeo.rotateZ(-40);

        return mergeBufferGeometries([firstGeo, secondGeo]);
    }, []);

    const ref = useRef<Mesh>(null!);
    useFrame((state, delta) => {
        ref.current.rotation.y += delta;
    });

    return (
        <mesh ref={ref} geometry={geometry} position={position} castShadow receiveShadow>
            <meshStandardMaterial
                emissive={'#ff3d3d'}
                side={DoubleSide}
                color={[0, 0, 0]}
                opacity={opacity}
                transparent
            />
        </mesh>
    );
}
