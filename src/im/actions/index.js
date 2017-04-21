/**
 * actions
 *
 * @module actions
 */

import { createAction } from 'redux-actions';
import AV from 'leancloud-storage';
import types from './types';

import createIMClient from './createIMClient';

/**
 * im初始化
 *
 * @function actions~imInit
 * @param {Object} appId&appKey&ownerId - Leancloud的appId和appKey及用户ID
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

            im;
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
 * action creator - im客户端状态，在线、离线等
 *
 * @function actions~imStatus
 * @param {string||Object} payload - 状态，可以是字符串，或者Error对象
 * @example
 *
 * dispatch(imStatus('正在连接服务器'))
 */
export const imStatus = createAction(types.IM_STATUS);

/**
 * action-网络请求
 *
 * @function
 * @param {string|error} state - 请求状态：'fetching','refreshing','done',new Error('xx')
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



