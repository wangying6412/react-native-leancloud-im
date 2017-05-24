
import { Platform } from 'react-native';
import ImagePicker from 'react-native-image-picker';

/**
 * 图片选择器
 *
 * @param {string} [model] - 图片选择方式，图库或者相机，如果不提供该值，将会弹出actionSheet窗口
 * @returns {Object} - 返回Promese 结果包含base64及本地url的对象
 * @example
 *
 *  pickImage({ model : 'launchImageLibrary' }).then(d=>console.log(d));
 *  //{ imgFile }
 *
 */
export default function({ model }){

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
            if(response.didCancel){
                console.log('用户取消了图片选择');
                reject('用户取消了图片选择');
            }else if(response.error) {
                console.log('图片选择错误：', response.error);
                reject(response.error);
            }else if(response.uri) {

                const { OS } = Platform;

                let source = null;
                let { uri,fileSize,width,height,type,fileName,path,data } = response;

                /*source = {uri: `data:${type};base64${data}`, isstatic: true};
                uri = response.uri.replace('file://', '');*/

                if( OS === 'ios' ){
                    source = {uri: 'data:image/jpeg;base64,' + response.data, isstatic: true};
                    uri = response.uri.replace('file://', '');
                }else if( OS === 'android' ){
                    source = {uri: response.uri, isstatic: true};
                }

                resolve({ uri, source,fileSize,width,height,type,fileName,path,data });
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
}




