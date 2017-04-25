/**
 * 创建聊天
 */

import { createAction } from 'redux-actions';
import types from './types';
import { imStatus } from './index';

/**
 * 保存conversation
 *
 * @function module:actions#saveConversation
 * @param {object} params - 用户ID及conversationId
 * @param {(string|number)} params.userId - 要聊天对象的ID
 * @param {string} params.conversationId
 * @example
 *
        dispatch(saveConversation({
            userId,
            conversation : remoteConversation
        }));
 */
export const saveConversation = createAction(types.IM_SAVE_CONVERSATION);

/**
 * 创建聊天
 *
 * @function module:actions#createChat
 * @param {(string|number)} userId  - 对方的ID
 * @param {string} conversationId  - conversation.id
 * @returns {Promise} promise - 返回promise
 */
export const createChat  = (userId,conversationId)=>(dispatch,$getState)=>{

    const ownerId = $getState().getIn(['config','ownerId']);
    const im = $getState().get('imClient');

    if(userId === ownerId){
        return Promise.reject(new Error('创建聊天失败，您不能和自己聊天。'));
    }

    let _fn = (conversationId)=>dispatch(createConversation(userId,conversationId));

    if(conversationId){
        return _fn(conversationId);
    }else{

        const conversationId = $getState().getIn(['entities','conversation',userId,'id']);

        if(conversationId){
            return _fn(conversationId);
        }else{
            return _findConversationInRemote();
        }
    }

    /**
     * 从远程按userId查找conversation
     *
     * @private
     * @returns {Promise} promise - 返回promise
     */
    function _findConversationInRemote(){

        const query = im.getQuery();
        return query.find().then((items)=>{
            let remoteConversation = items.find((obj)=>{
                let str = ',' + obj.members.join(',') + ',';
                return new RegExp(',' + userId + ',').test(str);
            });

            if(remoteConversation){

                dispatch(saveConversation({
                    userId,
                    conversation : remoteConversation
                }));

                return _fn(remoteConversation.id);
            }else{
                console.log('没有找到conversation，开始新建');
                return _fn(null);
            }

        }).catch((err)=>{
            return Promise.reject(err);
        });
    }
};

/**
 * 创建conversation
 *
 * @function module:actions#createConversation
 * @param {(string|number)} userId  - 对方的ID
 * @param {string} conversationId  - conversation.id
 * @returns {Promise} promise - 返回promise
 */
export const createConversation = (userId,conversationId)=>(dispatch,$getState)=>{

    const im = $getState().get('imClient');

    let ops = {
        //对话的初始成员列表。在对话创建成功后，这些成员会收到和邀请加入对话一样的相应通知。
        members : [String(userId)],
        //是否创建唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话。该值默认为 false。
        unique : true,
        //保存userInfo
        userId : userId,
        //自定义属性
        //location : '42.86335,140.6843287',
    };

    const _cb = (conversation)=>{

        dispatch(imStatus({ chating : true }));
        dispatch(saveConversation({
            userId,
            conversation
        }));

        //设为已读
        //conversation.markAsRead().then(IMList.save).catch(console.log);
    };

    // 创建与对方的对话
    if(!conversationId){
        return im.createConversation(ops).then(_cb).catch((err)=>{
            console.log('创建对话失败：',err);
        });
    }else{
        return im.getConversation(conversationId).then(_cb).catch((err)=>{
            console.log('从远程获取conversation失败。',err);
        });
    }
};





