/*

 对 ActionSheetIOS 的重新封装

    usage
        ActionSheet({
            title : 'are you sure?'
            'yes' : ()=>{},
            'notSure' : ()=>{},
            'onCancel' : ()=>{}
        });

*/

import {
    ActionSheetIOS
} from 'react-native';

module.exports = (ops={})=>{

    let buttons = Object.keys(ops);
    buttons = buttons.filter((str)=>(str!=='title'));
    buttons = buttons.filter((str)=>(str!=='onCancel'));
    let fns = [];
    buttons.forEach((k)=>{
        fns.push(ops[k]);
    });

    buttons.push('取消');
    let options = {
        options                : buttons,
        cancelButtonIndex      : buttons.length-1,
    };
    if(ops.title){options.title = ops.title;}
    ActionSheetIOS.showActionSheetWithOptions(
        options,
        (buttonIndex) => {
            if(buttonIndex !== buttons.length - 1){
                fns[buttonIndex]();
            }else{
                ops.onCancel && ops.onCancel();
            }
        });
};





