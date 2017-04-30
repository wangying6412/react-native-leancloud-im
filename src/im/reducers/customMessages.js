/**
 * 存储 自定义消息类型
 *
 */

import types from '../actions/types';
import Immutable from 'immutable';

const $initialState = Immutable.Map([]);

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){

        /**
         * reducer 保存customMessage对象
         *
         * @memberof! module:reducers
         */
        case types.IM_REGISTER_CUSTOMMESSAGE:{
            const { type, render, instance } = payload;

            return $state.set(type,Immutable.fromJS({
                type,render
            })).setIn([type,'instance'],instance);
        }
        default :
            return $state;
    }
};


