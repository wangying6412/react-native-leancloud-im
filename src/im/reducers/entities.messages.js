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

    const { type, payload, meta, error } = action;

    switch(type){
        case types.IM_SAVE_MESSAGE:{
            const { guid } = payload;

            return $state.set(guid,Immutable.fromJS(payload));
        }
        case types.IM_SAVE_MESSAGES:{
            let {  messages } = payload;
            messages = messages.reduce((obj,message)=>{
                return Object.assign(obj,{ [message.guid] : message });
            },{});

            return $state.merge(Immutable.fromJS(messages));
        }
        case types.IM_FETCH_STATE:{

            const { apiName, guid } = meta;

            if(apiName === 'sendMessage' && guid){
                 if(error){
                     const errorText = payload.message;
                     return $state.setIn([guid,'errorText'],errorText);
                 }else{
                     return $state.setIn([guid,'status'],payload);
                 }
            }else{
                return $state;
            }
        }
        default :
            return $state;
    }

};
