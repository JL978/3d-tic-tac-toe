import React, { Suspense, useState } from 'react';
import { BlendFunction } from 'postprocessing';
import { useImmer } from 'use-immer';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Center, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import { Vector3 } from 'three';
import classNames from 'classnames';
import XBlock from './components/XBlock';
import OBlock from './components/OBlock';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import createGrid from './utils/createGrid';
import checkWin from './utils/checkWin';
import getGridItemKey from './utils/getGridItemKey';
import { BLOCK_DISTANCE } from './constants';
import Grid from './components/Grid';
import BoardItem from './components/BoardItem';

function App() {
    const [grid, setGrid] = useImmer(() => createGrid());
    const [turn, setTurn] = useState('X');
    const [winner, setWinner] = useState<null | string>(null);
    const [expanded, setExpanded] = useState(true);
    const [hoveringCell, setHoveringCell] = useState<null | number[]>(null);

    const onClick = (i: number, j: number, k: number) => {
        if (winner) return;
        setGrid((draft) => {
            if (grid[i][j][k] !== 0) return;
            draft[i][j][k] = turn;
            if (checkWin(turn, grid, new Vector3(i, j, k))) {
                console.log('winner', turn);
                setWinner(turn);
            }
            setTurn(turn === 'X' ? 'O' : 'X');
        });
    };

    return (
        <Suspense
            fallback={
                <div style={{ width: '100%', height: '100%', color: 'var(--backgound-color)' }}>
                    Loading...
                </div>
            }>
            <div className="Container">
                <Canvas shadows className="CanvasContainer" camera={{ position: [-30, 0, 0] }}>
                    <color args={['rgb(6,22,38)']} attach="background" />
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
                                    const key = getGridItemKey(i, j, k);
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
                                                        key={key}
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
                                                        key={key}
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
                                                key={key}
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
                                            key={key}
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
                                        {row.map((item, k) => {
                                            let itemType = null;
                                            let opacity = 1;
                                            if (item === 0) {
                                                if (
                                                    i === hoveringCell?.[0] &&
                                                    j === hoveringCell?.[1] &&
                                                    k === hoveringCell?.[2]
                                                ) {
                                                    itemType = turn;
                                                    opacity = 0.3;
                                                }
                                            } else {
                                                itemType = item;
                                            }

                                            return (
                                                <button
                                                    onMouseEnter={() => setHoveringCell([i, j, k])}
                                                    onMouseLeave={() => setHoveringCell(null)}
                                                    className="BoardCell"
                                                    key={getGridItemKey(i, j, k)}
                                                    onClick={() => onClick(i, j, k)}>
                                                    {itemType && (
                                                        <BoardItem
                                                            itemType={itemType}
                                                            opacity={opacity}
                                                        />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </React.Fragment>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Suspense>
    );
}

export default App;
