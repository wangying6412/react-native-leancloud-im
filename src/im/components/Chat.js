/**
 * 展示组件-聊天
 *
 * @author lihaitang
 * @version v0.0.1
 * @private
 */

import React from 'react';
import {
    View,
    ListView,
} from 'react-native';

import Inputer from '../containers/Inputer.js';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import moment from 'moment';
import Message from './Message';
import Immutable from 'immutable';
import {
    TextMessage
} from 'leancloud-realtime';

class Chat extends React.Component{

    static get propTypes(){
        return {};
    }

    constructor(props){
        super(props);
    }

    componentDidMount(){
        this.props._createChat();
    }

    renderRow(guid){

        let message = this.props.$messages.get(guid);

        if(!message){
            console.log(`没有找到消息${ guid }，渲染失败。`);
            return null;
        }

        if(message.get('type') > 1){
            //return _renderCustomMessage(message);
        }

        const { owner,users } = this.props;
        const from = message.get('from');
        const _users = users.reduce((obj,user)=>{
            return Object.assign(obj,{ [user.id] : user });
        },{});
        let user = null;
        if(from === String(owner.get('id'))){
            user = owner;
        }else{
            user = Immutable.fromJS(_users[from]);
        }

        let arrow = from === String(owner.get('id')) ? 'right' : 'left';
        let avatar = user.get('avatar');
        let nickname = user.get('nickname');

        let time = moment(new Date(message.get('createAt')).getTime()).fromNow();

        switch(message.get('type')){
            case TextMessage.TYPE:
                {
                    return (
                        <Message
                        align={ arrow }
                        avatar={ avatar }
                        nickname={ nickname }
                        time={ time }
                        text={ message.get('text') || 'null' }
                        />
                    );
                }
        }
    }

    render(){

        const style = {
            flex: 1,
            backgroundColor: '#FFF',
        };

        return(
            <View style={{ height : '100%' }}>
                <ListView
                    renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                    style={ style }
                    enableEmptySections={ true }
                    dataSource = { this.props.dataSource }
                    renderRow = { this.renderRow.bind(this)}
                />
                <Inputer />
            </View>
        );
    }
}

export default Chat;




