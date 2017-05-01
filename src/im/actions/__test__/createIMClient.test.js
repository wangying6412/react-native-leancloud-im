import 'react';

import { store } from './mockStore';
const { dispatch } = store;

const appId = 'aaa', ownerId = 1;


/**
 * 对leancloud-realtime的模拟
 */

/**
 * 引入间谍函数
 */
import { mockRealtime } from 'leancloud-realtime';

/**
 * 测试 action - createIMClient
 */
import { createIMClient } from '../createIMClient.js';
//const { createIMClient } = require('../createIMClient.js');
describe('测试 action - createIMClient',()=>{

    test('参数缺失应该报错',()=>{
        expect(createIMClient())
            .toThrowError('createIMClient必须有appId');
        expect(createIMClient(appId))
            .toThrowError('createIMClient必须有ownerId');
    });

    test('异步模拟测试',()=>{
        return dispatch(createIMClient(appId,ownerId)).then(()=>{
            expect(mockRealtime.mock.calls[0][0]).toBe(String(ownerId));
        });
    });
});







