
import 'react';

import { store,realtime } from './mockStore.js';
import { messageType, messageField } from 'leancloud-realtime';
const { dispatch } = store;

const mockSaveMessage = jest.fn(()=>jest.fn());
const mockSendMessage = jest.fn(()=>jest.fn());
jest.mock('../saveMessages',()=>({
    saveMessage : mockSaveMessage
}));
jest.mock('../sendMessage',()=>({
    sendMessage : mockSendMessage
}));

describe('对 actions - customMessage 的测试',()=>{

    describe('对 registerCustomMessage (注册自定义消息) 的测试',()=>{

        const { registerCustomMessage } = require('../customMessage.js');

        test('参数缺失应该报错',()=>{

            expect(registerCustomMessage({
                type : 'asdf'
            })).toThrowError('消息type不是数字，注册失败！');

            expect(registerCustomMessage({
                type : -123
            })).toThrowError('注册IM消息type值必须大于2，注册失败。');

            expect(registerCustomMessage({
                type : 2,
                render : undefined,
            })).toThrowError('没有找到渲染函数，注册自定义消息失败。');

        });

        test('功能测试',()=>{

            const { send } = dispatch(registerCustomMessage({type : 2,render:()=>{}}));

            expect(messageType.mock.calls[0][0]).toBe(2);
            expect(messageField.mock.calls[0][0]).toBe('customData');
            expect(realtime.register.mock.calls.length).toBe(1);

            expect(typeof send).toBe('function');
        });
    });

    describe('对 _sendCustomMessage 的测试',()=>{

        const { _sendCustomMessage } = require('../customMessage');
        class CustomMessage {
            getAttributes(){ }
        }
        test('参数不完整应该报错',()=>{
            expect(_sendCustomMessage({})).toThrowError('参数不完整，无法发送自定义消息。');
            expect(_sendCustomMessage({
                customData : 123,
                sendToRemote : true,
                CustomMessage
            })).toThrowError('customData格式不正确，无法发送自定义消息。');
        });

        test('功能测试 > 发送到远程',()=>{

            dispatch(_sendCustomMessage({
                customData : {a:123},
                sendToRemote : true,
                CustomMessage
            }));

            expect(mockSendMessage.mock.calls[0][0].customData).toEqual({a:123});
        });

        test('功能测试 > 不发送到远程',()=>{

            dispatch(_sendCustomMessage({
                customData : {a:123},
                sendToRemote : false,
                CustomMessage
            }));

            expect(mockSaveMessage).toHaveBeenCalled();
            expect(mockSaveMessage.mock.calls[0][0].customData).toEqual({a:123});
        });
    });

    describe('测试renderCustomMessage',()=>{

        const { renderCustomMessage } = require('../customMessage');

        test('报错测试',()=>{
            expect(()=>dispatch(renderCustomMessage({
                type : 1111,
            }))).toThrowError('没有找到type为1111的自定义消息，渲染失败。');
        });
    });

});




