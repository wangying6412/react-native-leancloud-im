/**
 * actions
 *
 * @module actions
 */

import { createAction } from 'redux-actions';
import AV from 'leancloud-storage';
import types from './types';

import createIMClient from './createIMClient';

import { createChat } from './createChat.js';

/**
 * im初始化
 *
 * @function module:actions#imInit
 * @param {Object} config - Leancloud的appId和appKey及用户ID
 * @param {string} config.appId - Leancloud的appId
 * @param {string} config.appKey - Leancloud的appKey
 * @param {(string|number)} config.ownerId - 用户的ID
 * @example
 *
 * dispatch(imInit({appId:'xxxx',appKey:'xxxxxx',ownerId:1}));
 */
export const imInit = ({appId,appKey,ownerId})=>(dispatch)=>{

    const imInitAction = createAction(types.IM_INIT);

    if(!appId){
        throw new Error('im初始化必须有 Leancloud appId');
    }else if(!appKey){
        throw new Error('im初始化必须有 Leancloud appKey');
    }else if(!ownerId){
        throw new Error('im初始化必须要有ownerId');
    }else{
        AV.init({appId,appKey});
        dispatch(imInitAction({appId,appKey,ownerId}));

        /**
         * 连接到Leancloud
         */
        dispatch(createIMClient(appId,ownerId)).then(({im,realtime})=>{

            dispatch(saveIm(im));

            //im.on('unreadmessages',_onUnreadmessages);    // 当接收到未读提醒
            //im.on('receipt',_onReceipt);                  // 当接收到已读回执
            //im.on('conflict',_onConflict);                // 当在别处登录

            //im.on('message',(message,conversation)=>{     //当接收到消息
                //_onMessage(message,conversation);
            //});

            realtime.on('disconnect' , ()=>dispatch(imStatus('已与服务器断开连接')));   // 离线
            realtime.on('retry'      , ()=>dispatch(imStatus('正在连接服务器')));       // 正在重连
            realtime.on('reconnect'  , ()=>dispatch(imStatus(null)));                   // 已连接
        });
    }
};

/**
 * action creator - 保存IM对象
 *
 * @function module:actions#saveIm
 * @param {Object} payload - im对象
 * @example
 *
 * dispatch(saveIm(im))
 */
export const saveIm = createAction(types.IM_SAVE_IM);

/**
 * action creator - im客户端状态，在线、离线等
 *
 * @function module:actions#imStatus
 * @param {(string|number)} payload - 状态，可以是字符串，或者Error对象
 * @example
 *
 * dispatch(imStatus('正在连接服务器'))
 */
export const imStatus = createAction(types.IM_STATUS);

/**
 * action-网络请求
 *
 * @function module:actions#fetchState
 * @param {(string|error)} state - 请求状态：'fetching','refreshing','done',new Error('xx')
 * @param {string} apiName - api名称，请求哪个接口的状态
 * @example
 *
 * //正常
 * dispatch(fetchState('refreshing','createIMClient'));
 *
 * //出错
 * dispatch(fetchState(new Error('找不到用户！'),'createIMClient'));
 */
export const fetchState = createAction(types.IM_FETCH_STATE,null,(payload,meta)=>meta);

export {
    createChat,
};

