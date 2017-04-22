/**
 * recucers - 存储 conversation
 */

import types from '../actions/types.js';
import Immutable from 'immutable';
const $initialState = Immutable.fromJS({});

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){
        case types.IM_SAVE_CONVERSATION:{
            const { userId, conversation } = payload;

            return $state.set(userId,{id:conversation.id});
        }
        default :
            return $state;
    }


};
