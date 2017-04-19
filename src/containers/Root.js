/**
 * 根容器组件
 *
 * @module Root
 * @author lihaitang
 * @version v0.0.1
 */

import { StackNavigator  } from 'react-navigation';
import Router from '../Router';

import {
    init
} from '../im';

init({
    appId : 'U5HyR6jYogivsvYwbqqJ0TpN-gzGzoHsz',
    appKey : 'ezu33v4s146aRw4oR7wfczJv',
});

const AppRouters = StackNavigator(Router);

export default AppRouters;







