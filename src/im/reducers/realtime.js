/**
 * 存储 realtime 对象
 *
 */

import types from '../actions/types';

export default (state=null, action)=>{

    const { type, payload } = action;

    switch(type){

        /**
         * reducer 保存realtime对象
         *
         * @memberof! module:reducers
         */
        case types.IM_SAVE_REALTIME:{
            const realtime = payload;
            if(typeof realtime === 'object'){
                return realtime;
            }else{
                return state;
            }
        }
        default :
            return state;
    }
};


