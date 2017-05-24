/**
 * 聊天页面
 *
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import PropTypes from 'prop-types';

import {
    Chat
} from '../im';

class ChatComponent extends React.Component{

    static get propTypes(){
        return {
            user : PropTypes.object,
        };
    }

    static get navigationOptions(){
        return {
            title : 'Chat'
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        const user = this.props.navigation.state.params.user;

        return(
            <Chat users={[user]} />
        );
    }
}

export default ChatComponent;




