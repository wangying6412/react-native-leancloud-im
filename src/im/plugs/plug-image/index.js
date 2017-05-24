/**
 * react-native-leancloud-im-plug-image
 *
 * react-native-leancloud-im 的图片插件
 */

import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import pickImage from './pickImage';
import AV from 'leancloud-storage';

import {
    ImageMessage
} from'leancloud-realtime-plugin-typed-messages';

const iconStyle = {
    color: '#6f7378',
    fontSize: 50
};

const icons = [<Icon style={iconStyle} name="ios-image" />,<Icon style={iconStyle} name="ios-camera" />];

class imagePlug {

    constructor(name,channel){

        this.name = name;
        this.channel = channel;
        this.icon = icons[channel];
    }

    onPress(saveMessage,sendMessage){
        const models = ['launchImageLibrary','launchCamera'];

        if(!models[this.channel]){
            throw new Error('参数不正确，channel必须为0或1');
        }

        return pickImage({
            model : models[this.channel],
            /*onUpload : ((source,fileURL)=>{
            }).bind(this)*/
        }).then(({ fileName, type, source })=>{

            const file = new AV.File(fileName, { blob : source },type);

            /*let message = new ImageMessage(file);
            message.setAttributes({
                source
            });*/

            //saveMessage(message);

            file.save({
                onprogress:(e)=>{
                    console.log(e.percent);
                },
            }).then((f)=>{
                console.log(f.thumbnailURL(200,200));
                console.log(f.url());
            }).catch((err)=>{
                console.log(err);
            });

        });
            /*.then((file)=>{
            console.log(file);
            [>this._buildImageMessage(file).then((message)=>{
                this.saveMessage(message);
            });<]
        });*/
        /*.then((d)=>{
            let {
                imgURL,
                thumb,
                fileName,
            } = d;

            this._buildMessage(thumb,imgURL).then((message)=>{
                this.sendMessage(message,`${this.nickname || '您的朋友'}给您发了一张照片`);
            });

            return Promise(message);

        }).catch((err)=>{
            return Promise.reject(err);
        });*/
    }
}

export const imageFromAlbum = new imagePlug('照片',0);
export const imageFromCamera = new imagePlug('拍摄',1);

//==============================================================
//  DEV 屏蔽烦人的黄屏
if(console.ignoredYellowBox){
    console.ignoredYellowBox.push('Get current user failed.');
}else{
    console.ignoredYellowBox = [ 'Get current user failed.', ];
}




