/**
 * 根容器组件
 *
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
    ownerId : 1,
});

const AppRouters = StackNavigator(Router);

import React from 'react';
export default ()=><AppRouters onNavigationStateChange={null} />;







