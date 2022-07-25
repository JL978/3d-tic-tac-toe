import React, { Suspense, useState, useRef, useMemo, useEffect, ReactNode } from 'react';
import { BlendFunction } from 'postprocessing';
import { useImmer } from 'use-immer';
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Center, OrthographicCamera } from '@react-three/drei';
import { DoubleSide, Scene, Vector3 } from 'three';
import classNames from 'classnames';
import XBlock from './components/XBlock';
import OBlock from './components/OBlock';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';

function createGrid(): Array<Array<Array<string | number>>> {
    return new Array(4).fill(new Array(4).fill(new Array(4).fill(0)));
}

function getGridItemKey(i: number, j: number, k: number) {
    return `${i},${j},${k}`;
}

const checkDirections = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
    new Vector3(1, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(1, 0, 1),
    new Vector3(1, 0, -1),
    new Vector3(0, 1, 1),
    new Vector3(0, -1, 1),
    new Vector3(1, 1, 1),
    new Vector3(1, 1, -1),
    new Vector3(-1, -1, 1),
    new Vector3(-1, 1, 1)
];

const checkWin = (
    turn: string,
    board: Array<Array<Array<string | number>>>,
    location: Vector3
): boolean => {
    for (const direction of checkDirections) {
        // console.log('direction: ', direction);

        const forward = location.clone();
        const backward = location.clone();
        let isCorrectDirection = true;
        const combo = [location.clone()];

        for (let i = 0; i < 3; i++) {
            forward.addVectors(forward, direction);
            backward.subVectors(backward, direction);

            if (
                forward.x >= 0 &&
                forward.x < 4 &&
                forward.y >= 0 &&
                forward.y < 4 &&
                forward.z >= 0 &&
                forward.z < 4
            ) {
                if (board[forward.z][forward.y][forward.x] !== turn) {
                    isCorrectDirection = false;
                    continue;
                }
                combo.push(forward.clone());
            }

            if (
                backward.x >= 0 &&
                backward.x < 4 &&
                backward.y >= 0 &&
                backward.y < 4 &&
                backward.z >= 0 &&
                backward.z < 4
            ) {
                if (board[backward.z][backward.y][backward.x] !== turn) {
                    isCorrectDirection = false;
                    continue;
                }
                combo.push(backward.clone());
            }
        }
        if (combo.length === 4) return true;
    }

    return false;
};

const BLOCK_DISTANCE = 6;

function Grid() {
    return (
        <>
            <mesh receiveShadow position={[9, 9, 3]}>
                <planeGeometry args={[24, 24, 1, 1]} />
                <meshStandardMaterial
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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
                    color="white"
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

function App() {
    const [grid, setGrid] = useImmer(() => createGrid());
    const [turn, setTurn] = useState('X');
    const [winner, setWinner] = useState<null | string>(null);
    const [expanded, setExpanded] = useState(false);
    const [hoveringCell, setHoveringCell] = useState<null | number[]>(null);

    const onClick = (i: number, j: number, k: number) => {
        if (winner) return;
        setGrid((draft) => {
            if (grid[i][j][k] !== 0) return;
            draft[i][j][k] = turn;
            if (checkWin(turn, grid, new Vector3(i, j, k))) {
                setWinner(turn);
            }
            setTurn(turn === 'X' ? 'O' : 'X');
        });
    };

    return (
        <Suspense fallback={null}>
            <div className="Container">
                <Canvas shadows className="CanvasContainer">
                    <color args={[0, 0, 0]} attach="background" />
                    <Center>
                        <Grid />
                        <OrbitControls
                            target={[0, 0, 0]}
                            maxPolarAngle={3}
                            autoRotate
                            autoRotateSpeed={4}
                        />
                        {grid.map((plane, i) => {
                            return plane.map((row, j) => {
                                return row.map((item, k) => {
                                    if (item === 0) {
                                        if (
                                            i === hoveringCell?.[0] &&
                                            j === hoveringCell?.[1] &&
                                            k === hoveringCell?.[2]
                                        ) {
                                            if (turn === 'X') {
                                                return (
                                                    <XBlock
                                                        opacity={0.5}
                                                        position={[
                                                            i * BLOCK_DISTANCE,
                                                            j * BLOCK_DISTANCE,
                                                            k * BLOCK_DISTANCE
                                                        ]}
                                                        key={`${i}${j}${k}`}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <OBlock
                                                        opacity={0.5}
                                                        position={[
                                                            i * BLOCK_DISTANCE,
                                                            j * BLOCK_DISTANCE,
                                                            k * BLOCK_DISTANCE
                                                        ]}
                                                        key={`${i}${j}${k}`}
                                                    />
                                                );
                                            }
                                        }
                                        return;
                                    }
                                    if (item === 'X')
                                        return (
                                            <XBlock
                                                position={[
                                                    i * BLOCK_DISTANCE,
                                                    j * BLOCK_DISTANCE,
                                                    k * BLOCK_DISTANCE
                                                ]}
                                                key={`${i}${j}${k}`}
                                                opacity={1}
                                            />
                                        );

                                    return (
                                        <OBlock
                                            position={[
                                                i * BLOCK_DISTANCE,
                                                j * BLOCK_DISTANCE,
                                                k * BLOCK_DISTANCE
                                            ]}
                                            key={`${i}${j}${k}`}
                                            opacity={1}
                                        />
                                    );
                                });
                            });
                        })}
                    </Center>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[50, 200, 50]} intensity={0.75} />
                    <pointLight position={[-70, -200, 0]} intensity={0.35} />
                    <EffectComposer multisampling={8}>
                        <Bloom
                            blendFunction={BlendFunction.ADD}
                            intensity={0.4} // The bloom intensity.
                            width={300} // render width
                            height={300} // render height
                            kernelSize={5} // blur kernel size
                            luminanceThreshold={0.2} // luminance threshold. Raise this value to mask out darker elements in the scene.
                            luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]
                        />
                        <Bloom
                            kernelSize={KernelSize.HUGE}
                            width={500} // render width
                            height={500} // render height
                            luminanceThreshold={0}
                            luminanceSmoothing={0}
                            intensity={0.1}
                        />
                    </EffectComposer>
                </Canvas>
                <div className={classNames('BoardContainer', { expanded })}>
                    <button className="ExpandButton" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'X' : 'O'}
                    </button>
                    <div className="BoardGrid">
                        {grid.map((plane, i) => (
                            <div className="BoardPlane" key={i}>
                                {plane.map((row, j) => (
                                    <React.Fragment key={j}>
                                        {row.map((item, k) => (
                                            <button
                                                onMouseEnter={() => setHoveringCell([i, j, k])}
                                                onMouseLeave={() => setHoveringCell(null)}
                                                className="BoardCell"
                                                key={getGridItemKey(i, j, k)}
                                                onClick={() => onClick(i, j, k)}>
                                                {item !== 0 && item}
                                            </button>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                    {winner && <div>Winner: {winner}</div>}
                </div>
            </div>
        </Suspense>
    );
}

export default App;
