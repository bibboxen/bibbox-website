/**
 * @file
 * Tests of App.
 */

import React from 'react';
import Bibbox from './bibbox';
import { mount } from 'enzyme';
import { expect, it, describe } from '@jest/globals';
import { IntlProvider } from 'react-intl';
import { translations } from './utils/translations-for-test';
import { CONNECTION_ONLINE } from '../constants';

describe('Initial component (Vælg en funktion...)', () => {
    it('renders the initial component when state is initial and it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations}>
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    connectionState={CONNECTION_ONLINE}
                    machineStateInput={{ step: 'initial' }}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('h1').text()).toEqual('initial-choose-a-function');
    });
});

describe('Check out items component (Udlån)', () => {
    it('renders login component when it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScanUsername'
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.header').text()).toEqual('scan-login-header');
    });

    it('renders login component when logged out, even if there is items', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScanUsername',
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.header').text()).toEqual('scan-login-header');
    });

    it('renders check out items component when it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.header').text()).toEqual('check-out-items-header');
    });

    it('renders item (book) with error in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('banner-adapter-fetching-info');
    });

    it('renders item (book) that is checked in check out items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });
});

describe('Check in items component (Hand in)', () => {
    it('renders check in items component when it is logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.header').text()).toEqual('check-in-items-header');
    });

    it('renders item (book) with error in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.banner .header').text()).toEqual('banner-adapter-fetching-info');
    });

    it('renders item (book) that is checked in check in items component when logged out', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });

    it('renders check in items component when it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.header').text()).toEqual('check-in-items-header');
    });

    it('renders item (book) with error in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4',
                                status: 'error',
                                message: 'Fejl'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.banner .header').text()).toEqual('Fejl');
    });

    it('renders item (book) in progress in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                status: 'inProgress',
                                itemIdentifier: 123
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );

        expect(wrapper.find('.banner .header').text()).toEqual('banner-adapter-fetching-info');
    });

    it('renders item (book) that is checked in check in items component when logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter',
                                status: 'checkedIn'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.banner .header').text()).toEqual('Insekter i farver');
    });
});

describe('Status component', () => {
    it('renders the status component when the state is status and it is logged in', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            name: 'ITK',
                            birthdayToday: false
                        },
                        statusRefreshing: false,
                        holdItems: [],
                        overdueItems: [],
                        chargedItems: [],
                        fineItems: [],
                        recallItems: [],
                        unavailableHoldItems: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.header').at(0).text()).toEqual('status-header');
    });

    it('renders the books from machine state when the state is status, it is logged in and there are books', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            name: 'ITK',
                            birthdayToday: false
                        },
                        statusRefreshing: false,
                        holdItems: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter'
                            }
                        ],
                        overdueItems: [
                            {
                                id: '5313004555',
                                dueDate: 1598832000032,
                                title: 'Open book',
                                author: 'Simpson, Jessica'
                            }
                        ],
                        chargedItems: [
                            {
                                id: '5313004319',
                                returnDate: 1599436800000,
                                title: 'Mellem rejer og hundestejler',
                                author: 'Møller Christensen, Jørgen'
                            }
                        ],
                        fineItems: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                title: 'Den lille bog om søgning på nettet',
                                author: 'Knudsen, Werner'
                            }
                        ],
                        recallItems: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4'
                            }
                        ],
                        unavailableHoldItems: [
                            {
                                id: '5313004351',
                                recallDate: 1598832000000,
                                title:
                                    'Det eksperimenterende billedværksted: [Bind] 1: indføring i den kunstneriske proces',
                                author: 'Holm, Anna Marie',
                                DK5: '70.7'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.header').at(0).text()).toEqual('status-header');
        expect(wrapper.find('.overdue-books-banner .title').text()).toEqual('Open book');
        expect(wrapper.find('.book-banner .title').at(0).text()).toEqual('Mellem rejer og hundestejler');
        expect(wrapper.find('.book-banner .title').at(1).text()).toEqual('Det eksperimenterende billedværksted: [Bind] 1: indføring i den kunstneriske proces');
        expect(wrapper.find('.book-banner .title').at(2).text()).toEqual('Insekter i farver');
    });

    it('renders the books with the correct styling classes, success/danger', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'status',
                        flow: 'status',
                        user: {
                            name: 'ITK',
                            birthdayToday: false
                        },
                        statusRefreshing: false,
                        holdItems: [
                            {
                                id: '5313004327',
                                returnDate: 1599436800000,
                                title: 'Insekter i farver',
                                author: 'Ravn, Hans Peter'
                            }
                        ],
                        overdueItems: [
                            {
                                id: '5313004555',
                                dueDate: 1598832000032,
                                title: 'Open book',
                                author: 'Simpson, Jessica'
                            }
                        ],
                        chargedItems: [
                            {
                                id: '5313004319',
                                returnDate: 1599436800000,
                                title: 'Mellem rejer og hundestejler',
                                author: 'Møller Christensen, Jørgen'
                            }
                        ],
                        fineItems: [
                            {
                                id: '5313004343',
                                returnDate: 1600992000000,
                                title: 'Den lille bog om søgning på nettet',
                                author: 'Knudsen, Werner'
                            }
                        ],
                        recallItems: [
                            {
                                id: '5313004378',
                                recallDate: 1598832000000,
                                title: 'Illustreret svampeflora',
                                author: 'Lange, Morten',
                                DK5: '57.4'
                            }
                        ],
                        unavailableHoldItems: [
                            {
                                id: '5313004351',
                                recallDate: 1598832000000,
                                title:
                                    'Det eksperimenterende billedværksted: [Bind] 1: indføring i den kunstneriske proces',
                                author: 'Holm, Anna Marie',
                                DK5: '70.7'
                            }
                        ]
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.overdue-books-banner.danger').length).toEqual(1);
        expect(wrapper.find('.book-banner.success').length).toEqual(1);
    });
});

