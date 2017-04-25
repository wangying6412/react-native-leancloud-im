/**
 * 创建im对象
 */

import {
    Realtime,
} from 'leancloud-realtime';
import {
    TypedMessagesPlugin,
} from 'leancloud-realtime-plugin-typed-messages';
import {
    fetchState
} from './index';

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
export default (appId,ownerId)=>(dispatch)=>{

    /**
     * 创建实时通讯实例
     */
    const realtime = new Realtime({
        appId : appId,
        plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
    });

    dispatch(fetchState('fetching','createIMClient'));

    // 用用户ID作为clientId，获取 IMClient 对象实例
    return realtime.createIMClient(String(ownerId)).then(function(im){

        dispatch(fetchState('done','createIMClient'));

        return Promise.resolve({im,realtime});

    }).catch((err)=>{
        dispatch(fetchState(err,'createIMClient'));
    });
};








