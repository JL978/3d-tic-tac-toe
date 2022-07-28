import { Vector3 } from 'three';

const checkDirections = [
    new Vector3(1, 0, 0),
    new Vector3(0, 1, 0),
    new Vector3(0, 0, 1),
    new Vector3(1, 1, 0),
    new Vector3(1, -1, 0),
    new Vector3(1, 0, 1),
    new Vector3(1, 0, -1),
    new Vector3(0, 1, 1),
    new Vector3(0, 1, -1),
    new Vector3(1, 1, 1),
    new Vector3(1, 1, -1),
    new Vector3(-1, -1, 1),
    new Vector3(-1, 1, 1)
];

export default function checkWin(
    turn: string,
    board: Array<Array<Array<string | number>>>,
    location: Vector3
): boolean {
    for (const direction of checkDirections) {
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
                if (board[forward.x][forward.y][forward.z] !== turn) {
                    break;
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
                if (board[backward.x][backward.y][backward.z] !== turn) {
                    break;
                }
                combo.push(backward.clone());
            }
        }
        if (combo.length === 4) {
            return true;
        }
    }

    return false;
}
