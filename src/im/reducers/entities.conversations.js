/**
 * recucers - 存储 conversation
 *
 * @name conversations
 * @memberof module:reducers.entities
 */

import types from '../actions/types.js';
import Immutable from 'immutable';
const $initialStateItem = Immutable.fromJS({
    id : null,
    members : [],
    creator : null,
    lastMessage : null,
    createdAt : null,
    updatedAt : null,
    lastMessageAt : null,
    unreadMessagesCount : 0,
    messages : Immutable.Set(),
    done : false,
    iterator : null
});

$initialStateItem;

const $initialState = Immutable.fromJS({});

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){

        case types.IM_SAVE_CONVERSATION:{
            const conversation = payload;
            return $state.mergeIn([conversation.id],conversation);
        }

        case types.IM_SAVE_MESSAGES:{
            let { cid, messages, done } = payload;
            messages = messages.map(message=>message.id);

            return $state
                .mergeIn([cid,'messages'],messages)
                .setIn([cid,'done'],done);
        }

        case types.IM_SAVE_ITERATOR:{
            const { cid , iterator } = payload;

            return $state.setIn([cid,'iterator'],iterator);
        }

        default :
            return $state;
    }

};






