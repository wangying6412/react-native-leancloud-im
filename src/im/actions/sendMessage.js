
import { fetchState } from './index.js';
import { saveMessage } from './index.js';
import Mock from 'mockjs';

/**
 * 发送消息
 *
 * @function module:actions:sendMessage
 * @param {Object} args - arguments
 * @param {Object} args.message - 消息对象 (TextMessage 或其它类型消息的实例)
 * @param {Object} args.conversation - 当前聊天的Conversation实例
 * @param {Object} [args.pushData] - 选填，要推送的消息对象，对方如果不在聊天界面，会收到推送消息
 */
export const sendMessage = ({message,conversation,pushData})=>(dispatch,$getState)=>{

    if(!message)throw new Error('发送消息失败，没有找到message对象。');
    if(!conversation)throw new Error('发送消息失败，没有找到conversation对象。');

    const ownerId = $getState().getIn(['config','ownerId']);
    const guid = Mock.Random.guid();

    const attr = message.getAttributes() || {};
    !attr.guid && message.setAttributes({
        guid,
    });

    dispatch(saveMessage(message));
    dispatch(fetchState('fetching',{apiName:'sendMessage',guid}));
    return conversation.send(message,{
        transient : message.type === 1,
        receipt : message.type < 1,
        pushData : {
            alert    : pushData || '您有一条新的消息',
            badge    : 'Increment',
            _profile : 'dev',
            channle  : 'IM',
            from     : String(ownerId),
        },
    }).then((d)=>{
        dispatch(fetchState('done',{apiName:'sendMessage',guid:d.getAttributes().guid}));
        dispatch(saveMessage(d));
        Promise.resolve(d);
    }).catch((err)=>{
        dispatch(fetchState(new Error('发送消息失败。'),{apiName:'sendMessage',guid}));
        Promise.reject(err);
    });
};

