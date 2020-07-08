/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import {
  configure, shallow, mount
} from 'enzyme';
import { act } from 'react-dom/test-utils';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import { fetchCollection } from '../__mocks__/fetch';

// Enzyme is a wrapper around React test utilities which makes it easier to
// shallow render and traverse the shallow rendered tree.
import Profile from '../src/components/Profile';
import AllCollections from '../src/components/collections/AllCollections';

// jest.mock('./Collection.css', () => ({}));

global.fetch = fetchCollection;

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

describe('React unit tests', () => {
  describe('Profile', () => {
    let wrapper;
    const props = {
      loggedInUser: 'Charlie@gmail.com',
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
      act(() => {
        wrapper = mount(
          <Router>
            <Route path="/" exact>
              <AllCollections {...props} />
            </Route>
          </Router>)
      });
    });

    it('Renders a <div> tag with user id', () => {
      // console.log('wrapper log: ', wrapper.find(Router).dive().find(Route).filter({ path: '/' }).find(AllCollections));
      // expect(wrapper.find(Router).dive().find(Route).filter({ path: '/' }).find(AllCollections).find('div').find('h1').text()).toEqual('All Collections');      
      expect(wrapper.find(AllCollections).find('div').find('h1').text()).toEqual('All Collections');
    });
  });
});
