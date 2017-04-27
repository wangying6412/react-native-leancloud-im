/**
 * imState 存储im的$state
 *
 */

import types from '../actions/types';
import Immutable from 'Immutable';

const $initialState = Immutable.fromJS({
    chating : false,
    statusText : null,
});

export default ($state=$initialState, action)=>{

    const { type, payload, error } = action;

    switch(type){

        /**
         * reducer im客户端状态，在线、离线等
         *
         * @memberof module:reducers
         */
        case types.IM_STATUS:{
            const statusText = error ?
                payload.message : payload;

            return $state.set('statusText',statusText);
        }

        /**
         * reducer im客户端状态 是否正在聊天
         *
         * @memberof module:reducers
         */
        case types.IM_CHATING:{

            return $state.set('chating',payload);
        }

        default :
            return $state;
    }
};


