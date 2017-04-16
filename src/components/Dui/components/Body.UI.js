/* global styles */
/*

        页面根容器
        Body.UI

 */

import React from 'react';
import {
    Text,
    View,
    KeyboardAvoidingView,
} from 'react-native';

import ScrollView from '../dui-scroll-view';

import Owner from '../Owner';

class Body extends React.Component{
    render(){
        return(

            <KeyboardAvoidingView
                behavior="padding"
                style={[{
                    height : global.screenHeight
                }]}
            >
                <View style={[styles.navBarBackface]} />
                {
                    Boolean(this.props.appStatusText)&&
                    <View style={[styles.appStatus]}>
                        <Text>this.props.appStatusText</Text>
                    </View>
                }
                {
                    Owner.loginTest() ||
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






