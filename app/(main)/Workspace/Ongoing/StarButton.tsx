import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';

interface StarButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

const StarButton: React.FC<StarButtonProps> = ({ isFavorite, onClick }) => {
    return (
        <label>
            {isFavorite ? <FaStar color="gold" /> : <FaRegStar />}
            <button hidden onClick={onClick} >
            </button>
        </label>
    );
};

export default StarButton;
