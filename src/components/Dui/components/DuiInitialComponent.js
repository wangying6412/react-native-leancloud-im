/*

    @name           DuiInitialComponent
    @author         lihaitang
    @createAt       2017-03-29 11:10:28

 */

const propTypes = {
    status : React.PropTypes.string.isRequired,
    onHide : React.PropTypes.func,
};

import React from 'react';
import {
    Animated,
    Text,
} from 'react-native';

import logo from '../img/logo.png';

import {
    options
} from '../Dui.config.js';

export default class DuiInitialComponent extends React.Component{

    static get propTypes(){
        return propTypes;
    }

    static get defaultProps(){
        return {
            onHide : ()=>{}
        };
    }

    componentWillMount(){
        this.initialIconAnimatedValue = new Animated.Value(0);
        this.initialWrapAnimatedValue = new Animated.Value(0);

        const size = 120;
        const iconWrapSize = size * 0.6;
        const iconSize = size * 0.3;
        const rotateY = this.initialIconAnimatedValue.interpolate({
            inputRange : [0,100],
            outputRange : ['0deg','360deg'],
        });
        const height = this.initialWrapAnimatedValue.interpolate({
            inputRange : [0,100],
            outputRange : [size,0],
            extrapolateRight : 'clamp',
        });
        this._style = {
            wrap : {
                justifyContent : 'center',
                alignItems : 'center',
                height,
                overflow : 'hidden',
            },
            iconWrap : {
                width : iconWrapSize,
                height : iconWrapSize,
                borderRadius : iconWrapSize/2,
                overflow : 'hidden',
                justifyContent : 'center',
                alignItems : 'center',
                backgroundColor : '#666',
            },
            icon : {
                width : iconSize,
                height : iconSize,
                transform : [
                    { rotateY : rotateY }
                ]
            },
            text : {
                fontSize : 12,
                color : '#999',
                marginTop : 10,
            }
        };
    }

    componentDidMount(){
        this.initialIconAnimation();
    }

    componentWillUnmount(){
        this.initialWrapAnimatedValue.stopAnimation();
    }

    shouldComponentUpdate(nextProps){
        nextProps.status === 'initialed' && this.initialHide();
        return false;
    }

    initialHide(){
        this.initialIconAnimatedValue.stopAnimation();
        Animated.timing(
            this.initialWrapAnimatedValue,
            {
                toValue : 150,
                duration : 300,
            }
        ).start(this.props.onHide);
    }

    initialIconAnimation(){
        const animation = ()=>{
            this.initialIconAnimatedValue.setValue(0);
            Animated.timing(
                this.initialIconAnimatedValue,
                {
                    toValue : 100,
                    duration : 500,
                    delay : options.navAnimateDuration,
                }
            ).start(animation.bind(this));
        };
        animation();
    }

    render(){
        return(
            <Animated.View style={[this._style.wrap,this.props.style]}>
                <Animated.View style={[this._style.iconWrap]}>
                    <Animated.Image source={logo} style={[this._style.icon]} />
                </Animated.View>
                <Text style={[this._style.text]}>请稍候,正在加载中...</Text>
            </Animated.View>
        );
    }
}




