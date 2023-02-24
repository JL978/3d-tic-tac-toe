import { FC } from 'react';
import { ReactComponent as O } from './svgs/o.svg';
import { ReactComponent as X } from './svgs/x.svg';

//For 2D grid
type BoardItemProps = {
    itemType: string;
    opacity?: number;
};

const BoardItem: FC<BoardItemProps> = ({ itemType, opacity }) => {
    return itemType === 'X' ? (
        <X
            className="BoardItem"
            style={{
                opacity: opacity || 1
            }}
            height={'70%'}
            width={'70%'}
        />
    ) : (
        <O
            className="BoardItem"
            style={{
                opacity: opacity || 1
            }}
            height={'82%'}
            width={'82%'}
        />
    );
};

export default BoardItem;
