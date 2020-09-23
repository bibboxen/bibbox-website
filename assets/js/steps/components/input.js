/**
 * @file
 * An input field component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

/**
 * Input.
 *
 * @param name
 *   Name of the input, used for id as well.
 * @param label
 *   The label of the input.
 * @param value
 *   The value of the input.
 * @param activeBanner
 *   Determines if the banner is active.
 * @param rest
 *   Remaining attributes
 * @return {*}
 * @constructor
 */
const Input = ({ name, label, value, activeBanner = false, ...rest }) => {
    const cssClass = activeBanner ? 'input info' : 'input';
    return (
        <div className={cssClass}>
            <label htmlFor={name}>{label}</label>
            <input name={name} id={name} type='text' {...rest} value={value} />
            {activeBanner && (
                <div className='info-banner'>
                    <span className='info-banner-icon'>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    Bogen blev registreret. Klar til næste
                </div>
            )}
        </div>
    );
};

Input.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    activeBanner: PropTypes.bool.isRequired,
    rest: PropTypes.object
};

export default Input;