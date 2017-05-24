/**
 * im.config reducer 存储im设置信息
 *
 */

import Immutable from 'immutable';
import types from '../actions/types';

const $initialState = Immutable.fromJS({
    appId : null,
    appKey : null,
    ownerId : null,
    messagesLimit : 50
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
            {
                const obj = { ...payload };
                const ownerId = obj.owner.id;
                delete obj.owner;
                obj.ownerId = ownerId;

                return $state.merge(obj);
            }
        default:
            return $state;
    }
};





