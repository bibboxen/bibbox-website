/**
 * @file
 * Tests of Button.
 */

import React from 'react';
import Button from './button';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

describe('Test of button component', () => {
    it('Renders without crashing', () => {
        shallow(
            <Button
                icon={faCheck}
                which='class'
            />
        );
    });

    it('Renders reset', () => {
        const wrapper = mount(
            <Button
                icon={faCheck}
                className='class'
            />
        );
        expect(wrapper.exists('.class')).toEqual(true);
    });

    it('Renders icon', () => {
        const wrapper = mount(
            <Button
                icon={faCheck}
                which='class'
            />
        );
        expect(wrapper.exists('.icon')).toEqual(true);
        expect(wrapper.find('.icon').length).toEqual(1);
    });

    it('works when button is clicked', () => {
        const mockCallBack = jest.fn();

        const button = shallow(
            <Button
                icon={faCheck}
                which='class'
                onClick={() => mockCallBack()}
            />
        );
        button.find('button').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});
