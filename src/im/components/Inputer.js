/**
 * 输入框展示组件
 *
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Dimensions,
    Keyboard,
    Animated,
    Easing,
} from 'react-native';

import InputerButton from './InputerButton.js';
import styles from '../css';
import PropTypes from 'prop-types';
import EmojiPicker from '../plugs/Emoji';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class Inputer extends React.Component{

    static get propTypes(){
        return {
            _saveMessage : PropTypes.func,
            _sendMessage : PropTypes.func,
            _onImage : PropTypes.func,
            _onLocation : PropTypes.func,

            _sendTextMessage : PropTypes.func,
        };
    }

    constructor(props){
        super(props);

        this.state = {

            inputHeight : 0,
            text : '',
            textFoucs : false,

            currentPad : null,
            footPadHeight : 0,

            overLayTop : 0,
            overLayBottom : 50,

            error : false,
            errorText : null,
        };
    }

    componentWillMount(){
        this._animationInit();
    }

    _onOperationMessage(){
        /*let message = new OperationMessage();
        message.op = '正在输入...';
        // 设置该条消息为暂态消息
        message.setTransient(true);

        return message;*/
    }

    _onTextChange(text){
        //leancloud的列表刷新未读数有BUG，暂时取消暂态消息
        //let typing = this._onOperationMessage();
        //this.props._send(typing);

        this.setState({
            text,
        });
    }

    _onTextPress(){
        this._toggle('face','hide');
        this._toggle('plus','hide').then(()=>{
            this.refs.textMessageInput.focus();
        });
    }

    _onTextFocus(){
        this.setState({
            textFoucs : true
        });
    }

    _onTextFocusout(){
        this.setState({
            textFoucs : false
        });
    }

    _animationInit(){
        this._footHeightValue = new Animated.Value(0);
        this.footStyle = {
            height : this._footHeightValue,
            overflow : 'hidden',
        };
    }

    _toggle(current,control='show'){

        control==='show' && Keyboard.dismiss();

        const duration = control === 'show' ? 250 : 50;

        let faceHeight = 240 + 30;
        let plusHeight = screenWidth / 2;

        const footHeight = current === 'face' ? faceHeight : plusHeight;
        const h = control === 'hide' ? 0 : footHeight;

        const currentBtn = 'btn' + current.replace(/[a-z]/,w=>w.toUpperCase());
        const otherBtn = current === 'face' ? 'btnPlus' : 'btnFace';

        this.refs[currentBtn].setState({
            showKeyBoard : control === 'show'
        });
        control === 'show' && this.refs[otherBtn].setState({
            showKeyBoard : control !== 'show'
        });

        let overLayTop = control === 'hide' ? 0 : -(screenHeight - footHeight - 50);
        let overLayBottom = control === 'hide' ? 50 : (footHeight + 50);

        this.setState({
            footPadHeight : h,
            overLayBottom,
            overLayTop,
            currentPad : control === 'show' ? current : null,
        });

        return new Promise((resolve)=>{
            Animated.timing(
                this._footHeightValue,
                {
                    toValue : h,
                    duration,
                    easing : Easing.linear,
                }
            ).start(()=>{
                resolve();
            });
        });
    }

    _sendTextMessage(){
        let text = this.state.text;

        if(!text){
            this.setState({
                errorText : '请输入消息再发送',
            });
        }else{

            Keyboard.dismiss();
            this.refs.textMessageInput.clear();
            this.setState({
                text : ''
            });
            this._toggle('face','hide');

            this.props._sendTextMessage(text);
        }
    }

    _onFacePick(face){
        let text = this.state.text + face;
        this._onTextChange(text);
    }

    /*
            {
                "addr":"杭州市江干区富春路701号万象城内(庆春东路口)万象城购物中心B1层",
                "cp":" ",
                "direction":"北",
                "distance":"177",
                "name":"尚泰百货",
                "poiType":"购物",
                "point":{"x":120.22287638178415,"y":30.25785528683576},
                "tag":"购物;超市",
                "tel":"",
                "uid":"22e11407a0cfdeadd4b74e9a",
                "zip":"",
                "checked":true
                "image":"http://xxxxxxx"
            }
    */
    _onLocation(){
        /*Actions.MapSelector({
            complete : (mapItem)=>{
                let message = this._buildLocationMessage(mapItem);
                this.props._saveMessage(message);
                this.props._sendMessage(message,`${global.username || '您的朋友'}给您发了一个地理位置`);
            }
        });*/
    }

    _buildLocationMessage(mapItem){
        mapItem;
        /*let {
            addr,
            name,
            image,
            point,
        } = mapItem;

        let location = new AV.GeoPoint(mapItem.point.y,mapItem.point.x);
        let message = new LocationMessage(location);
        message.setAttributes({
            addr,
            name,
            image,
            point,
            guid : Mock.Random.guid(),
        });
        message.setNeedReceipt(true);

        return message;*/
    }

    _cancel(){
        Keyboard.dismiss();
        this._toggle('face','hide');
        this._toggle('plus','hide');
    }

    _getPlusPad(){

        const { plugs } = this.props;
        const size = {
            minHeight : screenWidth / 4,
            alignItems : 'stretch',
        };

        return <View style={[styles.im_inputerPlus,{
            height : this.state.currentPad === 'plus' ? this.state.footPadHeight : 0,
            overflow : 'hidden',
        }]}>
            <View style={[styles.row,{ minHeight : screenWidth / 4, alignItems : 'stretch'}]}>
                {
                    plugs.map((plug,index)=>(
                        <TouchableOpacity style={[styles.im_inputerPlus_item]}
                            onPress={ ()=>plug.onPress() }
                            key={ `im_inputer_plug_${ index }` }
                        >
                            <View>
                                <View style={[styles.im_inputerPlus_iconWrap,size]}>
                                    { plug.icon }
                                </View>
                                <View style={[styles.center]}>
                                    <Text style={[styles.im_inputerPlus_font]}>{ plug.name }</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
                {
/*
                    <TouchableOpacity style={[styles.im_inputerPlus_item]}
                        onPress={(()=>{
                            this._onImage('launchImageLibrary');
                        }).bind(this)}
                    >
                        <View>
                            <View style={[styles.im_inputerPlus_iconWrap,{
                                width : screenWidth / 6.5,
                                height : screenWidth / 6.5,
                            }]}>
                            <Icon style={styles.im_inputerPlus_icon} name="ios-image" />
                        </View>
                        <View style={[styles.center]}>
                            <Text style={[styles.im_inputerPlus_font]}>照片</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                        <TouchableOpacity style={[styles.im_inputerPlus_item]}
                            onPress={(()=>{
                                this._onImage('launchCamera');
                            }).bind(this)}
                        >
                            <View>
                                <View style={[styles.im_inputerPlus_iconWrap,{
                                    width : screenWidth / 6.5,
                                    height : screenWidth / 6.5,
                                }]}>
                                <Icon style={styles.im_inputerPlus_icon} name="ios-camera" />
                            </View>
                            <View style={[styles.center]}>
                                <Text style={[styles.im_inputerPlus_font]}>拍照</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                        <TouchableOpacity style={[styles.im_inputerPlus_item]}
                            onPress={this._onLocation.bind(this)}
                        >
                            <View>
                                <View style={[styles.im_inputerPlus_iconWrap,size]}>
                                    <Icon style={styles.im_inputerPlus_icon} name="ios-pin" />
                                </View>
                                <View style={[styles.center]}>
                                    <Text style={[styles.im_inputerPlus_font]}>位置</Text>
                                </View>
                            </View>
                        </TouchableOpacity>*/
                }
                <TouchableOpacity style={[styles.im_inputerPlus_item]}>
                </TouchableOpacity>
            </View>
            <View style={[styles.row,{
                minHeight : screenWidth / 4,
                alignItems : 'stretch',
            }]}/>
        </View>;
    }

    _getFacePad(){
        return <View style={[{
            height : this.state.currentPad === 'face' ? this.state.footPadHeight : 0,
            overflow : 'hidden',
        }]}>
            {

                <EmojiPicker
                    onPick={this._onFacePick.bind(this)}
                />
            }
            <View style={[styles.row,styles.im_faceSendBtnWrap]}>
                <View style={[styles.flex3]} />
                <TouchableOpacity style={[styles.im_faceSendBtn]}
                    onPress={this._sendTextMessage.bind(this)}
                >
                    <Text style={[styles.white]}>发送</Text>
                </TouchableOpacity>
            </View>
        </View>;
    }

    render(){
        return(
            <View style={[styles.im_inputerWrap]}>
                <View style={styles.im_inputerBar}>
                    {
                        /*<InputerButton
                        ref="btnVoice"
                        button="voice"
                        inputText={this.refs.textMessageInput}
                        />*/
                    }
                    <View
                        style={[
                            styles.im_inputer_inputWrap, {
                            height: Math.max(styles.im_inputer_input.height, this.state.inputHeight + 5)
                        }]}
                    >
                        <TextInput
                            ref="textMessageInput"
                            style={[styles.im_inputer_input,{
                                height: Math.max(styles.im_inputer_input.height, this.state.inputHeight)
                            }]}
                            autoCorrect={false}
                            multiline={false}
                            blurOnSubmit={true}
                            returnKeyType="send"
                            returnKeyLabel="发送"
                            enablesReturnKeyAutomatically={true}
                            value={this.state.text}
                            onFocus={this._onTextFocus.bind(this)}
                            onBlur={this._onTextFocusout.bind(this)}
                            onChange={(event) => {
                                this.setState({
                                    text: event.nativeEvent.text,
                                    inputHeight: event.nativeEvent.contentSize.height,
                                });
                            }}
                            onChangeText={this._onTextChange.bind(this)}
                            onSubmitEditing={this._sendTextMessage.bind(this)}
                            underlineColorAndroid="transparent"     //Android去掉底边
                        />
                        {
                            !this.state.textFoucs &&
                            <TouchableOpacity
                            style={[
                                styles.im_inputer_overLay, {
                                    height: Math.max(styles.im_inputer_input.height, this.state.inputHeight + 5)
                                }]}
                            onPress={this._onTextPress.bind(this)}
                            />
                        }
                    </View>
                    <InputerButton
                        ref="btnFace"
                        button="face"
                        _onTextPress={this._onTextPress.bind(this)}
                        onPress={()=>{
                            this._toggle('face','show');
                        }}
                    />
                    <InputerButton
                        ref="btnPlus"
                        button="plus"
                        _onTextPress={this._onTextPress.bind(this)}
                        onPress={()=>{
                            this._toggle('plus','show');
                        }}
                    />
                </View>
                <Animated.View style={[this.footStyle]}>
                    { this._getPlusPad() }
                    { this._getFacePad() }
                </Animated.View>
                <TouchableOpacity
                    onPress={this._cancel.bind(this)}
                    style={[
                        {
                            position : 'absolute',
                            top : this.state.overLayTop,
                            right : 0,
                            bottom : this.state.overLayBottom,
                            left : 0,
                        }
                    ]}
                />
            </View>
        );
    }
}

export default Inputer;




