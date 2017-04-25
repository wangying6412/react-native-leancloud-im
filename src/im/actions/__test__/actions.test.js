/* global jest test expect describe*/

/**
 * actions 单元测试
 */
import 'react';
import 'react-native';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const mockStore = configureStore([thunk]);
const store = mockStore({});
const { dispatch } = store;

const appId = 'aaa', appKey = 'bbb', ownerId = 1;

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
 * actions - imInit
 */
import { imInit } from '../index.js';
describe('对actions.imInit()的测试',()=>{

    const config = { appId, appKey, ownerId, };

    test('参数缺失应该抛出错误',()=>{
        expect(imInit({}))
            .toThrowError('im初始化必须有 Leancloud appId');
        expect(imInit({appId}))
            .toThrowError('im初始化必须有 Leancloud appKey');
        expect(imInit({appId,appKey}))
            .toThrowError('im初始化必须要有ownerId');
    });

    test('actions.imInit() 异步测试',()=>{
        dispatch(imInit(config)).then(()=>{
            expect(mockRealtime).toHaveBeenCalledTimes(3);
            expect(mockRealtime.mock.calls[0][0]).toBe('disconnect');

            expect(mockCreateIMClient.mock.calls[0][0])
                .toBe(config.appId);
            expect(mockCreateIMClient.mock.calls[0][1])
                .toBe(config.ownerId);
        }).catch(console.log);
    });

});







