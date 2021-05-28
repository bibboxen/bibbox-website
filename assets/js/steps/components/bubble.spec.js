/**
 * @file
 * Tests of Bubble.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Bubble from './bubble';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

describe('Tests of bubble component', () => {
    it('renders which css-class', () => {
        const wrapper = mount(
            <Bubble
                type='bubble-test'
                label='Bubble'
                icon={faCheck}
            />
        );
        expect(wrapper.exists('.bubble-test')).toEqual(true);
    });

    it('renders label', () => {
        const wrapper = mount(
            <Bubble
                type='bubble-test'
                label='Bubble'
                icon={faCheck}
            />
        );
        expect(wrapper.text()).toEqual('Bubble');
    });

    it('renders icon', () => {
        const wrapper = mount(
            <Bubble
                type='bubble-test'
                label='Bubble'
                icon={faCheck}
            />
        );
        expect(wrapper.exists('.icon')).toEqual(true);
    });

    it('works when bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = shallow(
            <Bubble
                type='bubble-test'
                label='Bubble'
                icon={faCheck}
                onClick={() => mockCallBack()}
            />
        );
        wrapper.find('.bubble').simulate('click');
        expect(mockCallBack.mock.calls.length).toEqual(1);
    });
});
