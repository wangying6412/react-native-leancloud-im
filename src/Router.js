/**
 * 路由文件
 *
 * @module Router
 * @author lihaitang
 * @version v0.0.1
 */

import { TabNavigator } from 'react-navigation';

import ChatList from './components/ChatList';
import Friends from './components/Friends';
import Owner from './components/Owner';

import Chat from './components/Chat';

const Home = TabNavigator({
    ChatList: { screen: ChatList },
    Friends: { screen: Friends },
    Owner: { screen: Owner },
},{
    swipeEnabled : true,
    animationEnabled : false,
});

export default {
    Home : { screen : Home },
    Chat : { screen : Chat },
};
