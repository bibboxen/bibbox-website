import React from 'react';
import ScanLogin from './ScanLogin';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    shallow(<ScanLogin />);
});

it('contains a h1', () => {
    const wrapper = shallow(<ScanLogin />);
    const welcome = <h1>ScanLogin</h1>;

    expect(wrapper).toContainReact(welcome);
});
