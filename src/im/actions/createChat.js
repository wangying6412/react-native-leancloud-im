/**
 * 创建聊天
 */

import { createAction } from 'redux-actions';
import types from './types';
import { imChating } from './index';
import Immutable from 'immutable';
import { saveUsers } from './index.js';

/**
 * 保存conversation
 *
 * @function module:actions#saveConversation
 * @param {object} conversation - conversation
 * @example
 *
        dispatch(saveConversation(conversation));
 */
export const saveConversation = createAction(types.IM_SAVE_CONVERSATION,(conversation)=>{
    const {
        id,
        members,
        creator,
        lastMessage,
        createdAt,
        updatedAt,
        lastMessageAt,
        unreadMessagesCount
    } = conversation;
    return {
        id,
        members,
        creator,
        createdAt,
        updatedAt,
        lastMessageAt,
        unreadMessagesCount,
        lastMessage : lastMessage ? lastMessage.id : null,
    };
});

/**
 * 创建聊天
 *
 * @function module:actions#createChat
 * @param {Object[]} users  - 聊天对象
 * @param {string} conversationId  - conversation.id
 * @returns {Promise} promise - 返回promise
 */
export const createChat  = (users,conversationId)=>(dispatch,$getState)=>{

    const ownerId = $getState().getIn(['config','ownerId']);
    const im = $getState().get('imClient');

    let error = null;
    const members = users.map(user=>{

        if(!user.id){
            error = '参数错误：用户对象必须包含id';
        }else if(!user.avatar){
            error = '参数错误：用户必须有头像';
        }else if(!user.nickname){
            error = '参数错误：用户必须有昵称';
        }

        return String(user.id);
    });

    if(Immutable.List(members).contains(ownerId)){
        error = '创建聊天失败，您不能和自己聊天。';
    }

    if(error){
        console.log(error);
        return Promise.reject(new Error(error));
    }

    dispatch(saveUsers(users));

    let ops = {
        //对话的初始成员列表。在对话创建成功后，这些成员会收到和邀请加入对话一样的相应通知。
        members,
        //是否创建唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话。该值默认为 false。
        unique : true
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

    function _cb(conversation){
        dispatch(imChating(true));
        dispatch(saveConversation(conversation));
        return Promise.resolve(conversation);
        //设为已读
        //conversation.markAsRead().then(IMList.save).catch(console.log);
    }

};






