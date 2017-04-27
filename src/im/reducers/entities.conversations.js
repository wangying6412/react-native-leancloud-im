/**
 * recucers - 存储 conversation
 *
 * @name conversations
 * @memberof module:reducers.entities
 */

import types from '../actions/types.js';
import Immutable from 'immutable';
const $initialState = Immutable.fromJS({});

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){
        case types.IM_SAVE_CONVERSATION:{
            const conversation = payload;
            return $state.mergeIn([conversation.id],conversation);
        }
        default :
            return $state;
    }

};
