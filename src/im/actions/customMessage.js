
//import { fetchState } from './index.js';

import {
    TypedMessage,
    messageType,
    messageField,
} from 'leancloud-realtime';
import { createAction } from 'redux-actions';

/**
 * 注册自定义消息
 *
 * @function module:actions:registerCustomMessage
 * @param {Object} args - arguments
 * @param {number} args.type - 消息类型值，只能为数字
 * @param {func} args.render - 渲染函数
 * @example
 * ```
    dispatch(registerCustomMessage({
        type : 1,
        render : ()=>{...}
    }));

 * ```
 */
export const registerCustomMessage = ({ type,render })=>(dispatch,$getState)=>{

    const customMessages = $getState().get('customMessages');

    if(typeof type !== 'number'){
        throw new Error('消息type不是数字，注册失败！');
    }else if(type <= 1){
        throw new Error('注册IM消息type值必须大于2，注册失败。');
    }else if(!render){
        throw new Error('没有找到渲染函数，注册自定义消息失败。');
    }else if(customMessages.get(type)){
        throw new Error('消息类型已存在，注册自定义消息失败。');
    }else{
        //注册自定义消息
        class CustomMessage extends TypedMessage {}
        // 指定 type 类型
        messageType(type)(CustomMessage);
        // 申明需要发送 customData 字段
        messageField('customData')(CustomMessage);

        const realtime = $getState().get('realtime');
        /** 如果realtime不存在，当realtime创建时会自动注册已保存的customMessage */
        realtime && realtime.register(CustomMessage);

        const action = createAction(types.IM_REGISTER_CUSTOM_MESSAGE);
        dispatch(action({
            type,
            render,
            instance : CustomMessage
        }));

        return {
            send : (customData,sendToRemote=true)=>{
                _sendCustomMessage(customData,CustomMessage,sendToRemote);
            }
        };
    }
};

/*
 *      发送自定义消息
 */
let _sendCustomMessage = (customData,CustomMessage,sendToRemote)=>{

    if(!customData || !CustomMessage){
        console.warn('参数不完整，无法发送自定义消息。');
        return false;
    }
    if(typeof customData !== 'object'){
        console.warn('customData格式不正确，无法发送自定义消息。');
        return false;
    }

    let message = new CustomMessage();
    message.customData = customData;
    message.setAttributes({
        guid : Mock.Random.guid(),
    });

    _saveMessage(message);
    if(sendToRemote)_sendMessage(message);
};

/*
 *      渲染自定义消息
 */
let _renderCustomMessage = (message)=>{
    let type = message.type;
    let render = customMessages[type] ? customMessages[type].render : null;

    if(render){
        return render(message.customData);
    }else{
        console.log(`没有找到type为${type}的自定义消息，渲染失败。`);
        return null;
    }
};

