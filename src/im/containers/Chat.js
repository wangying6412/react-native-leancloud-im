/**
 * 容器组件-聊天
 *
 * @file Chat.js
 * @author lihaitang
 * @version v0.0.1
 * @private
 */

import {
    connect
} from 'react-redux';

import {
    createChat
} from '../actions';

import UI from '../components/Chat';
import Event from '../plugs/event';

let currentConversation = null;

const _createChat = (dispatch,ownProps)=>{
    const { members, conversationId } = ownProps;
    dispatch(createChat(members,conversationId)).then((conversation)=>{
        currentConversation = conversation;
        event.trigger('connected');
    });
};

const mapStateToProps = ($state)=>{
    $state;
    return {
        currentConversation,
    };
};

const mapDispatchToProps = (dispatch,ownProps)=>{
    return {
        _createChat : ()=>_createChat(dispatch,ownProps),
    };
};

const Chat = connect(mapStateToProps,mapDispatchToProps)(UI);

const event =  new Event(Chat);

export default Chat;
export {
    currentConversation
};


