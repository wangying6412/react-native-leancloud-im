/* global describe test expect */

import React from  'react';
import {
    Button,
    Text,
} from 'react-native';
import renderer from 'react-test-renderer';

import Body from '../Body';

describe('Body',()=>{
    test('Body的快照测试',()=>{
        const component = renderer.create(
            <Body delay={0} footer={<Button title="click me" onPress={()=>{}} />}>
                <Text>hello world</Text>
            </Body>
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
