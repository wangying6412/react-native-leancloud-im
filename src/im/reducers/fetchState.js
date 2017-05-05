/**
 * reducer - 网络请求状态
 *
 */

import Immutable from 'immutable';
import types from '../actions/types';

const $initialStateItem = Immutable.fromJS({
    isFetching : false,
    isRefresing : false,
    didInvalidate : false,
    lastUpdated : null,
    fetchedPageCount : 0,
    nextPageUrl : null,
    error : 'false',
    errorText : null,
});
const $initialState = Immutable.fromJS({});

export default function fetchState($state=$initialState,action){
    const {
        type,
        payload,
        error,
        meta
    } = action;

    switch(type){

        /**
         * reducer - 网络请求状态
         *
         * @memberof module:reducers
         */
        case types.IM_FETCH_STATE:{

            const apiName = meta === 'object' ? meta.apiName : meta;

            if(error){
                const errorText = payload.message;
                const $stateItem = $initialStateItem.merge({
                    error : true,
                    errorText,
                });

                return $state.set(apiName,$stateItem);
            }else{
                let stateItem = {
                    error : 'false',
                    errorText : null,
                };

                switch(payload){
                    case 'refreshing':
                        stateItem = {
                            isFetching : true,
                            isRefresing : true,
                            fetchedPageCount : 0,
                        };
                        break;
                    case 'fetching':
                        stateItem = {
                            isFetching : true,
                            isRefresing : false,
                        };
                        break;
                    case 'done':
                        stateItem = {
                            isFetching : false,
                            isRefresing : false,
                            didInvalidate : false,
                            lastUpdated : Date.now(),
                            fetchedPageCount : $state.getIn([apiName,'fetchedPageCount'])+1,
                        };
                        break;
                }

                if(!$state.get(apiName))$state = $state.set(apiName,$initialStateItem);
                return $state.mergeIn([apiName],stateItem);
            }
        }
        default:
            return $state;
    }
}








