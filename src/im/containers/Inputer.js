/**
 * 输入框容器组件
 */

import { connect } from 'react-redux';

import UI from '../components/Inputer.js';

import Chat, {
    currentConversation
} from './Chat';

import {
    //TypedMessage,
    //messageType,
    //messageField,
    TextMessage,
} from 'leancloud-realtime';

import { sendMessage } from '../actions';

import { getCache } from '../cache';

/**
 * 发送文本消息
 *
 * @param {string} text - 文本
 * @private
 */
const _sendTextMessage = (text)=>(dispatch,$getState)=>{

    let message = new TextMessage(text);

    let pushData = false;
    const ownerId = $getState().getIn(['config','ownerId']);
    const nickname = $getState().getIn(['entities','users',ownerId,'nickname']) || '您的朋友';
    message.getText() && (pushData = `${nickname}:${message.getText()}`);

    const conversation = currentConversation;

    const _shouldSend = ()=>{
        dispatch(sendMessage({
            message,conversation,pushData
        }));
    };

    if(conversation){
        _shouldSend();
    }else{
        Chat.on('connected',()=>{
            _shouldSend();
        });
    }
};

const mapStateToProps = ()=>{

    const plugs = getCache('plugs');

    return {
        plugs,
    };
};

const mapDispatchToProps = (dispatch)=>{

    return {
        _sendTextMessage : (text)=>dispatch(_sendTextMessage(text)),
    };
};

const Inputer = connect(mapStateToProps,mapDispatchToProps)(UI);

export default Inputer;






