/**
 * imState 存储 imClient 对象
 *
 * @module
 */

import types from '../actions/types';

export default (state=null, action)=>{

    const { type, payload } = action;

    switch(type){

        /**
         * reducer 保存im对象
         */
        case types.IM_SAVE_IM:{
            const imClient = payload;
            if(typeof imClient === 'object'){
                return imClient;
            }else{
                return state;
            }
        }
        default :
            return state;
    }
};


