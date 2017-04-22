/**
 * Dui的外部包裹容器
 *
 * @module Body
 * @author lihaitang
 * @version v0.0.1
 * @example
 *
    //继承Dui.ScrollView所有props

    <Body delay={0} footer={<Button title="click me" />}>
        <Text>hello world</Text>
    </Body>
 *
 */

import React,{
    PropTypes
} from 'react';
import {
    Text,
    View,
    KeyboardAvoidingView,
} from 'react-native';

import ScrollView from './DuiScrollView';
import styles from '../css';

class Body extends React.Component{

    static get propTypes(){
        return {
            /**
             * 要显示在顶部的APP状态文字
             */
            appStatusText : PropTypes.string,
            /**
             * 底部，通常是按钮，按钮组，或者输入框之类
             */
            footer : PropTypes.element
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <KeyboardAvoidingView
                behavior="padding"
                style={styles.bodyWrapper}
            >
                {
                    Boolean(this.props.appStatusText)&&
                    <View style={[styles.appStatus]}>
                        <Text>this.props.appStatusText</Text>
                    </View>
                }
                {
                    <ScrollView
                        {...this.props}
                    >
                        {this.props.children}
                    </ScrollView>
                }
                {
                    this.props.footer &&
                    <View style={[styles.center]}>
                        {this.props.footer}
                    </View>
                }
            </KeyboardAvoidingView>
        );
    }
}

export default Body;



