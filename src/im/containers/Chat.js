/**
 * 容器组件-聊天
 *
 * @module Chat
 * @author lihaitang
 * @version v0.0.1
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


