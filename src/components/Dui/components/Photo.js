/*
 *   会显示加载进度条的image组件
 *
 *   useage :
 *
 *      <Photo
 *          source           = {{uri : 'http://xxxx.xxx.jpg'}}          //图片路径
 *          thumb            = {{url : 'http://xxxx.xxx.thumb.jpg'}}    //缩略图路径，优先显示缩略图
 *          showBigPhoto     = {false}      //是否使用图片查看器（优先查看 source 其次是thumb）
 *          showIcon         = {true}
 *          iconType         = {"CircleFlip"}
 *          iconSize         = {30}
 *          iconColor        = {'#ff0000'}
 *          showProgress     = {true}
 *          progressColor    = {'#ff0000'}
 *          grogressBgcolor  = {'#CCC'}
 *          randomColor      = {true}
 *          showProgressText = {true}
 *
 *          {...image props}//其它props与Image控件相同
 *      />
 */

import React from 'react';
import {
    Modal,
    View,
    Image,
    ProgressViewIOS,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

//import Loading from './Loading.js';
import Mock from 'mockjs';
import Icon from 'react-native-vector-icons/Ionicons';

export class PhotoViewer extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            width : 100,
            height : 100,
            maximumZoomScale : 2,
            visible : false
        };
    }

    _setSize(){
        Image.getSize(this.props.source.uri,(width, height)=>{
            let sw = global.screenWidth;
            let sh = global.screenHeight;
            let w = width < sw ? width : sw;
            let h = height < sh ? height : sh;

            let d = width > height ? width : height;
            let p = width > height ? sw : sh;
            let _dp = d/p;
            let dp = _dp > 1 ? (_dp*2) : 2;

            console.log('已读取图片尺寸：',width,height,dp);
            console.log('调整后的尺寸：',w,h,dp);

            this.setState({
                width : w,
                height : h,
                maximumZoomScale : dp,
            });
        },(err)=>{
            console.log('获取图片尺寸失败：',err);
        });
    }

    show(){
        this.setState({
            visible : true,
        });
        this._setSize();
    }

    hide(){
        this.setState({
            visible : false,
        });
    }

    render(){
        return(
            <Modal
                animationType="slide"
                visible={this.state.visible}
            >
                <ScrollView
                    bouncesZoom={true}
                    maximumZoomScale={this.state.maximumZoomScale}
                    minimumZoomScale={1}
                    style={[{
                        height : global.screenHeight,
                        backgroundColor : '#000',
                    }]}
                >
                    <View
                        style={[{
                            height : global.screenHeight,
                            justifyContent : 'center',
                            alignItems : 'center',
                        }]}
                    >
                        <Photo
                            showBigPhoto={false}
                            randomColor={false}
                            showIcon={false}
                            showProgress={true}
                            source={this.props.source}
                            resizeMode="contain"
                            style={[{
                                width : this.state.width,
                                height : this.state.height,
                                backgroundColor : '#000',
                            }]}
                        />
                    </View>
                </ScrollView>
                <TouchableOpacity
                    style={[{
                        position : 'absolute',
                        top : 20,
                        right : 20,
                        width : 40,
                        height : 40,
                        justifyContent : 'center',
                        alignItems : 'center',
                        backgroundColor : 'rgba(0,0,0,0.3)',
                        borderRadius : 5,
                    }]}
                    onPress={this.hide.bind(this)}
                >
                    <Icon style={[{
                        fontSize : 40,
                        backgroundColor : 'transparent',
                        color : '#FFF',
                    }]} name="ios-close" />
                </TouchableOpacity>
            </Modal>
        );
    }
}

export default class Photo extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading : false,
            progress : 0,
            progressText : '',
            error : false,
            //showIcon : typeof this.props.showIcon === 'undefined' ? true : this.props.showIcon,
            showIcon : false,
            //showProgress : typeof this.props.showProgress === 'undefined' ? true : this.props.showProgress,
            showProgress : false,
            //randomColor : typeof this.props.randomColor === 'undefined' ? true : this.props.randomColor,
            randomColor : false,
            showProgressText : typeof this.props.showProgressText === 'undefined' ? true : this.props.showProgressText,
        };

        this.randomColor = {
            backgroundColor : Mock.Random.color()
        };
    }

    componentDidMound(){
    }

    getColor(){
        if(this.state.randomColor){
            return this.randomColor;
        }else{
            return {
                backgroundColor : 'transparent'
            };
        }
    }

    _onLoadStart(){
        this.setState({
            loading : true,
        });
    }

    _onProgress(e){
        let progress = e.nativeEvent.loaded/e.nativeEvent.total;
        this.setState({
            progress : progress
        });

        if(this.state.showProgressText){
            this.setState({
                progressText : String(Math.round(100 * progress)) + ' %'
            });
        }
    }

    _onLoad(){
        this.setState({
            loading : false
        });
    }

    _onError(){
        this.setState({
            loading : false,
            error : true,
        });

    }

    _onLoadEnd(){
        this.setState({
            loading : false
        });
    }

    _renderProgress(){
        return(
            !this.state.loading ?
            null
            :
            <ProgressViewIOS
                progress={this.state.progress}
                progressTintColor={this.props.progressColor}
                trackTintColor={this.props.grogressBgcolor}
                style={{
                    position : 'absolute',
                    left : 0,
                    right : 0,
                    bottom : 0,
                }}
            />
        );
    }

    _showViewer(){
        this.refs.PhotoViewer.show();
    }

    render(){
        return(
            <Image
                onLoadStart={this._onLoadStart.bind(this)}
                onProgress={this._onProgress.bind(this)}
                onLoad={this._onLoad.bind(this)}
                onError={this._onError.bind(this)}
                onLoadEnd={this._onLoadEnd.bind(this)}

                {...this.props}
                source={this.props.thumb || this.props.source}
                style={[this.getColor(),this.props.style]}
            >
                <TouchableOpacity
                    style={[{
                        flex : 1,
                        alignSelf : 'stretch',
                    }]}
                    disabled={!this.props.showBigPhoto}
                    onPress={this._showViewer.bind(this)}
                >
                    {
                        this.state.showProgress &&
                        this._renderProgress()
                    }
                    {
                        /*!this.state.showIcon ?
                        null
                        :
                        <Loading
                            show={this.state.loading}
                            iconColor={this.props.iconColor || '#ffff00'}
                            iconType={this.props.iconType || 'ChasingDots'}
                            iconSize={this.props.iconSize || 30}
                            text={this.state.progressText}
                        />*/
                    }
                    <PhotoViewer
                        ref="PhotoViewer"
                        source={this.props.source || this.props.thumb}
                    />
                </TouchableOpacity>
            </Image>
        );
    }
}




