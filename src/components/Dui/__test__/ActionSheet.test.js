/*

    @name           ActionSheet
    @file           ActionSheet.test.js
    @author         lihaitang
    @createAt       2017-03-13 10:48:04

 */

jest.mock('react-native',()=>({ ActionSheetIOS : { showActionSheetWithOptions : (ops,callback)=>{
    let btns = ops.options;
    btns.forEach((str,i)=>{
        callback(i);
    });
}}}));

import ActionSheet from '../ActionSheet.js';

describe('ActionSheet',()=>{

    test('ActionSheet - 功能测试',()=>{

        let fn1 = jest.fn();
        let fn2 = jest.fn();

        ActionSheet({
            'hello' : fn1,
            onCancel : fn2,
        });

        expect(fn1).toHaveBeenCalled();
        expect(fn2).toHaveBeenCalled();

    });

});





