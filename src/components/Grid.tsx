import { DoubleSide } from 'three';

const COLOR = 'rgb(186, 221, 255)';

export default function Grid() {
    return (
        <>
            <mesh receiveShadow position={[9, 9, 3]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 9, 9]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 9, 15]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 3, 9]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 9, 9]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 15, 9]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[3, 9, 9]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[9, 9, 9]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
            <mesh receiveShadow position={[15, 9, 9]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color={COLOR}
                    side={DoubleSide}
                    opacity={0.05}
                    transparent
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>
        </>
    );
}
