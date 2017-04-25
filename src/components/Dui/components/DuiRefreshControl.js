/**
 * dui#scrollView#刷新控制器
 *
 * @memberof module:dui
 * @author         lihaitang
 * @createAt       2017-03-24 11:10:28
 */

import React from 'react';
import {
    Text,
    Animated,
    Easing,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import logo from '../img/logo.png';

import styles from '../css';

export default class DuiRefreshControl extends React.Component{

    componentWillMount(){

        this._iconRotate = this.props.offset.y.interpolate({
            inputRange : [-100,0],
            outputRange : ['0deg','360deg'],
            extrapolateRight : 'clamp'
        });
        this.wrapHeight = this.props.offset.y.interpolate({
            inputRange : [-100,0],
            outputRange : [100,0],
            extrapolateRight : 'clamp'
        });
        this.arrowMargin = this.props.offset.y.interpolate({
            inputRange : [-100,0],
            outputRange : [17,60],
            extrapolate : 'clamp'
        });
        this.arrowRotate = this.props.offset.y.interpolate({
            inputRange : [-120,-100],
            outputRange : ['180deg','0deg'],
            extrapolate : 'clamp'
        });

        this.wrapStyle = {
            height : this.wrapHeight,
        };
        this._iconStyle = {
            transform : [{ rotate : this._iconRotate }]
        };
        this._arrowWrapStyle = {
            marginBottom : this.arrowMargin
        };
        this._arrowStyle = {
            transform : [
                { rotate : this.arrowRotate }
            ]
        };

        //========================
        // loading 状态
        //========================
        this._loadingValue = new Animated.Value(0);
        this._iconLoading = this._loadingValue.interpolate({
            inputRange : [0,100],
            outputRange : ['0deg','360deg'],
        });
        this._iconLoadingStyle = {
            transform : [{ rotate : this._iconLoading }]
        };
    }

    componentDidUpdate(){
        if(this.props.refreshing){
            if(!this.animating){
                this._iconLoadingAnimation();
                this.animating = true;
            }
        }else{
            this._loadingValue.stopAnimation();
            this.animating = false;
        }
    }

    _iconLoadingAnimation(){
        this._loadingValue.setValue(0);
        Animated.timing(
            this._loadingValue,
            {
                toValue : 100,
                duration : 800,
                easing : Easing.linear,
            }
        ).start(this._iconLoadingAnimation.bind(this));
    }

    render(){
        return(
            <Animated.View
                style={[styles.scrollIndicator_wrap,this.wrapStyle,this.props.topOffset]}
            >
                <Animated.View style={[styles.column,styles.flex1,this._arrowWrapStyle]}>
                    <Text style={styles.scrollIndicator_text}>.</Text>
                    <Text style={styles.scrollIndicator_text}>.</Text>
                    <Text style={styles.scrollIndicator_text}>.</Text>
                    <Text style={styles.scrollIndicator_text}>.</Text>
                    <Animated.View style={[styles.scrollIndicator_arraw,this._arrowStyle]}>
                        <Icon name={'ios-arrow-round-down'} size={30} />
                    </Animated.View>
                </Animated.View>
                <Animated.View style={[
                    styles.scrollIndicator_icon,
                    this.props.refreshing ? this._iconLoadingStyle : this._iconStyle
                ]}>
                    <Animated.Image style={[styles.scrollIndicator_icon_image]}
                        source={logo}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

