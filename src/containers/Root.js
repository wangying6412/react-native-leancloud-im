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

import {
    imageFromAlbum
} from '../im/plugs/plug-image';

init({
    appId : 'U5HyR6jYogivsvYwbqqJ0TpN-gzGzoHsz',
    appKey : 'ezu33v4s146aRw4oR7wfczJv',
    plugs : [imageFromAlbum],
    owner : {
        id : 1,
        nickname : '棠爷',
        avatar : 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=331274247,2423621629&fm=23&gp=0.jpg',
    },
});

const AppRouters = StackNavigator(Router);

import React from 'react';
export default ()=><AppRouters onNavigationStateChange={null} />;

console.ignoredYellowBox = [
    'Warning: BackAndroid is deprecated.  Please use BackHandler instead.',
    'Setting a timer for a long period of time'
];







