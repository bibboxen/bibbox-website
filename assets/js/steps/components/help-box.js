/**
 * @file
 * Used to display a help text to the user.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { HelpBoxHeader } from '../utils/formatted-messages';

/**
 * HelpBox.
 *
 * @param text
 *   The bread text of the helpbox.
 * @return {*}
 * @constructor
 */
function HelpBox({ text }) {
    return (
        <div className='help-box'>
            <div className='helpbox-header'>
                <span className='icon-helpbox'>
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                <span>
                    {HelpBoxHeader}
                </span>
                <p>{text}</p>
            </div>
        </div>
    );
}

HelpBox.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.string
    ])
};

export default HelpBox;
