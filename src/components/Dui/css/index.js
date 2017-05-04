import EStyleSheet from 'react-native-extended-stylesheet';
import { theme } from '../Dui.config.js';
import base from './base';

import RefreshControl from './DuiRefreshControl.style';
import ListItem from './ListItem.style';
import Body from './Body.style';

/*
 * 获取合并后的样式
 *
 * @name getStyles
 * @function
 */
const getStyles = ()=>Object.assign({}, theme, base,
    RefreshControl,
    ListItem,
    Body
);

EStyleSheet.build({});

export {
    base,
    getStyles,
};

export default EStyleSheet.create(getStyles());











