/* global styles */

import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
} from 'react-native';

import AV from '../Leancloud';
import Icon from 'react-native-vector-icons/Ionicons';
import IconOcticons from 'react-native-vector-icons/Octicons';
import Mock from 'mockjs';
import EmojiPicker from '../Emoji';
import * as Animatable from 'react-native-animatable';

import {
    TypedMessage,
    messageType,
    messageField,
    //Realtime,
    TextMessage,
} from 'leancloud-realtime';
import {
    //FileMessage,
    ImageMessage,
    //AudioMessage,
    //VideoMessage,
    LocationMessage,
} from'leancloud-realtime-plugin-typed-messages';
import UploadImage from '../UploadImage';
import { Actions } from 'react-native-router-flux';

class OperationMessage extends TypedMessage {}
// 指定 type 类型，可以根据实际换成其他正整数
messageType(1)(OperationMessage);
// 申明需要发送 op 字段
messageField('op')(OperationMessage);

class InputerButton extends React.Component{

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
                onPress={this._onPress.bind(this)}
            >
            <View style={[styles.im_inputerBtn_icon_faceWrap]}>
            <Icon style={[styles.im_inputerBtn_icon_face]} name="ios-happy-outline" />
            </View>
            </TouchableOpacity>
        );

        let btnPlus = (
            <TouchableOpacity style={[styles.im_inputerBtn,{marginRight:0}]}
                onPress={this._onPress.bind(this)}
            >
            <Icon style={[styles.im_inputerBtn_icon_plus]} name="ios-add" />
            </TouchableOpacity>
        );

        let btnKeyboard = (
            <TouchableOpacity style={[styles.im_inputerBtn, this.props.button==='plus' && {marginRight:0}]}
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

export default class extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            inputHeight : 0,
            text : '',
            textFoucs : false,
            faceHeight : 0,
            plusHeight : 0,
            overLayTop : 0,
            overLayBottom : 50,
        };
    }

    componentDidMount(){
    }

    _onOperationMessage(){
        let message = new OperationMessage();
        message.op = '正在输入...';
        // 设置该条消息为暂态消息
        message.setTransient(true);

        return message;
    }

    _onTextChange(text){

        //leancloud的列表刷新未读数有BUG，暂时取消暂态消息
        //let typing = this._onOperationMessage();
        //this._send(typing);

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

    _toggle(ele,control='show'){

        control==='show' && Keyboard.dismiss();

        let {
            faceWrap,
            plusWrap
        } = this.refs;

        let faceHeight = 240 + 30;
        let plusHeight = global.screenWidth / 2;
        let duration = 250;
        let h = 0;

        //control === 'hide' && (duration = 1);

        switch(ele){
            case 'face':{

                h = control === 'hide' ? 0 : faceHeight;
                control !== 'hide' && this._toggle('plus','hide');
                control === 'hide'&&
                    this.refs.btnFace.setState({
                        showKeyBoard : false
                    });

                let overLayTop = control === 'hide' ? 0 : -(global.screenHeight - faceHeight - 50);
                let overLayBottom = control === 'hide' ? 50 : (faceHeight + 50);

                faceWrap.transitionTo({height : h},duration,'linear');

                this.setState({
                    faceHeight : h,
                    overLayBottom,
                    overLayTop,
                });
                break;
            }
            case 'plus':{
                h = control === 'hide' ? 0 : plusHeight;
                control !== 'hide' && this._toggle('face','hide');
                control === 'hide'&&
                    this.refs.btnPlus.setState({
                        showKeyBoard : false
                    });

                let overLayTop = control === 'hide' ? 0 : -(global.screenHeight - plusHeight - 50);
                let overLayBottom = control === 'hide' ? 50 : (plusHeight + 50);

                plusWrap.transitionTo({height : h},duration,'linear');

                this.setState({
                    plusHeight : h,
                    overLayBottom,
                    overLayTop,
                });
                break;
            }
        }

        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve();
            },duration);
        });
    }

    _onTextMessage(){
        let text = this.state.text;

        if(!text){
            global.toast('请输入消息再发送');
            return false;
        }

        let message = new TextMessage(text);

        message.setNeedReceipt(true);
        this._send(message);
    }

    _onFacePick(face){
        let text = this.state.text + face;
        this._onTextChange(text);
    }

    _onImage(model='launchImageLibrary'){

        let guid = Mock.Random.guid();

        UploadImage({
            model : model,
            url : global.URL.uploadImgCommon,
            onUpload : ((source,fileURL)=>{
                source;
                this._buildImageMessage(fileURL,fileURL,guid).then((msg)=>{
                    this.props._saveMessage(msg);
                });

            }).bind(this)
        }).then((d)=>{
            let {
                imgURL,
                thumb,
                //fileName,
            } = d;

            this._buildImageMessage(thumb,imgURL,guid).then((msg)=>{
                this.props._sendMessage(msg,`${global.username || '您的朋友'}给您发了一张照片`);
            });
        }).catch((err)=>{
            console.log(err);
        });
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
        Actions.MapSelector({
            complete : (mapItem)=>{
                let message = this._buildLocationMessage(mapItem);
                this.props._saveMessage(message);
                this.props._sendMessage(message,`${global.username || '您的朋友'}给您发了一个地理位置`);
            }
        });
    }

    _buildImageMessage(thumb,imgURL,guid){
        let file = AV.File.withURL(Mock.Random.ctitle(), thumb);

        return new Promise((resolve,reject)=>{
            file.save().then(()=>{
                let message = new ImageMessage(file);
                message.setAttributes({
                    thumb,
                    imgURL,
                    guid : guid,
                });
                message.setNeedReceipt(true);
                resolve(message);
            }).catch((err)=>{
                reject(err);
            });
        });
    }

    _buildLocationMessage(mapItem){
        let {
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

        return message;
    }

    _send(msg){
        let m = msg;

        if(m){

            let pushData = false;

            if(m.type <= 0){
                Keyboard.dismiss();
                this.refs.textMessageInput.clear();
                this.setState({
                    text : ''
                });
                this._toggle('face','hide');
                pushData = `${global.username || '您的朋友'}:${m.getText()}`;
            }

            m.setAttributes({
                guid : Mock.Random.guid(),
                avatar : global.avatar,
                username : global.username,
            });

            this.props._saveMessage && this.props._saveMessage(m);
            this.props._sendMessage && this.props._sendMessage(m,pushData);
        }else{
            console.log('未发现消息对象，拒绝发送');
        }
    }

    _cancel(){
        Keyboard.dismiss();
        this._toggle('face','hide');
        this._toggle('plus','hide');
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
                            multiline={true}
                            blurOnSubmit={true}
                            returnKeyType="send"
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
                            onSubmitEditing={this._onTextMessage.bind(this)}
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
                <Animatable.View
                    ref="plusWrap"
                    style={[styles.im_inputerPlus,{
                        height : this.state.plusHeight
                    }]}
                    easing="linear"
                    duration={200}
                >
                    <View style={[styles.row,{
                        minHeight : global.screenWidth / 4,
                        alignItems : 'stretch',
                    }]}>
                        <TouchableOpacity style={[styles.im_inputerPlus_item]}
                            onPress={(()=>{
                                this._onImage('launchImageLibrary');
                            }).bind(this)}
                        >
                            <View>
                                <View style={[styles.im_inputerPlus_iconWrap,{
                                    width : global.screenWidth / 6.5,
                                    height : global.screenWidth / 6.5,
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
                                    width : global.screenWidth / 6.5,
                                    height : global.screenWidth / 6.5,
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
                                <View style={[styles.im_inputerPlus_iconWrap,{
                                    width : global.screenWidth / 6.5,
                                    height : global.screenWidth / 6.5,
                                }]}>
                                    <Icon style={styles.im_inputerPlus_icon} name="ios-pin" />
                                </View>
                                <View style={[styles.center]}>
                                    <Text style={[styles.im_inputerPlus_font]}>位置</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.im_inputerPlus_item]}>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.row,{
                        minHeight : global.screenWidth / 4,
                        alignItems : 'stretch',
                    }]}/>
                </Animatable.View>
                <Animatable.View
                    ref="faceWrap"
                    easing="linear"
                    duration={200}
                    style={[{
                        height:this.state.faceHeight,
                        overflow : 'hidden',
                    }]}
                >
                    <EmojiPicker
                        onPick={this._onFacePick.bind(this)}
                    />
                    <View style={[styles.row,styles.im_faceSendBtnWrap]}>
                        <View style={[styles.flex3]} />
                        <TouchableOpacity style={[styles.im_faceSendBtn]}
                            onPress={this._onTextMessage.bind(this)}
                        >
                            <Text style={[styles.white]}>发送</Text>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
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
