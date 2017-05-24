/**
 * im 临时缓存
 */

import Immutable from 'immutable';

let cache = Immutable.fromJS({
    realtime : null,
    imClient : null,
    plugs : [],
});


/**
 * 获取缓存
 *
 * @param {string} name - 缓存的名字
 * @returns {any} cache - 返回缓存值
 */
const getCache = (name)=>{
    if(name){
        return cache.get(name);
    }else{
        return cache.toJS();
    }
};

/*
 * 设置缓存
 *
 * @param {string} name - 缓存的名称
 * @param {any} value - 缓存的值
 * @returns {any} cache - 返回已缓存的值
 */
const setCache = (name,value)=>{
    cache = cache.set(name,value);
    return getCache(name);
};

export {
    setCache,
    getCache,
};





