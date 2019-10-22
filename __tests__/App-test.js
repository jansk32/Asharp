/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

it('renders correctly', () => {
  expect(renderer.create(<App />)).toMatchSnapshot();
});


/*
jest.mock('TouchableHighlight', () => {
  const jestReactNative = require('jest-react-native');
  return jestReactNative.mockComponent('TouchableHighlight');
});
*/