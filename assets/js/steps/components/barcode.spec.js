/**
 * @file
 * Tests of Barcode.
 */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import Barcode from './barcode';

describe('Test of bannerlist component', () => {
    it('Renders without crashing', () => {
        shallow(<Barcode type='checkInItems' />);
    });

    it('Renders title and counter', () => {
        const wrapper = mount(<Barcode type='barcode-test' />);
        expect(wrapper.exists('.barcode-test')).toEqual(true);
    });
});
