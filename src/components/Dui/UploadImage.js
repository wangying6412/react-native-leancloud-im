/* global $ */

/*
    图片上传组件
    usage:

        import uploadImage from './UploadImage';

        uploadImage({
            url : '',                       //可选 上传路径
            model : 'launchCamera',         //可选，直接启动摄像头
                                            //launchImageLibrary,  //可选，直接进入相册
            onUpload : (source,imgFile)=>{},        //可选
        }).then(()=>{}).catch(()=>{});
*/
import {
    Image
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

const getPicture = (model)=>{

    return new Promise((resolve,reject)=>{
        var options = {
            title: '选择图片',
            cancelButtonTitle : '取消',
            takePhotoButtonTitle : '拍一张照片',
            chooseFromLibraryButtonTitle : '从相册中选择',
            mediaType : 'photo',
            allowsEditing : true,   //允许编辑
            maxWidth : 1000,
            maxHeight : 1000,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        let _cb = (response) => {
            if (response.didCancel) {
                console.log('用户取消了图片选择');
                reject('用户取消了图片选择');
            }
            else if (response.error) {
                console.log('图片选择错误：', response.error);
                reject(response.error);
            }
            else if(response.uri) {
                // you can display the image using either data:
                const source = {uri: 'data:image/jpeg;base64,' + response.data, isstatic: true};
                // uri (on ios)
                // const source = {uri: response.uri.replace('file://', ''), isstatic: true};
                // uri (on android)
                // const source = {uri: response.uri, isstatic: true};
                console.log(response.uri);
                resolve({
                    imgFile : response.uri.replace('file://', ''),
                    imgSource : source
                });
            }
        };

        if(model === 'launchCamera'){
            ImagePicker.launchCamera(options, _cb);
        }else if(model === 'launchImageLibrary'){
            ImagePicker.launchImageLibrary(options, _cb);
        }else{
            ImagePicker.showImagePicker(options, _cb);
        }
    });
};

const uploadImage = (ops,resolve,reject)=>{
    const upload = (imgFile,imgSource)=>{
        let o = ops || {};
        var url = o.url || global.URL.uploadImg;

        let formData = new FormData();
        let key = 'asfd.jpg';

        o.onUpload && o.onUpload(imgSource,imgFile);

        formData.append('image', {
            uri: imgFile,
            type: 'application/octet-stream',
            name: key,
        });
        formData.append('key', key);
        let options = {};
        options.body = formData;
        options.method = 'post';
        options.headers = {
            // 'Accept': 'application/json',
            // 'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + global.token,
        };

        return fetch(url, options).then((response) => {
            response.json().then((json_res)=>{
                console.log(json_res);
                var r = {
                    imgURL : json_res.data.imgURL,
                    thumb : json_res.data.thumb,
                    fileName : json_res.data.fileName,
                };

                Image.prefetch(json_res.data.thumb).then(()=>{
                    resolve(r);
                    console.log('已缓存缩略图。');
                }).catch((err)=>{
                    resolve(r);
                    console.log(err);
                });

                if(r.imgURL){
                    Image.prefetch(r.imgURL).then(()=>{console.log('已缓存大图。');});
                }


            }).catch((err)=>{
                console.log(err);
                global.toast('啊哦，我们的服务器好像出了点问题，您等一下再上传照片吧。');
                reject(err);
            });
        }).catch((err)=>{
            console.log(err);
            reject(err);
        });
    };

    getPicture(ops.model).then((obj)=>{
        //对图片上传的hack，用于token刷新，以共用代码
        $.ajax({
            url : global.URL.getWallet,
            type : 'GET',
        }).then((d)=>{
            if(d.state === 1){
                upload(obj.imgFile,obj.imgSource);
            }else{
                global.toast('上传图片失败，您没有上传权限。');
            }
        }).catch((err)=>{
            console.log(err);
            global.toast('上传图片失败');
            reject(err);
        });
    }).catch((err)=>{
        console.log(err);
        reject(err);
    });
};

module.exports = (ops)=>{
    return new Promise((resolve,reject)=>{
        uploadImage(ops,resolve,reject);
    });
};






//+++++
