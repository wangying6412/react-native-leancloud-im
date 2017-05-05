
//import { fetchState } from './index.js';

import {
    TypedMessage,
    messageType,
    messageField,
} from 'leancloud-realtime';
import { createAction } from 'redux-actions';
import { saveMessage } from './saveMessages';
import { sendMessage } from './sendMessage';
import types from './types';

/**
 * 注册自定义消息
 *
 * @function module:actions#registerCustomMessage
 * @param {Object} args - 参数
 * @param {number} args.type - 消息类型值，只能为数字
 * @param {func} args.render - 渲染函数
 * @example
 *
 *  dispatch(registerCustomMessage({
 *      type : 1,
 *      render : ()=>{...}
 *  }));
 */
export const registerCustomMessage = ({ type,render })=>(dispatch,$getState)=>{


    if(typeof type !== 'number'){
       throw new Error('消息type不是数字，注册失败！');
    }else if(type <= 1){
        throw new Error('注册IM消息type值必须大于2，注册失败。');
    }else if(!render){
        throw new Error('没有找到渲染函数，注册自定义消息失败。');
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
                dispatch(_sendCustomMessage(customData,CustomMessage,sendToRemote));
            }
        };
    }
};

/**
 * 发送自定义消息
 *
 * @function module:actions#_sendCustomMessage
 * @private
 * @param {Object} args - arguments
 * @param {Object} args.customData - 自定义数据
 * @param {Object} args.CustomMessage - 自定义消息的实例
 * @param {bool} [args.sendToRemote] - 是否需要发送到远程(或者是自己看看，并不发送)
 */
export const _sendCustomMessage = ({customData,CustomMessage,sendToRemote})=>(dispatch)=>{

    if(!customData || !CustomMessage){
        throw new Error('参数不完整，无法发送自定义消息。');
    }

    if(typeof customData !== 'object'){
        throw new Error('customData格式不正确，无法发送自定义消息。');
    }

    const message = new CustomMessage();
    message.customData = customData;

    !sendToRemote && dispatch(saveMessage(message));
    sendToRemote && dispatch(sendMessage(message));
};

/**
 * 渲染自定义消息
 *
 * @function module:actions#renderCustomMessage
 * @param {Object} message - 消息对象
 * @returns {Object} component - 返回react节点对象
 */
export const renderCustomMessage = (message)=>(dispatch,$getState)=>{
    const { type } = message;
    const render = $getState().getIn(['customMessages','type']);

    if(!render)throw new Error(`没有找到type为${type}的自定义消息，渲染失败。`);
    return render(message.customData);
};





