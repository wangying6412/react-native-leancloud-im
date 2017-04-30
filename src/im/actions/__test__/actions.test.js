/**
 * 简短action的测试
 */

import 'react';

import types from '../types.js';

test('测试action - saveIm',()=>{

    const { saveIm } = require('../index.js');
    expect(saveIm('aaa')).toEqual({
        type : types.IM_SAVE_IM,
        payload : 'aaa'
    });

});


test('测试action - imStatus',()=>{

    const { imStatus } = require('../index.js');
    const { imChating } = require('../index.js');

    expect(imStatus('bbb')).toEqual({
        type : types.IM_STATUS,
        payload : 'bbb'
    });

    expect(imChating({ chating : true })).toEqual({
        type : types.IM_CHATING,
        payload : { chating : true }
    });
});

test('测试action - fetchState',()=>{

    const { fetchState } = require('../index.js');
    expect(fetchState('ccc','dd')).toEqual({
        type : types.IM_FETCH_STATE,
        payload : 'ccc',
        meta : 'dd'
    });

});

test('测试action - saveConversation',()=>{
    const { saveConversation } = require('../createChat.js');
    expect(saveConversation({
        id : 'abc',
        aa : 'bb',
    })).toMatchObject({
        type : types.IM_SAVE_CONVERSATION,
        payload : {
            id : 'abc'
        }
    });
});

test('测试action - saveRealtime',()=>{
    const { saveRealtime } = require('../createIMClient.js');
    expect(saveRealtime({
        id : 'abc',
        aa : 'bb',
    })).toMatchObject({
        type : types.IM_SAVE_REALTIME,
        payload : {
            id : 'abc'
        }
    });
});





