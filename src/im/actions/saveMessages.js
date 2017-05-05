import { createAction } from 'redux-actions';
import types from './types';
import {
    MessageStatus,
    TextMessage,
} from 'leancloud-realtime';
import {
    ImageMessage,
    LocationMessage,
} from 'leancloud-realtime-plugin-typed-messages';

import { currentConversation } from '../containers/Chat';

/**
 * actions - saveMessage 保存单条消息
 *
 * @function module:actions:saveMessage
 * @param {Object} message - leancloud消息对象
 */
export const saveMessage = createAction(types.IM_SAVE_MESSAGE,message=>{
    return _formatMessage(message);
});

/**
 * actions - saveMessages 保存多条消息
 *
 * @function module:actions:saveMessages
 * @param {Object} args - 参数
 * @param {string} args.cid - conversation的ID
 * @param {Object[]} args.messages - leancloud消息对象数组
 */
export const saveMessages = createAction(types.IM_SAVE_MESSAGE,({cid, messages})=>{
    let _messages = messages.map(message=>_formatMessage(message));
    return {
        cid,
        messages : _messages
    };
});

/**
 * 解析消息类为可存储object对象
 *
 * @private
 * @param {Object} message - 要解析的message对象
 * @returns {Object} message - 已解析的messag对象
 */
let _formatMessage = (message)=>{

    const cid = currentConversation ? currentConversation.id : null;
    let attr = message.getAttributes() || {};
    let m = {
        id : message.id,
        cid : message.cid || cid,
        guid : message.getAttributes().guid,
        type : message.type,
        createAt : message.timestamp && message.timestamp.getTime(),
        deliveredAt : message.deliveredAt && message.deliveredAt.getTime(),
        from : message.from,
        status : message.status,
        errorText : '',
    };

    switch(m.status){
        case MessageStatus.SENDING : {
            m.status = 'sending';
            break;
        }
        case MessageStatus.SENT : {
            m.status = 'send';
            break;
        }
        case MessageStatus.DELIVERED : {
            m.status = 'delivered';
            break;
        }
        case MessageStatus.FAILED : {
            m.status = 'failed';
            break;
        }
        case MessageStatus.NONE : {
            m.status = 'none';
            break;
        }
        default : {
            m.status = 'none';
        }
    }

    if(m.type === TextMessage.TYPE){
        m.text =  message.getText();
    }else if(m.type === ImageMessage.TYPE){
        m.thumb = attr.thumb;
        m.imgURL = attr.imgURL;
    }else if(m.type === LocationMessage.TYPE){
        m.location = {
            addr : attr.addr,
            name : attr.name,
            image : attr.image,
            point : attr.point,
        };
    }else if(m.type > 1){
        m.customData = message.customData;
    }

    return m;
};




