/*

    @name           List
    @file           List.reducer.js
    @author         lihaitang
    @createAt       2017-03-29 15:59:23

 */

import Immutable from 'immutable';
import {
    ListView
} from 'react-native';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
const $itemInitialState = Immutable.fromJS({
    data : [],
    dataSource : ds.cloneWithRows([]),
    refreshing : false,
    loading : false,
    listState : 'init',
    size : 0,
    current_page : 0,
    total_pages : 0,
    error : '',
    footerY : 0,
});
const $initialState = Immutable.fromJS({
    status : 'init',
    items : {},
});
const moduleName = 'List'.toUpperCase();

export default ($state=$initialState,action={})=>{
    switch(action.type){
        case `${moduleName}_INIT`:{
            if(action.payload.key){
                $state = $state.setIn(['items',action.payload.key],$itemInitialState);
            }
            return $state;
        }
        case `${moduleName}_SAVE`:{
            if($state.getIn(['items',action.payload.key])){
                $state = $state.mergeDeepIn(['items',action.payload.key],action.payload);
            }else{
                let $item = $itemInitialState.mergeDeep(action.payload);
                $state = $state.mergeDeepIn(['items',action.payload.key],$item);
            }
            return $state;
        }
        case `${moduleName}_SAVE_DATA`:{
            if(action.payload.data){
                $state = $state.setIn(['items',action.payload.key,'data'],Immutable.fromJS(action.payload.data));
            }
            if(action.payload.dataSource){
                $state = $state.setIn(['items',action.payload.key,'dataSource'],action.payload.dataSource);
            }
            return $state;
        }
        default:
            return $state;
    }
};







