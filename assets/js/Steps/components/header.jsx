import React from 'react';
import PropTypes from 'prop-types';
import IconBubble from './iconBubble';
function Header({ header, text }) {
    return (
        <div className="row">
            <IconBubble></IconBubble>
            <div className="col-md-10">
                <div className="header">{header}</div>
                <div className="sub-header">{text}</div>
            </div>
        </div>
    );
}

Header.propTypes = {
    header: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};
export default Header;
