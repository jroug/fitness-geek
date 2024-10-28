import React from 'react';

interface SlickCustomPrevArrowProps {
    onClick?: () => void;
}

const SlickCustomPrevArrow: React.FC<SlickCustomPrevArrowProps> = ({ onClick }) => {
    return (
        <div onClick={onClick} className="slick-custom-arrow slick-custom-arrow-left">
            <i className="fa-solid fa-angle-left"></i>
        </div>
    );
};

export default SlickCustomPrevArrow;
