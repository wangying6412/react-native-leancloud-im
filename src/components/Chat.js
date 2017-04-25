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
            userId : PropTypes.string,
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
        const userId = this.props.navigation.state.params.userId;

        return(
            <Chat userId={userId} />
        );
    }
}

export default ChatComponent;




