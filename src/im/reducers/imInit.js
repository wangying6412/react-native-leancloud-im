/**
 * im.config reducer 存储im设置信息
 *
 * @file
 */

import Immutable from 'immutable';
import types from '../actions/types';

const $initialState = Immutable.fromJS({
    appId : null,
    appKey : null,
    ownerId : null,
});

export default ($state=$initialState,action)=>{
    const {
        type,
        payload,
    } = action;

    switch(type){

        /**
         * reducer - im初始化
         *
         * @memberof module:reducers
         */
        case types.IM_INIT:
            return $state.merge(payload);
        default:
            return $state;
    }
};





