/**
 * im组件样式
 */

import {
    theme,
    css
} from '../../components/Dui';

import EStyleSheet from 'react-native-extended-stylesheet';

import inputer from './inputer';
import im from './im';

const { base} = css;

const _style = Object.assign(
    {},
    theme,
    base,
    im,
    inputer,
    {}
);

export default EStyleSheet.create(_style);

