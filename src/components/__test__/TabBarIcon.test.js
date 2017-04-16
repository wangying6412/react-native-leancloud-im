/* global describe test expect */

import React from  'react';
import 'react-native';
import renderer from 'react-test-renderer';

import TabBarIcon from '../TabBarIcon';

describe('TabBarIcon',()=>{
    test('TabBarIcon的快照测试',()=>{
        const component = renderer.create(
            <TabBarIcon icon="ios-home" focused={false} tintColor="#F00" />
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
