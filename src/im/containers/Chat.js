/**
 * 容器组件-聊天
 *
 * @file Chat.js
 * @author lihaitang
 * @version v0.0.1
 * @private
 */

import {
    ListView
} from 'react-native';

import {
    connect
} from 'react-redux';

import {
    createChat,
    getMessages
} from '../actions';

import UI from '../components/Chat';
import Event from '../plugs/event';

let currentConversation = null;

const _createChat = (dispatch,ownProps)=>{
    const { users, conversationId } = ownProps;
    dispatch(createChat(users,conversationId)).then((conversation)=>{
        currentConversation = conversation;
        event.trigger('connected');

        dispatch(getMessages(conversation));
    }).catch(console.warn);
};

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, });
const mapStateToProps = ($state,ownProps)=>{
    const $messages = $state.getIn(['entities','messages']);
    let $conversation = null;

    const ownerId = $state.getIn(['config','ownerId']);

    if(currentConversation){
        $conversation =  $state.getIn(['entities','conversations',currentConversation.id]);
        const messagesArray = $conversation && $conversation.get('messages');
        dataSource = dataSource.cloneWithRows(messagesArray.toJS());
    }

    const owner = $state.getIn(['entities','users',String(ownerId)]);
    const { users } = ownProps;

    return {
        $messages,
        $conversation,
        dataSource,
        owner,
        users,
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


