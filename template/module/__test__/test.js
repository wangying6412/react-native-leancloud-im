/*

    @name           $name$
    @file           $name$.test.js
    @author         $author$
    @createAt       $createAt$

 */

import React from 'react';
import Immutable from 'immutable';
import Mock from 'mockjs';
import { createAction } from 'redux-actions';
import { shallow, } from 'enzyme';
import Redux,{Store} from '../../Redux';

Redux.init({
    $name$ : reducer
});

let $state = Immutable.fromJS({$name$:{
    status : 'init',
    items : [],
}});

jest.mock('react-native-router-flux',()=>({Actions : { pop : jest.fn() }}));

import $name$ from '../$name$.js';
import reducer from '../$name$.reducer.js';

describe('$name$',()=>{

    test('$name$ - reducer',()=>{
        let action_init = createAction(`${'$name$'.toUpperCase()}_INIT`);
        let action_save = createAction(`${'$name$'.toUpperCase()}_SAVE`);

        Store.dispatch(action_init());
        expect(Store.getState().get('$name$')).toEqual($state.get('$name$'));

        let str = Mock.Random.string();
        Store.dispatch(action_save({ status : str }));
        expect(Store.getState().getIn(['$name$','status'])).toEqual(str);
    });

    test('$name$ - Dom测试',()=>{

        const wrapper = ()=>shallow(<$name$ store={Store} />);
        let UI = ()=>wrapper().find('UI').shallow();

        expect(UI().length).toBe(1);

    });

});





