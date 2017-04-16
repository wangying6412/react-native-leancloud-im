/*

    @name           List
    @file           List.test.js
    @author         lihaitang
    @createAt       2017-03-29 15:59:23

 */

import React from 'react';
import Immutable from 'immutable';
import Mock from 'mockjs';
import { createAction } from 'redux-actions';
import { shallow, } from 'enzyme';
import Redux,{Store} from '../../Redux';

Redux.init({
    List : reducer
});

let $state = Immutable.fromJS({List:{
    status : 'init',
    items : [],
}});

jest.mock('react-native-router-flux',()=>({Actions : { pop : jest.fn() }}));

import List from '../List.js';
import reducer from '../List.reducer.js';

describe('List',()=>{

    test('List - reducer',()=>{
        let action_init = createAction(`${'List'.toUpperCase()}_INIT`);
        let action_save = createAction(`${'List'.toUpperCase()}_SAVE`);

        Store.dispatch(action_init());
        expect(Store.getState().get('List')).toEqual($state.get('List'));

        let str = Mock.Random.string();
        Store.dispatch(action_save({ status : str }));
        expect(Store.getState().getIn(['List','status'])).toEqual(str);
    });

    test('List - Dom测试',()=>{

        const wrapper = ()=>shallow(<List store={Store} />);
        let UI = ()=>wrapper().find('UI').shallow();

        expect(UI().length).toBe(1);

    });

});