describe('Tests of navbar component', () => {
    it('renders the navbar component when state is initial', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.exists('.navbar.initial')).toEqual(true);
    });

    it('renders the name of the logged in user in the navbar', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        step: 'initial',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        }
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.text.bold').text()).toEqual('ITK');
    });

    it('renders the four buttons in the navbar checkinitems', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'button-navbar-check-out'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'button-navbar-status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'button-navbar-check-in'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'button-navbar-finish'
        );
    });

    it('renders the four buttons in the navbar checkoutitems', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'button-navbar-check-out'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'button-navbar-status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'button-navbar-check-in'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'button-navbar-finish'
        );
    });

    it('renders the four buttons in the navbar status with sessioning not enabled', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        hasPrinter: true,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'status',
                        step: 'status',
                        user: {
                            birthdayToday: false,
                            name: 'ITK',
                            isAdmin: true
                        },
                        holdItems: [],
                        overdueItems: [],
                        chargedItems: [],
                        fineItems: [],
                        recallItems: [],
                        unavailableHoldItems: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.button-container button').length).toEqual(4);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'button-navbar-check-out'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'button-navbar-status'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'button-navbar-check-in'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'button-navbar-finish'
        );
    });

    it('renders the five buttons in the navbar status with sessioning enabled', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        hasPrinter: true,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode_password']
                    }}
                    machineStateInput={{
                        flow: 'status',
                        step: 'status',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        holdItems: [],
                        overdueItems: [],
                        chargedItems: [],
                        fineItems: [],
                        recallItems: [],
                        unavailableHoldItems: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.button-container button').length).toEqual(5);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'navbar-start-login-session'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'button-navbar-check-out'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'button-navbar-status'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'button-navbar-check-in'
        );
        expect(wrapper.find('.button-container button').at(4).text()).toEqual(
            'button-navbar-finish'
        );
    });
    it('renders the five buttons in the navbar status with sessioning enabled and two login methods', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        hasPrinter: true,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode_password', 'login_barcode'],
                        loginSessionEnabled: true
                    }}
                    machineStateInput={{
                        flow: 'status',
                        step: 'status',
                        user: {
                            birthdayToday: false,
                            name: 'ITK',
                            isAdmin: true
                        },
                        holdItems: [],
                        overdueItems: [],
                        chargedItems: [],
                        fineItems: [],
                        recallItems: [],
                        unavailableHoldItems: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>

        );
        expect(wrapper.find('.button-container button').length).toEqual(5);
        expect(wrapper.find('.button-container button').at(0).text()).toEqual(
            'button-navbar-login-method'
        );
        expect(wrapper.find('.button-container button').at(1).text()).toEqual(
            'button-navbar-check-out'
        );
        expect(wrapper.find('.button-container button').at(2).text()).toEqual(
            'button-navbar-status'
        );
        expect(wrapper.find('.button-container button').at(3).text()).toEqual(
            'button-navbar-check-in'
        );
        expect(wrapper.find('.button-container button').at(4).text()).toEqual(
            'button-navbar-finish'
        );
    });
});

describe('Tests of configuration', () => {
    it('render the login component defined in the config (login barcode password)', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode_password']
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScanUsernamePassword',
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );

        expect(wrapper.find('.subheader').text()).toEqual(
            'scan-login-password-first-subheader'
        );
    });

    it('render the logincomponent defined in the config (login barcode)', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScanUsername',
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.subheader').text()).toEqual(
            'scan-login-subheader'
        );
    });

    it('render the school name from the configuration', () => {
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'loginScanUsernamePassword',
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={() => { }}
                />
            </IntlProvider>
        );
        expect(wrapper.find('.navbar .text-container').text()).toEqual(
            'Mårslet Skole'
        );
    });
});

describe('Tests of callback data', () => {
    it('renders callback: {enterFlow, { flow: checkOutItems }} in initial when checkoutitems-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(0).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: status }} in initial when status-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(1).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {enterFlow, { flow: checkInItems }} in initial when checkInItems-bubble is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        },
                        loginSessionMethods: ['login_barcode']
                    }}
                    machineStateInput={{
                        step: 'initial'
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );

        wrapper.find('.bubble').at(2).simulate('click');
        expect(mockCallBack.mock.calls).toEqual([
            ['enterFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkOutItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(0).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkOutItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: status }} in initial when status-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkInItems',
                        step: 'checkInItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(1).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'status' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: checkInItems }} in initial when checkInItems-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        inactivityTimeOut: 3000,
                        soundEnabled: false,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>
        );
        wrapper.find('.button-container button').at(2).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['changeFlow', { flow: 'checkInItems' }]
        ]);
    });

    it('renders callback: {changeFlow, { flow: reset }} in initial when reset-navbar-button is clicked', () => {
        const mockCallBack = jest.fn();
        const wrapper = mount(
            <IntlProvider locale="en" translations={translations} >
                <Bibbox
                    boxConfigurationInput={{
                        soundEnabled: false,
                        inactivityTimeOut: 3000,
                        school: {
                            name: 'Mårslet Skole'
                        }
                    }}
                    machineStateInput={{
                        flow: 'checkOutItems',
                        step: 'checkOutItems',
                        user: {
                            birthdayToday: false,
                            name: 'ITK'
                        },
                        items: []
                    }}
                    connectionState={CONNECTION_ONLINE}
                    actionHandler={mockCallBack}
                />
            </IntlProvider>

        );
        wrapper.find('.button-container button').at(3).simulate('click');

        expect(mockCallBack.mock.calls).toEqual([
            ['reset']
        ]);
    });
});
