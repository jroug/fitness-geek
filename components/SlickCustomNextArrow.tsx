import React from 'react';

interface SlickCustomNextArrowProps {
    onClick?: () => void;
}

const SlickCustomNextArrow: React.FC<SlickCustomNextArrowProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="slick-custom-arrow slick-custom-arrow-right">
            <i className="fa-solid fa-angle-right"></i>
        </div>
    );
}

export default SlickCustomNextArrow;
