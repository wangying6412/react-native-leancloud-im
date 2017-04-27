/**
 * 展示组件-聊天
 *
 * @author lihaitang
 * @version v0.0.1
 * @private
 */

import React from 'react';
import {
    Text,
} from 'react-native';

class Chat extends React.Component{

    static get propTypes(){
        return {};
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        const { members, conversationId, dispatch, createChat } = this.props;

        dispatch(createChat(members,conversationId));
    }

    render(){
        return(
            <Text> Chat - 展示组件-聊天 </Text>
        );
    }
}

export default Chat;




