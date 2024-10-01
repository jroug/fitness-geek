import React from 'react';

const SlickCustomPrevArrow = (props) => {
    const { onClick } = props;
    return (
        <div onClick={onClick} className="slick-custom-arrow slick-custom-arrow-left">
            <i className="fa-solid fa-angle-left"></i>
        </div>
    );
};

export default SlickCustomPrevArrow;