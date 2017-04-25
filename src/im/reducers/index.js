/**
 * rootReducer
 *
 * @file
 * @module reducers
 */

import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';

import imInit from './imInit';
import fetchState from './fetchState';
import imClient from './imClient';
import imStatus from './imStatus';


import conversations from './entities.conversations';
import messages from './entities.messages';


//import types from '../actions/types';

let testState = Immutable.fromJS({a:1});
let testReducer = (state=testState)=>state;

/**
 * 数据项统一存储
 *
 * @name entities
 * @memberof module:reducers
 */
const entities = combineReducers({
    conversations,
    messages,
});

/**
 * UI数据
 */
const components = combineReducers({
    imStatus,
});

/**
 * 容器数据
 */
const containers = combineReducers({testReducer});

/**
 * 根reducer
 */
const rootReducer = combineReducers({
    config : imInit,
    entities,
    fetchState,
    imClient,
    containers,
    components,
});

export default rootReducer;






