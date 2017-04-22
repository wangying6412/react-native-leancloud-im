/**
 * imState 存储im的state
 *
 * @module
 */

import types from '../actions/types';

export default (state=null, action)=>{

    const { type, payload, error } = action;

    switch(type){

        /**
         * reducer im客户端状态，在线、离线等
         */
        case types.IM_STATUS:{
            const statusText = error ? payload.message : payload;

            return statusText;
        }

        default :
            return state;
    }
};

