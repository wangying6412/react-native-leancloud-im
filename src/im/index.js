/**
 * im 模块
 *
 * @module
 */

import {
    createStore,
    applyMiddleware,
    compose,
    bindActionCreators,
} from 'redux';

import rootReducer from './reducers';
import thunk from 'redux-thunk';
import {persistStore, autoRehydrate} from 'redux-persist-immutable';
import {AsyncStorage} from 'react-native';

import {
    im_init
} from './actions';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(rootReducer,composeEnhancers(
    applyMiddleware(thunk),
    autoRehydrate()
));

/**
 * 持久化存储
 */
persistStore(store,{storage: AsyncStorage});

const { dispatch } = store;

export const init = bindActionCreators(im_init,dispatch);




