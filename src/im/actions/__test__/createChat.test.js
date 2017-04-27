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

const conversationId = 'abc', members = ['456'];

describe('对action.createChat进行测试',()=>{

    const { createChat } = require('../createChat');

    test('createChat用户ID是自己应该报错',()=>{
        return dispatch(createChat([1])).catch(err=>{
            expect(err.message)
                .toBe('创建聊天失败，您不能和自己聊天。');
        });
    });

    test('对createChat的异步测试1',()=>{
        return dispatch(createChat(members)).then(()=>{
            expect(mockCreateConversation)
                .toHaveBeenCalledTimes(1);
        });
    });

    test('对createChat的异步测试2',()=>{
        store.clearActions();
        return dispatch(createChat(members,conversationId)).then(()=>{
            expect(mockGetConversation.mock.calls[0][0])
                .toBe(conversationId);

            const actions = store.getActions();
            expect(actions[0].type).toBe(types.IM_CHATING);
            expect(actions[1].type).toBe(types.IM_SAVE_CONVERSATION);
        });
    });

});





