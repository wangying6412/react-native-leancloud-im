/**
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import {
    Text,
    View,
    KeyboardAvoidingView,
} from 'react-native';

import PropTypes from 'prop-types';

import ScrollView from './DuiScrollView';
import styles from '../css';

/**
 * Dui的外部包裹容器
 *
 * @example
 *
    //继承Dui.ScrollView所有props

    <Body delay={0} footer={<Button title="click me" />}>
        <Text>hello world</Text>
    </Body>
 *
 */
class Body extends React.Component{

    static get propTypes(){
        return {
            /**
             * 要显示在顶部的APP状态文字
             *
             * @name props.appStatusText
             * @memberof! Body
             */
            appStatusText : PropTypes.string,
            /**
             * 底部，通常是按钮，按钮组，或者输入框之类
             *
             * @name props.footer
             * @memberof! Body
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




