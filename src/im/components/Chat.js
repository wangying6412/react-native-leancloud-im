/**
 * 展示组件-聊天
 *
 * @author lihaitang
 * @version v0.0.1
 * @private
 */

import React from 'react';
import {
    ScrollView,
    View,
} from 'react-native';

import Inputer from './Inputer.js';

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
            <View style={{ height : '100%' }}>
                <ScrollView style={{flex:1}} />
                <Inputer />
            </View>
        );
    }
}

export default Chat;




