/*

    @name           $name$
    @file           $name$.reducer.js
    @author         $author$
    @createAt       $createAt$

 */

import Immutable from 'immutable';

const $initialState = Immutable.fromJS({
    //是否正在获取数据
    isFetching : false,
    //是否正在刷新
    isRefreshing : false,
    //数据是否过期
    didInvalidate : false,
    //上次更新的时间
    lastUpdated : null,
    //已获取的页数
    fetchedPageCount : null,
    //下一页的url
    nextPageUrl : null,
    //内容
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







