/*

    @name           $name$
    @file           $name$.reducer.js
    @author         $author$
    @createAt       $createAt$

 */

import Immutable from 'immutable';

const $initialState = Immutable.fromJS({
    status : 'init',
    items : []
});
const moduleName = '$name$'.toUpperCase();

export default ($state=$initialState,action={})=>{
    switch(action.type){
        case `${moduleName}_INIT`:{
            return $initialState;
        }
        case `${moduleName}_SAVE`:{
            return $state.mergeDeep(action.payload);
        }
        default:
            return $state;
    }
};







