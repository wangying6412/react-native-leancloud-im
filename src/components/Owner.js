/**
 * 用户中心
 *
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import {
    Text,
} from 'react-native';

import TabBarIcon from './TabBarIcon';

class Owner extends React.Component{

    static get propTypes(){

    }

    static get defaultProps(){

    }

    static get navigationOptions(){
        return {
            title : 'Owner',
            tabBarIcon : (arg)=><TabBarIcon icon="ios-contact" focused={arg.focused} tintColor={arg.tintColor} />,
            tabBarLabel : '我',
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Text>Hello world! 33333</Text>
        );
    }
}

export default Owner;




