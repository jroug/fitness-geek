import React from 'react';

const SlickCustomNextArrow = (props) => {
    const { onClick } = props;
    return (
        <div onClick={onClick} className="slick-custom-arrow slick-custom-arrow-right">
            <i className="fa-solid fa-angle-right"></i>
        </div>
    );
};

export default SlickCustomNextArrow;