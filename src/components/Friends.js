/**
 * 联系人列表
 *
 * @module Friends
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import {
    Text,
} from 'react-native';

import TabBarIcon from './TabBarIcon';

class Friends extends React.Component{

    static get propTypes(){

    }

    static get defaultProps(){

    }

    static get navigationOptions(){
        return {
            title : '朋友',
            tabBarIcon : (arg)=><TabBarIcon icon="ios-contacts" focused={arg.focused} tintColor={arg.tintColor} />,
            tabBarLabel : '朋友',
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Text>Hello world22222!</Text>
        );
    }
}

export default Friends;




