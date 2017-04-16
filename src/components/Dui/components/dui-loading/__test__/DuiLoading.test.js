/*

    @name           DuiLoading
    @file           DuiLoading.test.js
    @author         lihaitang
    @createAt       2017-03-28 15:50:11

 */

import React from 'react';
import { shallow, } from 'enzyme';

import DuiLoading from '../DuiLoading.js';

describe('DuiLoading',()=>{

    test('DuiLoading - Dom测试',()=>{

        const wrapper = ()=>shallow(<DuiLoading />);

        expect(wrapper().length).toBe(1);

    });

});





