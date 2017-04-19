/* global styles */

import React from 'react';
import {
    View,
    Text,
} from 'react-native';
import ListRow from '../ListRow';
import Owner from '../Owner';
import {
    ScrollView
} from '../Dui';

class IMList_ui extends React.Component{

    componentDidUpdate(){
        this.props._setBadge(this.props.allUnReadCount);
    }

    onInitial(){
        return this.props._init();
    }

    _getItem(item){

        if(!item){return null;}

        let userInfo = String(item.creator) === String(Owner.userid) ? item.userInfo : item.creatorInfo;

        if(!userInfo) return null;

        let item_component = (
            <ListRow
                onPress={()=>{this.props._onPress(item);}}
                leftImage={userInfo.avatar.thumb}
                rightText={item.lastMessageAt}
                rightTextColor="#999"
                bottomText={item.lastMessage || '无'}
                badge={item.unreadMessagesCount}
                last={this.props.lastId === item.id}
            >
                <Text style={[styles.black]}>
                    {userInfo.username || userInfo.tel}
                </Text>
            </ListRow>
        );

        return item_component;
    }

    renderHeader(){
        return(
            this.props.statusText?
            <View style={[styles.center,styles.space]}>
                <Text style={[styles.gray]}>{this.props.statusText}</Text>
            </View>
            :
            null
        );
    }


    render(){
        return(
            <ScrollView
                dataSource={this.props.dataSource}

                renderHeader={this.renderHeader.bind(this)}

                refreshing={this.props.loading}
                onRefresh={ this.props._refresh }
                onInitial={this.onInitial.bind(this)}
                //delay={this.props.delay}

                renderRow={
                    this._getItem.bind(this)
                }

                style={[styles.flex1,styles.containerHeight,this.props.style]}
            />
        );
    }
}

export default IMList_ui;



