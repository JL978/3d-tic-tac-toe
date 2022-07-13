import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { Canvas, useFrame } from '@react-three/fiber';
import { Extrude, OrbitControls, PresentationControls, Ring, Center } from '@react-three/drei';
import { BoxBufferGeometry, DoubleSide, Group, Mesh, Shape, Vector3 } from 'three';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import classNames from 'classnames';
import type { Vector3 as Vector3Prop } from '@react-three/fiber/dist/declarations/src/three-types';

type CustomThreeObj = {
    position?: Vector3Prop | undefined;
    opacity?: number;
};

function OBlock({ position, opacity }: CustomThreeObj) {
    const ref = useRef<Group>(null!);
    useFrame((state, delta) => {
        ref.current.rotation.y += delta * 1.25;
    });

    return (
        <group position={position} ref={ref}>
            <mesh position={[0, 0, -0.5]}>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial
                    color={'orange'}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 1, 32, undefined, true]} />
                <meshStandardMaterial
                    color={'orange'}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[1.6, 1.6, 1, 32, undefined, true]} />
                <meshStandardMaterial
                    color={'orange'}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
            <mesh position={[0, 0, 0.5]}>
                <ringGeometry args={[1.6, 2.5, 32]} />
                <meshStandardMaterial
                    color={'orange'}
                    side={DoubleSide}
                    opacity={opacity}
                    transparent
                />
            </mesh>
        </group>
    );
}

function XBlock({ position, opacity }: CustomThreeObj) {
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
        <mesh ref={ref} geometry={geometry} position={position}>
            <meshStandardMaterial side={DoubleSide} color="orange" opacity={opacity} transparent />
        </mesh>
    );
}

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
            // console.log('forward: ', forward);
            // console.log('backward: ', backward);
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
function App() {
    const [grid, setGrid] = useImmer(() => createGrid());
    const [turn, setTurn] = useState('X');
    const [winner, setWinner] = useState<null | string>(null);
    const [expanded, setExpanded] = useState(false);
    const [hoveringCell, setHoveringCell] = useState<null | number[]>(null);

    const onClick = (i: number, j: number, k: number) => {
        if (winner) return;
        setGrid((draft) => {
            if (grid[k][j][i] !== 0) return;
            draft[k][j][i] = turn;
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
                        <OrbitControls
                            target={[0, 0, 0]}
                            maxPolarAngle={3}
                            autoRotate
                            autoRotateSpeed={4}
                        />
                        {grid.map((_, i) => {
                            return grid[i].map((_, j) => {
                                return grid[i][j].map((item, k) => {
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
                                                        position={[i * 5, j * 5, k * 5]}
                                                        key={`${i}${j}${k}`}
                                                    />
                                                );
                                            } else {
                                                return (
                                                    <OBlock
                                                        opacity={0.5}
                                                        position={[i * 5, j * 5, k * 5]}
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
                                                position={[i * 5, j * 5, k * 5]}
                                                key={`${i}${j}${k}`}
                                                opacity={1}
                                            />
                                        );

                                    return (
                                        <OBlock
                                            position={[i * 5, j * 5, k * 5]}
                                            key={`${i}${j}${k}`}
                                            opacity={1}
                                        />
                                    );
                                    // if ((i + j + k) % 2 === 0)
                                    //     return (
                                    //         <XBlock
                                    //             position={[
                                    //                 i * BLOCK_DISTANCE,
                                    //                 j * BLOCK_DISTANCE,
                                    //                 k * BLOCK_DISTANCE
                                    //             ]}
                                    //             key={`${i}${j}${k}`}
                                    //             opacity={1}
                                    //         />
                                    //     );
                                    // return (
                                    //     <OBlock
                                    //         position={[
                                    //             i * BLOCK_DISTANCE,
                                    //             j * BLOCK_DISTANCE,
                                    //             k * BLOCK_DISTANCE
                                    //         ]}
                                    //         key={`${i}${j}${k}`}
                                    //         opacity={1}
                                    //     />
                                    // );
                                });
                            });
                        })}
                    </Center>
                    <ambientLight intensity={0.2} />
                    <pointLight position={[50, 200, 50]} intensity={0.75} />
                    <pointLight position={[-70, -200, 0]} intensity={0.35} />
                    {/* <pointLight position={[0, 0, -200]} intensity={0.35} /> */}
                </Canvas>
                <div className={classNames('BoardContainer', { expanded })}>
                    <button className="ExpandButton" onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'X' : 'O'}
                    </button>
                    <div className="BoardGrid">
                        {grid.map((plane, k) => (
                            <div className="BoardPlane" key={k}>
                                {plane.map((row, j) => (
                                    <React.Fragment key={j}>
                                        {row.map((item, i) => (
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
