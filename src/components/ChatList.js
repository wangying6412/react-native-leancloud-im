/**
 * 最近聊天列表
 *
 * @module ChatList
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import {
    Body,
    ListItem,
} from './Dui';

import TabBarIcon from './TabBarIcon';

class ChatList extends React.Component{

    static get propTypes(){

    }

    static get defaultProps(){

    }

    static get navigationOptions(){
        return {
            title : 'IM',
            tabBarIcon : (arg)=><TabBarIcon icon="ios-chatbubbles" focused={arg.focused} tintColor={arg.tintColor} />,
            tabBarLabel : '聊天',
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Body refreshing={false} onRefresh={()=>{}}>
                <ListItem title="hello world!!" />
            </Body>
        );
    }
}

export default ChatList;




