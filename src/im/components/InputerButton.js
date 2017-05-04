/**
 * 输入框按钮展示组件
 *
 * @author lihaitang
 * @version v0.0.1
 */
import React from 'react';
import {
    TouchableOpacity,
    View,
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';
import IconOcticons from 'react-native-vector-icons/Octicons';
import styles from '../css';

class InputerButton extends React.Component{

    static get propTypes(){
        return {
            onPress : PropTypes.func.isRequired,
            _onTextPress : PropTypes.func,
            button : PropTypes.string,
        };
    }

    constructor(props){
        super(props);

        this.state = {
            showKeyBoard : false,
        };
    }

    _onPress(){
        this.setState({
            showKeyBoard : true
        },()=>{
            this.props.onPress && this.props.onPress();
        });
    }

    _onKeyboard(){
        this.setState({
            showKeyBoard : false
        },()=>{
            //this.props.inputText && this.props.inputText.focus();
            this.props._onTextPress && this.props._onTextPress();
        });
    }

    _getButton(){
        let btnVoice = (
            <TouchableOpacity style={[styles.im_inputerBtn]}
                activeOpacity={1}
                onPress={this._onPress.bind(this)}
            >
            <Icon style={[styles.im_inputerBtn_icon,{
                marginRight : 2,
                transform : [{
                    rotateZ : '90deg',
                }]
            }]} name="ios-wifi" />
            </TouchableOpacity>
        );

        let btnFace = (
            <TouchableOpacity style={[styles.im_inputerBtn]}
                activeOpacity={1}
                onPress={this._onPress.bind(this)}
            >
            <View style={[styles.im_inputerBtn_icon_faceWrap]}>
            <Icon style={[styles.im_inputerBtn_icon_face]} name="ios-happy-outline" />
            </View>
            </TouchableOpacity>
        );

        let btnPlus = (
            <TouchableOpacity style={[styles.im_inputerBtn,{marginRight:0}]}
                activeOpacity={1}
                onPress={this._onPress.bind(this)}
            >
            <Icon style={[styles.im_inputerBtn_icon_plus]} name="ios-add" />
            </TouchableOpacity>
        );

        let btnKeyboard = (
            <TouchableOpacity style={[styles.im_inputerBtn, this.props.button==='plus' && {marginRight:0}]}
                activeOpacity={1}
                onPress={this._onKeyboard.bind(this)}
            >
            <IconOcticons style={[styles.im_inputerBtn_icon_keyboard]} name="keyboard" />
            </TouchableOpacity>
        );

        let b = '';
        switch(this.props.button){
            case 'voice' : {
                b = btnVoice;
                break;
            }
            case 'face' : {
                b = btnFace;
                break;
            }
            case 'plus' : {
                b = btnPlus;
                break;
            }
        }

        if(this.state.showKeyBoard){
            return btnKeyboard;
        }else{
            return b;
        }
    }

    render(){
        return this._getButton();
    }
}

export default InputerButton;




