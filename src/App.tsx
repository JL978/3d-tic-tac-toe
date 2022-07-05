import React, { Suspense, useState, useRef, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { Canvas, useFrame } from '@react-three/fiber';
import { Extrude, OrbitControls, PresentationControls, Ring } from '@react-three/drei';
import { BoxBufferGeometry, DoubleSide, Mesh, Shape } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function OBlock(props: any) {
    const ref = useRef<Mesh>(null!);
    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 1.25;
    });
    return (
        <group {...props} ref={ref}>
            <mesh position={[0, 0, -0.5]}>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial color={'orange'} side={DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 1, 32, undefined, true]} />
                <meshStandardMaterial color={'orange'} side={DoubleSide} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.6, 1.6, 1, 32, undefined, true]} />
                <meshStandardMaterial color={'orange'} side={DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0.5]}>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial color={'orange'} side={DoubleSide} />
            </mesh>
        </group>
    );
}

function XBlock(props: any) {
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
        <mesh ref={ref} geometry={geometry} castShadow {...props}>
            <meshStandardMaterial color="orange" envMapIntensity={0.15} />
        </mesh>
    );
}

function createGrid(): Array<Array<Array<string | number>>> {
    return new Array(4).fill(new Array(4).fill(new Array(4).fill(0)));
}

function getGridItemKey(i: number, j: number, k: number) {
    return `${i},${j},${k}`;
}

function App() {
    const [grid, setGrid] = useImmer(() => createGrid());
    const [turn, setTurn] = useState('X');

    const onClick = (i: number, j: number, k: number) => {
        setGrid((draft) => {
            if (grid[k][j][i] !== 0) return;
            draft[k][j][i] = turn;
            setTurn(turn === 'X' ? 'O' : 'X');
        });
    };

    return (
        <Suspense fallback={null}>
            {/* <Canvas shadows>
                <color args={[0, 0, 0]} attach="background" />
                <OrbitControls
                    target={[10, 10, 10]}
                    maxPolarAngle={3}
                    // autoRotate
                    autoRotateSpeed={2}
                />
                {grid.map((_, i) => {
                    return grid[i].map((_, j) => {
                        return grid[i][j].map((_, k) => {
                            if ((i + j + k) % 2 === 0)
                                return (
                                    <XBlock position={[i * 5, j * 5, k * 5]} key={`${i}${j}${k}`} />
                                );
                            return <OBlock position={[i * 5, j * 5, k * 5]} key={`${i}${j}${k}`} />;
                        });
                    });
                })}
                <pointLight position={[20, 20, 20]} />
                <pointLight position={[10, -10, -10]} />
            </Canvas> */}
            <div>
                {grid.map((plane, k) => (
                    <React.Fragment key={k}>
                        <div>
                            {plane.map((row, j) => (
                                <div key={j}>
                                    {row.map((item, i) => {
                                        return (
                                            <button
                                                className={'cell'}
                                                key={`${i},${j},${k}`}
                                                onClick={() => onClick(i, j, k)}>
                                                {item !== 0 && item}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </Suspense>
    );
}

export default App;
