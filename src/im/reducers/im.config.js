/**
 * im.config reducer 存储im设置信息
 */

import Immutable from 'immutable';
import { IM_INIT } from '../actions';

const $initialState = Immutable.fromJS({
    appId : null,
    appKey : null,
});

export default ($state=$initialState,action)=>{
    const {
        type,
        payload
    } = action;

    switch(type){
        case IM_INIT:
            return $state.merge(payload);
        default:
            return $state;
    }
};
