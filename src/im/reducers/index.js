/**
 * rootReducer
 *
 * @module reducers
 */

import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';

import imInit from './imInit';
import fetchState from './fetchState';

import types from '../actions/types';

let testState = Immutable.fromJS({a:1});
let testReducer = (state=testState)=>state;

/**
 * 数据项统一存储
 */
const entities = combineReducers({aaa : (state=testState,action)=>{
    switch(action.type){
        case 'ADD':
            return state.set('a',state.get('a')+1);
        default:
            return state;
    }
}});

/**
 * reducer im客户端状态，在线、离线等
 *
 * @function reducers~imStatus
 * @param {string||Object} state - 状态，可以是字符串，或者Error对象
 * @param {Object} action - action
 */
const imStatus = (state='',action)=>{
    const { type, payload, error } = action;
    const str = error ? payload.message : payload;

    if(type === types.IM_STATUS){
        return str;
    }else{
        return state;
    }
};

/**
 * UI数据
 */
const ui = combineReducers({testReducer});

/**
 * 根reducer
 */
const rootReducer = combineReducers({
    config : imInit,
    imStatus,
    entities,
    fetchState,
    ui,
});


export default rootReducer;






