/**
 * actions
 *
 * @module actions
 */

import createAction from 'redux-actions';
import AV from 'leancloud-storage';

/**
 * im初始化
 *
 * @function actions~IM_INIT
 * @param {object} appid_appkey Leancloud的appId及appkey
 * @example
 *
 * dispatch(im_init({ appId:'xxxx',appKey:'xxxxxx' }));
 */
export const IM_INIT = 'IM_INIT';
export const im_init = ({appId,appKey})=>{

    if(!appId)throw new Error('im初始化必须有 Leancloud appId');
    if(!appKey)throw new Error('im初始化必须有 Leancloud appKey');

    AV.init({appId,appKey});

    return {
        type : IM_INIT,
        payload : {appId,appKey}
    };
};



