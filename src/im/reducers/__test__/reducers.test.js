/**
 * reducer 的单元测试
 */

import 'react';
import { createAction } from 'redux-actions';
import types from '../../actions/types.js';

test('reducer-imInit',()=>{
    const imInit = require('../imInit.js').default;
    const ops = {
        appId : 'aaa',
        appKey : 'bbb',
        ownerId : '123',
        messagesLimit : 50,
    };
    const action = createAction(types.IM_INIT);
    expect(imInit(undefined,action(ops)).toJS()).toEqual(ops);
});

test('reducer-imClient',()=>{
    const imClient = require('../imClient.js').default;
    const action = createAction(types.IM_SAVE_IM);
    expect(imClient(undefined,action({a:1}))).toEqual({a:1});
});

test('reducer-realtime',()=>{
    const realtime = require('../realtime.js').default;
    const action = createAction(types.IM_SAVE_REALTIME);
    expect(realtime(undefined,action({a:1}))).toEqual({a:1});
});

test('reducer-imStatus',()=>{
    const imStatus = require('../imStatus.js').default;
    const action1 = createAction(types.IM_STATUS);
    const action2 = createAction(types.IM_CHATING);
    expect(imStatus(undefined,action1('hello')).toJS()).toEqual({
        statusText : 'hello',
        chating : false
    });
    expect(imStatus(undefined,action2(true)).toJS()).toEqual({
        statusText : null,
        chating : true
    });
});


describe('reducer-fetchState',()=>{
    const fetchState = require('../fetchState.js').default;

    const action = createAction(types.IM_FETCH_STATE,undefined,(payload,meta)=>meta);

    test('测试出错',()=>{
        expect(fetchState(undefined,action(new Error('err'),'test')).get('test').get('errorText'))
            .toBe('err');
    });

    test('测试fetching',()=>{
        expect(fetchState(undefined,action('fetching','test')).get('test').toJS())
            .toMatchObject({
                isFetching : true,
                isRefresing : false,
                fetchedPageCount : 0,
                error : 'false',
                errorText : null,
            });
    });

    test('测试refreshing',()=>{
        expect(fetchState(undefined,action('refreshing','test')).get('test').toJS())
            .toMatchObject({
                isFetching : true,
                isRefresing : true,
                fetchedPageCount : 0,
            });
    });

    test('测试done',()=>{
        expect(fetchState(undefined,action('done','test')).get('test').toJS())
            .toMatchObject({
                isFetching : false,
                isRefresing : false,
                didInvalidate : false,
            });
    });
});

describe('测试reducer.entities.conversations',()=>{
    const reducer_conversations = require('../entities.conversations.js').default;
    const action = createAction(types.IM_SAVE_CONVERSATION);
    expect(reducer_conversations(undefined,action({id:'aa'})).toJS())
        .toEqual({
            aa : {
                id : 'aa'
            }
        });
});

describe('测试reducer.entities.messages',()=>{
    const reducer_messages = require('../entities.messages.js').default;
    const action = createAction(types.IM_SAVE_MESSAGE);
    expect(reducer_messages(undefined,action({id:'aa'})).toJS())
        .toEqual({
            aa : {
                id : 'aa'
            }
        });
});

describe('测试reducer.customMessages',()=>{
    const customMessages = require('../customMessages.js').default;
    const action = createAction(types.IM_REGISTER_CUSTOMMESSAGE);

    expect(customMessages(undefined,action({
        type : 123,
        render : ()=>{},
        instance : {}
    })).get(123).toJS())
        .toMatchObject({
            type : 123,
            instance : {}
        });
});











