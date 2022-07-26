import { FC } from 'react';
import { ReactComponent as O } from './o.svg';
import { ReactComponent as X } from './x.svg';

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
