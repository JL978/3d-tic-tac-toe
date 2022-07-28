import { Vector3 } from 'three';
import { expect, test } from 'vitest';
import checkWin from './checkWin';

const boards = [
    [
        [
            [0, 0, 0, 0],
            [0, 0, 'X', 0],
            [0, 'X', 0, 0],
            ['X', 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            ['O', 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 'O', 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 'O', 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 0, 0, 0],
            [0, 'X', 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 'X', 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 'X', 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            ['O', 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 'O', 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 'O', 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ],
    [
        [
            [0, 0, 'X', 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 'X', 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 'X', 0],
            [0, 0, 0, 0]
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    ]
];

const winGames = [
    {
        position: new Vector3(0, 0, 3),
        turn: 'X'
    },
    {
        position: new Vector3(3, 3, 3),
        turn: 'O'
    },
    {
        position: new Vector3(1, 1, 1),
        turn: 'X'
    },
    {
        position: new Vector3(3, 0, 3),
        turn: 'O'
    },
    {
        position: new Vector3(3, 3, 2),
        turn: 'X'
    }
];

const loseGamesPosition = [
    {
        position: new Vector3(0, 1, 3),
        turn: 'X'
    },
    {
        position: new Vector3(1, 3, 3),
        turn: 'O'
    },
    {
        position: new Vector3(1, 2, 1),
        turn: 'X'
    },
    {
        position: new Vector3(0, 2, 3),
        turn: 'O'
    },
    {
        position: new Vector3(3, 2, 2),
        turn: 'X'
    }
];

const loseGamesOpponent = [
    {
        position: new Vector3(0, 0, 3),
        turn: 'O'
    },
    {
        position: new Vector3(3, 3, 3),
        turn: 'X'
    },
    {
        position: new Vector3(1, 1, 1),
        turn: 'O'
    },
    {
        position: new Vector3(0, 0, 3),
        turn: 'X'
    },
    {
        position: new Vector3(3, 3, 2),
        turn: 'O'
    }
];

test('Losing Games By Wrong Position', () => {
    boards.forEach((board, index) => {
        const { turn, position } = loseGamesPosition[index];
        expect(checkWin(turn, board, position)).toBe(false);
    });
});

test('Losing Games By Opponent Blocking', () => {
    boards.forEach((board, index) => {
        const { turn, position } = loseGamesOpponent[index];
        expect(checkWin(turn, board, position)).toBe(false);
    });
});

test('Winning Games', () => {
    boards.forEach((board, index) => {
        const { turn, position } = winGames[index];
        expect(checkWin(turn, board, position)).toBe(true);
    });
});
