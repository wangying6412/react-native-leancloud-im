/**
 *对action createChat 及相关action的测试
 */

import 'react';

import types from '../types.js';
import {
    store,
    mockCreateConversation,
    mockGetConversation,
} from './mockStore.js';
const { dispatch } = store;

const conversationId = 'abc', users = [
    {
        id : '456',
        avatar : 'xxx',
        nickname : 'xxxx',
    }
];

describe('对action.createChat进行测试',()=>{

    const { createChat } = require('../createChat');

    test('对createChat的异步测试1',()=>{
        return dispatch(createChat(users)).then(()=>{
            expect(mockCreateConversation)
                .toHaveBeenCalledTimes(1);
        });
    });

    test('createChat id缺失应该报错',()=>{
        return dispatch(createChat([{ id : null , avatar : 'xxx' , nickname : 'xxx'}])).catch(err=>{
            expect(err.message)
                .toBe('参数错误：用户对象必须包含id');
        });
    });

    test('createChat 头像缺失应该报错',()=>{
        return dispatch(createChat([{ id : 'xx' , avatar : null , nickname : 'xxx'}])).catch(err=>{
            expect(err.message)
                .toBe('参数错误：用户必须有头像');
        });
    });

    test('createChat 昵称缺失应该报错',()=>{
        return dispatch(createChat([{ id : 'xx' , avatar : 'xxx' , nickname : null}])).catch(err=>{
            expect(err.message)
                .toBe('参数错误：用户必须有昵称');
        });
    });

    test('createChat用户ID是自己应该报错',()=>{
        return dispatch(createChat([{ id : 1 , avatar : 'xxx' , nickname : 'xxx'}])).catch(err=>{
            expect(err.message)
                .toBe('创建聊天失败，您不能和自己聊天。');
        });
    });

    test('对createChat的异步测试2',()=>{
        store.clearActions();
        return dispatch(createChat(users,conversationId)).then(()=>{
            expect(mockGetConversation.mock.calls[0][0])
                .toBe(conversationId);

            const actions = store.getActions();
            expect(actions[0].type).toBe(types.IM_CHATING);
            expect(actions[1].type).toBe(types.IM_SAVE_CONVERSATION);
        });
    });

});





