/**
 * @module Dui.css
 */

import EStyleSheet from 'react-native-extended-stylesheet';
import { styleOptions } from '../Dui.config.js';
import base from './base';

import RefreshControl from './DuiRefreshControl.style';

/**
 * 获取合并后的样式
 *
 * @name getStyles
 * @function
 */
export const getStyles = ()=>Object.assign({}, styleOptions, base,
    RefreshControl
);

export default EStyleSheet.create(getStyles());











