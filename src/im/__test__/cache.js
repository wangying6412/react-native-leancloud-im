
import 'react';

describe('对 im cache组件的测试',()=>{
    const { getCache,setCache } = require('../cache.js');

    test('setCache 输入应该等于输出',()=>{
        expect(setCache('test','hello world')).toBe('hello world');
        expect(getCache('test')).toBe('hello world 123');
    });
});
