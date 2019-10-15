'use strict'
import React from 'react';
import renderer from 'react-test-renderer';
import UploadImageScreen from '../components/add-image-details-screen';

describe("should create an artefact" , () => {
    test('should output object', () => {
        const tree = renderer.create(<UploadImageScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    })
})