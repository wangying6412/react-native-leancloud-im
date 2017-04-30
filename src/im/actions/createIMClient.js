/**
 * 创建im对象
 */

import {
    Realtime,
} from 'leancloud-realtime';
import {
    TypedMessagesPlugin,
} from 'leancloud-realtime-plugin-typed-messages';
import { createAction } from 'redux-actions';
import {
    fetchState
} from './index';
import types from './types';

/**
 * 保存realtime对象
 *
 * @function module:actions#saveRealtime
 * @param {object} realtime - realtime实例
 * @example
 *
        dispatch(saveRealtime(realtime));
 */
export const saveRealtime = createAction(types.IM_SAVE_REALTIME);

/**
 * 创建im对象
 *
 * @function module:actions#createIMClient
 * @param {string} appId - leancloud的appId
 * @param {string} ownerId - 当前用户的ID
 * @example
 *
 * dispatch( createIMClient( 'xxxx' , 'xxx' ) ).then((im)=>{
 *      //doSomething
 * });
 *
 */
export const createIMClient = (appId,ownerId)=>(dispatch,$getState)=>{
    if(!appId)throw new Error('createIMClient必须有appId');
    if(!ownerId)throw new Error('createIMClient必须有ownerId');

    /**
     * 创建实时通讯实例
     */
    const realtime = new Realtime({
        appId : appId,
        plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
    });

    dispatch(saveRealtime(realtime));
    dispatch(fetchState('fetching','createIMClient'));

    /** 如果realtime存在，注册已保存的customMessage */
    const customMessages = $getState().get('customMessages');
    customMessages && customMessages.forEach((i,item)=>{
        const { instance } = item;
        realtime.register(instance);
    });

    // 用用户ID作为clientId，获取 IMClient 对象实例
    return realtime.createIMClient(String(ownerId))
        .then(function(im){

        dispatch(fetchState('done','createIMClient'));

        return Promise.resolve({im,realtime});

    }).catch((err)=>{
        dispatch(fetchState(err,'createIMClient'));
    });
};








