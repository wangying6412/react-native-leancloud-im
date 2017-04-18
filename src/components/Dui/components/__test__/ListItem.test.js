/* global jest describe test expect */

import React from  'react';
import 'react-native';
import renderer from 'react-test-renderer';

import ListItem from '../ListItem';

describe('ListItem',()=>{
    test('ListItem的快照测试',()=>{
        const cb = jest.fn();
        const component = renderer.create(
            <ListItem
                title="列表标题"
                leftIcon="ios-home"
                onPress = {cb}
                rightText="xxxx"
                rightTextColor="#000"
                bottomText="xxxxxxxxx"
                badge = {10}
                leftImage = 'http://xxxxxxxxxxxxxx.com/xxx.jpg'
                rightIcon = "none"
            />
        );

        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
