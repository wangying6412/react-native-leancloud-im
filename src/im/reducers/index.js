/**
 * rootReducer
 *
 * @module
 */

import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';

import imConfig from './im.config.js';

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
 * 网络状态
 */

    /*fetchState : {
        chatList : {
            isFetching : false,
            isRefresing : false,
            didInvalidate : false,
            lastUpdated : null,
            fetchedPageCount : 0,
            nextPageUrl : null,
            error : 'false',
            errorText : null,
        }
    },*/

const fetchState = combineReducers({testReducer});

/**
 * UI数据
 */
const ui = combineReducers({testReducer});

/**
 * 根reducer
 */
const rootReducer = combineReducers({
    imConfig,
    entities,
    fetchState,
    ui,
});


export default rootReducer;






