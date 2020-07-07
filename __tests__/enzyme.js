/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  configure, shallow,
} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import { fetchCollection } from './fetch';

// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.
import Profile from '../client/src/components/Profile';
import AllCollections from '../client/src/components/collections/AllCollections';

jest.mock('./Collection.css', () => ({}));

global.fetch = fetchCollection;

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('Profile', () => {
    let wrapper;
    const props = {
      name: 'Charlie',
    };

    beforeAll(() => {
      wrapper = shallow(<Profile {...props} />);
    });

    it('Renders a <h1> tag with the name prop', () => {
      expect(wrapper.type()).toEqual('h1');
      expect(wrapper.text()).toContain('Hello Charlie');
    });
  });

  describe('AllCollections', () => {
    let wrapper;
    const props = { loggedInUser: {}, userCollections: null };

    beforeAll(() => {
      wrapper = shallow(<AllCollections {...props} />);
    });

    it('Renders a <div> tag with user id', () => {
      expect(wrapper.type()).toEqual('div');
    });
  });
});
