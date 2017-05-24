/**
 * 最近聊天列表
 *
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

        const { navigate } = this.props.navigation;

        const user = {
            id : 2,
            nickname : '路人甲',
            avatar : 'https://img6.bdstatic.com/img/image/smallpic/chongwuxiaoouheihe.jpg',
        };

        return(
            <Body refreshing={false} onRefresh={()=>{}}>
                <ListItem title="hello world!!" onPress={()=>navigate('Chat',{user})} />
            </Body>
        );
    }
}

export default ChatList;




