/**
 * recucers - 存储 用户
 *
 * @name users
 * @memberof module:reducers.entities
 */

import types from '../actions/types.js';
import Immutable from 'immutable';
const $initialState = Immutable.fromJS({});

export default ($state=$initialState, action)=>{

    const { type, payload } = action;

    switch(type){

        case types.IM_INIT:{
            const { owner } = payload;

            return $state.set(String(owner.id), Immutable.fromJS(owner));
        }

        case types.IM_SAVE_USER:{
            const { id } = payload;

            return $state.set(String(id),Immutable.fromJS(payload));
        }

        case types.IM_SAVE_USERS:{

            const users = payload.reduce((obj,user)=>{
                return Object.assign(obj,{ [String(user.id)] : user });
            },{});

            return $state.merge(Immutable.fromJS(users));
        }

        default :
            return $state;
    }

};




