/**
 * dui 设置
 * @module Dui.config
 */

import {
    Dimensions,
    PixelRatio,
} from 'react-native';

const {
    height
} = Dimensions.get('window');

/**
 * 默认设置
 */
let options = {

    /**
     * logo
     */
    logo : './img/logo.png',

    /**
     * 场景切换动画时间
     */
    navAnimateDuration : 500,

};

/**
 * 样式
 */
let theme = {

    /**
     * 尺寸
     */
    $headHeight : 64,
    $footHeight : height*0.07,
    $stateBarHeight : 20,

    /**
     * 间隔
     */
    $spacing : 10,
    $onePx : 1/PixelRatio.get(),

    /**
     * 颜色
     */
    $red : '#de6e00',
    $green : '#1fd89c',
    $blue : '#00c3d9',
    $yellow : '#f4c60e',
    $gray : '#808080',
};

/**
 * 设置dui样式
 *
 * @name setTheme
 * @function
 * @access public
 * @param {Object} _theme - 颜色，尺寸等
 */
function setTheme(_theme){
    Object.assign(theme,_theme);
}

/**
 * dui基础设置
 *
 * @name config
 * @function
 * @param {Object} ops - 设置参数
 */
function config(ops={}){
    Object.assign(options,ops);
}

export default config;
export {
    setTheme,
    options,
    theme,
};



