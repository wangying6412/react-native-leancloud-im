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

import Chat from '../components/Chat';

const mapStateToProps = ($state)=>{
    $state;
    return {};
};

const mapDispatchToProps = (dispatch)=>{
    return {
        dispatch,
        createChat,
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Chat);


