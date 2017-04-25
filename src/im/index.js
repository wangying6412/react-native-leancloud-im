/**
 * im 主模块，入口模块
 *
 * @file
 * @module im
 */

import React from 'react';
import {
    createStore,
    applyMiddleware,
    compose,
    bindActionCreators,
} from 'redux';

import rootReducer from './reducers';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist-immutable';
import {REHYDRATE} from 'redux-persist-immutable/constants';
import createActionBuffer from 'redux-action-buffer';
import {AsyncStorage} from 'react-native';

import ChatComponent from './containers/Chat';

import {
    imInit
} from './actions';

import {
    Provider
} from 'react-redux';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(
        thunk,

        /** 用于确保所有action在persistStore加载后发送 */
        createActionBuffer(REHYDRATE)
    ),
    autoRehydrate()
));

/**
 * 持久化存储
 */
persistStore(store,{
    blacklist : ['imClient'],
    storage: AsyncStorage
});

const { dispatch } = store;

export const init = bindActionCreators(imInit,dispatch);

export const Chat = (props)=><Provider store={store}><ChatComponent {...props} /></Provider>;




