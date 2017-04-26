/**
 *对action createChat 及相关action的测试
 */

import 'react';

import types from '../types.js';
import {
    mockFind,
    store,
    mockCreateConversation,
    mockGetConversation,
} from './mockStore.js';
const { getQuery } = store.getState().get('imClient');
const { dispatch } = store;

const conversationId = 'abc', userId = '456';

describe('对action.createChat进行测试',()=>{

    const { createChat } = require('../createChat');

    test('createChat用户ID是自己应该报错',()=>{
        return dispatch(createChat(1)).catch(err=>{
            expect(err.message)
                .toBe('创建聊天失败，您不能和自己聊天。');
        });
    });

    test('对createChat的异步测试1',()=>{
        return dispatch(createChat(userId)).then(()=>{
            expect(getQuery).toHaveBeenCalledTimes(1);
            expect(mockFind).toHaveBeenCalledTimes(1);
            expect(mockCreateConversation)
                .toHaveBeenCalledTimes(1);
        });
    });

    test('对createChat的异步测试2',()=>{
        store.clearActions();
        return dispatch(createChat(userId,conversationId)).then(()=>{
            expect(mockGetConversation.mock.calls[0][0])
                .toBe(conversationId);

            const actions = store.getActions();
            expect(actions[0].type).toBe(types.IM_STATUS);
            expect(actions[1].type).toBe(types.IM_SAVE_CONVERSATION);
        });
    });

});





