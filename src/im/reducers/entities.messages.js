/**
 * recucers - 存储 消息(messages)
 *
 * @name messages
 * @memberof module:reducers.entities
 */

import types from '../actions/types.js';
import Immutable from 'immutable';
const $initialState = Immutable.fromJS({});

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){
        case types.IM_SAVE_MESSAGE:{
            const { cid } = payload;

            return $state.set(cid,payload);
        }
        default :
            return $state;
    }

};
