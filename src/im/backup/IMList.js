/*
 *
 *      IM 列表
 *
 *
 */

import {
    ListView
} from 'react-native';

import {
    Actions
} from 'react-native-router-flux';

import {
    connect,
} from 'react-redux';

import UI from './IMLIST_UI.js';
import IM from './index.js';
import { Store } from '../Redux';
import Notification from '../Notification';

import moment from 'moment';
import '../../node_modules/moment/locale/zh-cn';
moment.locale('zh-cn');

let allUnReadCount = 0;
let _factory = (items)=>{

    allUnReadCount = 0;
    let product = Object.values(items).map((item)=>{
        let {
            lastMessage,
            lastMessageAt,
            unreadMessagesCount,
        } = item;

        allUnReadCount = allUnReadCount + Number(unreadMessagesCount || 0);

        let m = '无';
        if(lastMessage){
            if(typeof lastMessage === 'object'){
                let mm = lastMessage;

                if(mm.text){
                    m = mm.text;
                }else if(mm.thumb){
                    m = '[图片]';
                }else if(mm.location){
                    m = '[位置]';
                }
            }else if(typeof lastMessage === 'string'){
                m = lastMessage;
            }
        }
        let a = 0;
        if(/^\d+$/.test(lastMessageAt)){
            if(lastMessageAt){
                a = moment(new Date(lastMessageAt).getTime()).fromNow();
            }else{
                a = '-';
            }
        }else if(lastMessageAt){
            a = lastMessageAt;
        }

        item.lastMessage = m;
        item.lastMessageAt = a;

        return item;
    });


    return product;
};

let initialized = false;
let _refresh = (dispatch=Store.dispatch,promise)=>{

    if(IM.IMObject){
        _r();
    }else{
        IM.on('initialized',()=>{
            _r();
        });
    }

    function _r(){
        let im = IM.IMObject;

        console.log('开始刷新IM列表');
        dispatch({
            type : 'IM_SET_STATUS',
            state : {
                status : 'loading'
            }
        });

        var query = im.getQuery();
        query.withLastMessagesRefreshed(true).find().then((items)=>{
            console.log('读取远程聊天列表成功。',items.length);

            if(items.length === 0){
                dispatch({
                    type : 'IM_SET_STATUS',
                    state : {
                        status : 'empty'
                    }
                });
            }

            items.forEach((conversation)=>{
                _saveConversation(conversation,dispatch);
            });

            initialized = true;

            promise && promise.resolve();
        }).catch((err)=>{
            console.log('读取列表失败。',err);
            dispatch({
                type : 'IM_SET_STATUS',
                state : {
                    status : 'error'
                }
            });

            initialized = true;

            promise && promise.resolve();
        });
    }

    Notification.setIMBadge(allUnReadCount);
};

let _init = (dispatch=Store.dispatch)=>{
    return new Promise((resolve,reject)=>{
        if(!initialized){
            _refresh(dispatch,{resolve,reject});
        }else{
            resolve();
        }
    });
};

let _saveConversation = (conversation,dispatch=Store.dispatch)=>{
    let {
        id,
        lastMessage,
        lastMessageAt,
        members,
        unreadMessagesCount,
    } = conversation;

    let userInfo = conversation.get('userInfo');
    let order = conversation.get('order');
    let creator = conversation.creator;
    let creatorInfo = conversation.get('creatorInfo');

    if(!userInfo) return false;
    if(!userInfo.userid) return false;

    let state = {
        id,
        members,
        status : 'init',
        lastMessage : lastMessage ? IM.toJSON(lastMessage) : null,
        lastMessageAt : new Date(lastMessageAt).getTime(),
        userInfo : userInfo,
        order,
        creator,
        creatorInfo,
        unreadMessagesCount,
    };

    dispatch({
        type : 'IM_SET_STATUS',
        state : {
            status : 'done'
        }
    });

    dispatch({
        type : 'IM_SAVE',
        state : state,
    });
};

let _onPress = (conversation)=>{

    let {
        userInfo,
        creatorInfo,
        creator,
    } = conversation;

    let id = conversation.id;

    let target = String(creator) === String(global.userid) ? userInfo : creatorInfo;

    Actions.IM({
        id : id,
        userInfo : target,
    });
};

let _getStatusText = (status)=>{
    let t = '';
    switch(status){
        case 'init':{
            t = '正在初始化';
            break;
        }
        case 'loading':{
            t = '正在读取...';
            break;
        }
        case 'empty':{
            t = '您没有任何消息记录';
            break;
        }
        case 'error':{
            t = '读取消息记录时发生错误';
            break;
        }
    }
    return t;
};

let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, });
let mapStateToProps = (state,ownProps)=>{
    ownProps;

    let items = _factory(state.get('IM').items);
    return {
        dataSource : dataSource.cloneWithRows(items),
        lastId : items[items.length-1] ? items[items.length-1].id : 0,
        otherChild : ownProps.children,
        loading : state.get('IM').status === 'init' || state.get('IM').status === 'loading' || false,
        statusText : _getStatusText(state.get('IM').status),
        allUnReadCount,
        delay : initialized ? 0 : global.setting.navAnimateDuration
    };
};

let mapDispatchToProps = (dispatch,ownProps)=>{
    ownProps;

    return {
        _setBadge : (allUnReadCount)=>{
            let IMBadge = Store.getState().get('notification').get('IMBadge');
            if(IMBadge && IMBadge !== allUnReadCount){
                Notification.setIMBadge(allUnReadCount);
            }
        },
        _refresh : (x,promise)=>_refresh(dispatch,promise),
        _init : ()=>_init(dispatch),
        _onPress,
    };
};

let IMList_component = connect(
    mapStateToProps,
    mapDispatchToProps
)(UI);

IMList_component.save = _saveConversation;
IMList_component.refresh = _refresh;
export default IMList_component;












