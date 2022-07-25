import type { Vector3 as Vector3Prop } from '@react-three/fiber/dist/declarations/src/three-types';

export type CustomThreeObj = {
    position?: Vector3Prop;
    opacity?: number;
    lightRefs?: any[]
};