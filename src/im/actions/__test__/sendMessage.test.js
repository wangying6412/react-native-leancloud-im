
import 'react';

import { store } from './mockStore.js';

const { dispatch } = store;

describe('对 actions - sendMessage 的测试',()=>{

    const { sendMessage } = require('../sendMessage.js');
    const actions = require('../index.js');

    test('报错测试',()=>{
        expect(sendMessage({}))
            .toThrowError('发送消息失败，没有找到message对象。');

        expect(sendMessage({message : {id:1}}))
            .toThrowError('发送消息失败，没有找到conversation对象。');
    });

    const _send = jest.fn(()=>Promise.resolve());
    const conversation = {
        id :1,
        send : _send,
    };

    test('功能测试',()=>{
        const spy = jest.spyOn(actions,'fetchState');
        const message = {
            id :1,
            getAttributes:()=>({}),
            setAttributes:()=>({}),
            getText:()=>'hello',
        };
        return dispatch(sendMessage({
            message,
            conversation,
            pushData : {},
        })).then(()=>{
            expect(_send).toHaveBeenCalledTimes(1);
            expect(_send.mock.calls[0][0]).toEqual(message);
            expect(spy).toHaveBeenCalledTimes(2);
        });
    });
});
