/* global jest test expect describe*/

import 'react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const store = mockStore({});
const { dispatch } = store;

const appId = 'aaa', appKey = 'bbb', owner = { id : 1 , avatar : 'xxx' , nickname : 'xxxxx'};

/**
 * 对createIMClient的模拟
 */
const mockRealtime = jest.fn();
const mockCreateIMClient = jest.fn(()=>()=>Promise.resolve({
    im:{on:jest.fn},
    realtime:{on:mockRealtime}
}));
jest.mock('../createIMClient',()=>{
    return {
        createIMClient : (appId,ownerId)=>
        mockCreateIMClient(appId,ownerId)
    };
});

/**
 * 测试 actions - imInit
 */
const { imInit } = require('../index.js');

describe('对actions.imInit()的测试',()=>{

    const config = { appId, appKey, owner, };

    test('参数缺失应该抛出错误',()=>{
        expect(imInit({}))
            .toThrowError('im初始化必须有 Leancloud appId');
        expect(imInit({appId}))
            .toThrowError('im初始化必须有 Leancloud appKey');
        expect(imInit({appId,appKey}))
            .toThrowError('im初始化必须要有owner对象');
        expect(imInit({appId,appKey,owner : {id:null}}))
            .toThrowError('im初始化必须要有owner.id');
        expect(imInit({appId,appKey,owner : {id:1}}))
            .toThrowError('im初始化必须要有owner.avatar');
    });

    test('actions.imInit() 异步测试',()=>{
        return dispatch(imInit(config)).then(()=>{
            expect(mockRealtime).toHaveBeenCalledTimes(3);
            expect(mockRealtime.mock.calls[0][0]).toBe('disconnect');

            expect(mockCreateIMClient.mock.calls[0][0])
                .toBe(config.appId);
            expect(mockCreateIMClient.mock.calls[0][1])
                .toBe(config.owner.id);
        }).catch(console.log);
    });

});




