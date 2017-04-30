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
            const { id } = payload;

            return $state.set(id,payload);
        }
        case types.IM_SAVE_MESSAGES:{
            let {  messages } = payload;
            messages = messages.reduce((obj,message)=>{
                return Object.assign(obj,{ [message.id] : message });
            },{});

            return $state.merge(Immutable.fromJS(messages));
        }
        default :
            return $state;
    }

};
